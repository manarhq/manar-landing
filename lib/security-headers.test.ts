import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { clientKey } from "./http.ts"
import { contentSecurityPolicy, previewFrameAncestor, STATIC_SECURITY_HEADERS } from "./security-headers.ts"

const directive = (csp: string, name: string) => csp.split("; ").find((d) => d.startsWith(`${name} `))

describe("security headers", () => {
  it("never allows framing by default, and only the admin origin for previews", () => {
    const csp = contentSecurityPolicy()
    assert.equal(directive(csp, "frame-ancestors"), "frame-ancestors 'none'")
    assert.equal(directive(csp, "object-src"), "object-src 'none'")
    assert.match(csp, /upgrade-insecure-requests/)
    assert.equal(
      directive(contentSecurityPolicy({ frameAncestor: "https://admin.example" }), "frame-ancestors"),
      "frame-ancestors https://admin.example"
    )
  })

  it("allows only the two third-party script origins it uses", () => {
    const origins = directive(contentSecurityPolicy(), "script-src")!.split(" ").filter((s) => s.startsWith("https://"))
    assert.deepEqual(origins, ["https://static.cloudflareinsights.com", "https://challenges.cloudflare.com"])
  })

  it("takes only an http(s) origin as the preview framer", () => {
    assert.equal(previewFrameAncestor("https://admin.example/some/path"), "https://admin.example")
    for (const bad of [
      undefined,
      "",
      "*",
      "'self'",
      "javascript:alert(1)",
      "admin.example",
      "https://a.example https://b.example",
      "https://*.example",
      "https://a.example;script-src 'unsafe-inline'",
      "https://a.example;sandbox",
      "https://user:pw@admin.example",
    ])
      assert.equal(previewFrameAncestor(bad), null, String(bad))
  })

  it("accepts an http admin origin only outside production", () => {
    assert.equal(previewFrameAncestor("http://localhost:3001", { production: false }), "http://localhost:3001")
    assert.equal(previewFrameAncestor("http://admin.example", { production: true }), null)
    assert.equal(previewFrameAncestor("https://admin.example", { production: true }), "https://admin.example")
  })

  it("sends nosniff, a referrer policy and COOP on every route", () => {
    const keys = STATIC_SECURITY_HEADERS.map((h) => h.key)
    for (const k of ["X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "Cross-Origin-Opener-Policy"])
      assert.ok(keys.includes(k), k)
  })
})

describe("client key", () => {
  const req = (headers: Record<string, string>) => new Request("http://x.test", { headers })

  it("keys on the address the nearest proxy appended, not the one the client wrote", () => {
    delete process.env.TRUSTED_CLIENT_IP_HEADER
    assert.equal(clientKey(req({ "x-forwarded-for": "1.2.3.4, 198.51.100.7" })), "198.51.100.7")
  })

  it("uses only the trusted edge header when one is configured", () => {
    process.env.TRUSTED_CLIENT_IP_HEADER = "x-edge-client-ip"
    assert.equal(clientKey(req({ "x-edge-client-ip": "203.0.113.5", "x-forwarded-for": "1.2.3.4" })), "203.0.113.5")
    assert.equal(clientKey(req({ "x-forwarded-for": "1.2.3.4" })), "unknown")
    delete process.env.TRUSTED_CLIENT_IP_HEADER
  })
})
