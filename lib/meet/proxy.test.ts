import assert from "node:assert/strict"
import { createServer, type IncomingHttpHeaders } from "node:http"
import type { AddressInfo } from "node:net"
import { after, before, describe, it } from "node:test"

import { forwardMeet } from "./proxy.ts"

// A stand-in for manar-site with its LandingOriginGuard: writes need an allowed Origin.
const LANDING_ORIGINS = ["https://manar.fixio.ae"]
const seen: { method?: string; url?: string; headers: IncomingHttpHeaders; body: string }[] = []
const site = createServer((req, res) => {
  let body = ""
  req.on("data", (c) => (body += c)).on("end", () => {
    seen.push({ method: req.method, url: req.url, headers: req.headers, body })
    res.setHeader("content-type", "application/json")
    if (req.method === "POST" && !LANDING_ORIGINS.includes(String(req.headers.origin))) {
      res.statusCode = 403
      return res.end(JSON.stringify({ error: "origin_not_allowed" }))
    }
    res.end(JSON.stringify({ ok: true }))
  })
})
let api = ""
before(async () => {
  await new Promise<void>((r) => site.listen(0, "127.0.0.1", r))
  api = `http://127.0.0.1:${(site.address() as AddressInfo).port}`
})
after(() => site.close())

const json = JSON.stringify({ hostKey: "any", slotStart: "2026-11-10T06:00:00Z" })
function post(headers: Record<string, string>, body = json) {
  return new Request("http://landing.internal/api/meet/bookings", {
    method: "POST",
    headers: { host: "manar.fixio.ae", "cf-connecting-ip": "203.0.113.7", ...headers },
    body,
  })
}
const browser = { origin: "https://manar.fixio.ae", "sec-fetch-site": "same-origin", "content-type": "application/json" }

describe("booking proxy (through a stand-in manar-site)", () => {
  it("forwards a same-site JSON write with the checked Origin, which the site's guard accepts", async () => {
    seen.length = 0
    const prev = process.env.TRUSTED_CLIENT_IP_HEADER
    process.env.TRUSTED_CLIENT_IP_HEADER = "cf-connecting-ip"
    const res = await forwardMeet(post(browser), ["bookings"], "POST", api)
    process.env.TRUSTED_CLIENT_IP_HEADER = prev
    assert.equal(res.status, 200)
    assert.equal(seen.length, 1)
    assert.equal(seen[0].headers.origin, "https://manar.fixio.ae")
    assert.equal(seen[0].headers["x-forwarded-for"], "203.0.113.7")
    assert.equal(seen[0].headers["content-type"], "application/json")
    assert.equal(seen[0].body, json)
  })

  it("accepts an older browser that sends Origin but no Sec-Fetch-Site", async () => {
    const noFetchMeta = { origin: browser.origin, "content-type": browser["content-type"] }
    assert.equal((await forwardMeet(post(noFetchMeta), ["bookings", "resend"], "POST", api)).status, 200)
  })

  it("refuses cross-site, origin-less, other-host and non-JSON writes before calling the site", async () => {
    seen.length = 0
    const cases: [Record<string, string>, number][] = [
      [{ ...browser, "sec-fetch-site": "cross-site" }, 403],
      [{ ...browser, "sec-fetch-site": "same-site" }, 403],
      [{ ...browser, origin: "https://evil.example" }, 403],
      [{ "content-type": "application/json", "sec-fetch-site": "same-origin" }, 403],
      [{ ...browser, origin: "null" }, 403],
      [{ ...browser, "content-type": "text/plain" }, 415],
      [{ ...browser, "content-type": "application/x-www-form-urlencoded" }, 415],
    ]
    for (const [headers, status] of cases) {
      const res = await forwardMeet(post(headers), ["manage", "cancel"], "POST", api)
      assert.equal(res.status, status, JSON.stringify(headers))
    }
    assert.equal(seen.length, 0)
  })

  it("passes reads without an Origin and keeps unknown paths out", async () => {
    seen.length = 0
    const get = new Request("http://landing.internal/api/meet/hosts", { headers: { host: "manar.fixio.ae" } })
    assert.equal((await forwardMeet(get, ["hosts"], "GET", api)).status, 200)
    assert.equal(seen[0].headers.origin, undefined)
    assert.equal((await forwardMeet(post(browser), ["admin"], "POST", api)).status, 404)
    assert.equal((await forwardMeet(post(browser), ["bookings"], "POST", null)).status, 503)
  })
})
