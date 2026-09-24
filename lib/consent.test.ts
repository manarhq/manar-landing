import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { parseConsent, pickUtm } from "./consent.ts"

describe("parseConsent", () => {
  const now = Date.UTC(2026, 8, 25)

  it("accepts a current, well-formed choice", () => {
    assert.deepEqual(parseConsent(JSON.stringify({ v: 1, analytics: true, ts: now - 1000 }), now), {
      v: 1,
      analytics: true,
      ts: now - 1000,
    })
  })

  it("asks again after a year, for future timestamps, and for malformed values", () => {
    assert.equal(parseConsent(JSON.stringify({ v: 1, analytics: true, ts: now - 366 * 864e5 }), now), null)
    assert.equal(parseConsent(JSON.stringify({ v: 1, analytics: true, ts: now + 864e5 }), now), null)
    assert.equal(parseConsent(JSON.stringify({ v: 2, analytics: true, ts: now }), now), null)
    assert.equal(parseConsent(JSON.stringify({ v: 1, analytics: "yes", ts: now }), now), null)
    assert.equal(parseConsent("{not json", now), null)
    assert.equal(parseConsent(null, now), null)
  })
})

describe("pickUtm", () => {
  it("keeps only allowlisted, bounded campaign fields", () => {
    assert.deepEqual(
      pickUtm("?utm_source=linkedin&utm_campaign=q4 launch&email=a@b.c&utm_medium=" + "x".repeat(101)),
      { utm_source: "linkedin", utm_campaign: "q4 launch" },
    )
  })

  it("rejects markup and control characters", () => {
    assert.deepEqual(pickUtm("?utm_source=%3Cscript%3E&utm_term=a%0Ab"), {})
  })
})
