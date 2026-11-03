import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { SITEVERIFY, turnstileEnabled, verifyTurnstile } from "./turnstile.ts"

// Cloudflare's published test keys (https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
const PASS_SITE = "1x00000000000000000000AA"
const PASS_SECRET = "1x0000000000000000000000000000000AA"
const FAIL_SECRET = "2x0000000000000000000000000000000AA"
const SPENT_SECRET = "3x0000000000000000000000000000000AA"
const DUMMY = "XXXX.DUMMY.TOKEN.XXXX"

/** Answers like siteverify does for the test secrets; records what was posted. */
function stub(extra: Record<string, unknown> = {}) {
  const posts: { url: string; body: URLSearchParams }[] = []
  const fetchImpl = (async (url: string, init: RequestInit) => {
    const body = new URLSearchParams(String(init.body))
    posts.push({ url, body })
    const secret = body.get("secret")
    const answer =
      secret === PASS_SECRET
        ? { success: true, "error-codes": [], hostname: "example.com", action: "", ...extra }
        : secret === FAIL_SECRET
          ? { success: false, "error-codes": ["invalid-input-response"] }
          : secret === SPENT_SECRET
            ? { success: false, "error-codes": ["timeout-or-duplicate"] }
            : { success: false, "error-codes": ["invalid-input-secret"] }
    return new Response(JSON.stringify(answer), { status: 200 })
  }) as unknown as typeof fetch
  return { posts, fetchImpl }
}

describe("turnstile", () => {
  it("is on only with both keys", () => {
    assert.equal(turnstileEnabled({ siteKey: "", secret: "" }), false)
    assert.equal(turnstileEnabled({ siteKey: PASS_SITE, secret: " " }), false)
    assert.equal(turnstileEnabled({ siteKey: undefined, secret: PASS_SECRET }), false)
    assert.equal(turnstileEnabled({ siteKey: PASS_SITE, secret: PASS_SECRET }), true)
  })

  it("skips the check without keys and calls nothing", async () => {
    const { posts, fetchImpl } = stub()
    assert.equal(await verifyTurnstile({ siteKey: PASS_SITE, secret: undefined, fetchImpl }, DUMMY, "1.2.3.4", "demo"), "off")
    assert.equal(posts.length, 0)
  })

  it("passes, fails and spends like the test secrets", async () => {
    const { posts, fetchImpl } = stub()
    const cfg = (secret: string) => ({ siteKey: PASS_SITE, secret, fetchImpl, hostnames: ["manar.fixio.ae"] })
    assert.equal(await verifyTurnstile(cfg(PASS_SECRET), DUMMY, "203.0.113.7", "demo"), "passed")
    assert.equal(await verifyTurnstile(cfg(FAIL_SECRET), DUMMY, "203.0.113.7", "demo"), "failed")
    assert.equal(await verifyTurnstile(cfg(SPENT_SECRET), DUMMY, "203.0.113.7", "demo"), "failed")
    assert.equal(posts[0].url, SITEVERIFY)
    assert.equal(posts[0].body.get("response"), DUMMY)
    assert.equal(posts[0].body.get("remoteip"), "203.0.113.7")
  })

  it("refuses a missing or oversized token without calling Cloudflare", async () => {
    const { posts, fetchImpl } = stub()
    const cfg = { siteKey: PASS_SITE, secret: PASS_SECRET, fetchImpl }
    assert.equal(await verifyTurnstile(cfg, "", "1.2.3.4", "demo"), "failed")
    assert.equal(await verifyTurnstile(cfg, undefined, "1.2.3.4", "demo"), "failed")
    assert.equal(await verifyTurnstile(cfg, "x".repeat(2049), "1.2.3.4", "demo"), "failed")
    assert.equal(posts.length, 0)
  })

  it("lets requests through when the secret is wrong or Cloudflare is down", async () => {
    const { fetchImpl } = stub()
    assert.equal(await verifyTurnstile({ siteKey: PASS_SITE, secret: "wrong", fetchImpl }, DUMMY, "", "demo"), "unavailable")
    const down = (async () => {
      throw new TypeError("fetch failed")
    }) as unknown as typeof fetch
    assert.equal(await verifyTurnstile({ siteKey: PASS_SITE, secret: PASS_SECRET, fetchImpl: down }, DUMMY, "", "demo"), "unavailable")
    const http500 = (async () => new Response("oops", { status: 500 })) as unknown as typeof fetch
    assert.equal(await verifyTurnstile({ siteKey: PASS_SITE, secret: PASS_SECRET, fetchImpl: http500 }, DUMMY, "", "demo"), "unavailable")
  })

  it("refuses a token solved for another form or another site", async () => {
    const other = stub({ action: "booking", hostname: "manar.fixio.ae" })
    assert.equal(
      await verifyTurnstile({ siteKey: PASS_SITE, secret: PASS_SECRET, fetchImpl: other.fetchImpl }, DUMMY, "", "demo"),
      "failed"
    )
    const elsewhere = stub({ action: "demo", hostname: "admin-manar.fixio.ae" })
    assert.equal(
      await verifyTurnstile(
        { siteKey: PASS_SITE, secret: PASS_SECRET, fetchImpl: elsewhere.fetchImpl, hostnames: ["manar.fixio.ae"] },
        DUMMY,
        "",
        "demo"
      ),
      "failed"
    )
    const ours = stub({ action: "demo", hostname: "manar.fixio.ae" })
    assert.equal(
      await verifyTurnstile({ siteKey: PASS_SITE, secret: PASS_SECRET, fetchImpl: ours.fetchImpl, hostnames: ["manar.fixio.ae"] }, DUMMY, "", "demo"),
      "passed"
    )
  })

  it("matches the real siteverify with the test secrets (TURNSTILE_LIVE=1)", { skip: !process.env.TURNSTILE_LIVE }, async () => {
    assert.equal(await verifyTurnstile({ siteKey: PASS_SITE, secret: PASS_SECRET, hostnames: ["manar.fixio.ae"] }, DUMMY, "", "demo"), "passed")
    assert.equal(await verifyTurnstile({ siteKey: PASS_SITE, secret: FAIL_SECRET }, DUMMY, "", "demo"), "failed")
    assert.equal(await verifyTurnstile({ siteKey: PASS_SITE, secret: SPENT_SECRET }, DUMMY, "", "demo"), "failed")
  })
})
