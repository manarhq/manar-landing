import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { analyticsAllowed, hasPrivacySignal, parseConsent, pickUtm, shouldAskForConsent } from "./consent.ts"

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

describe("rejection persistence", () => {
  const now = Date.UTC(2026, 9, 8)

  it("remembers a rejection exactly as long as an acceptance", () => {
    for (const analytics of [true, false]) {
      const day300 = parseConsent(JSON.stringify({ v: 1, analytics, ts: now - 300 * 864e5 }), now)
      assert.deepEqual(day300, { v: 1, analytics, ts: now - 300 * 864e5 })
      assert.equal(parseConsent(JSON.stringify({ v: 1, analytics, ts: now - 366 * 864e5 }), now), null)
    }
  })

  it("does not ask again after a stored rejection", () => {
    const rejected = { v: 1 as const, analytics: false, ts: now }
    assert.equal(shouldAskForConsent(rejected, false, true), false)
    assert.equal(analyticsAllowed(rejected, false, true), false)
  })
})

describe("browser privacy signals", () => {
  const accepted = { v: 1 as const, analytics: true, ts: Date.UTC(2026, 9, 8) }

  it("reads Global Privacy Control and Do Not Track", () => {
    assert.equal(hasPrivacySignal({ globalPrivacyControl: true }), true)
    assert.equal(hasPrivacySignal({ doNotTrack: "1" }), true)
    assert.equal(hasPrivacySignal({ globalPrivacyControl: false, doNotTrack: "0" }), false)
    assert.equal(hasPrivacySignal({ doNotTrack: "unspecified" }), false)
    assert.equal(hasPrivacySignal(undefined), false)
  })

  it("treats a signal as a rejection: no banner, no beacon, even over a stored acceptance", () => {
    assert.equal(shouldAskForConsent(null, true, true), false)
    assert.equal(analyticsAllowed(null, true, true), false)
    assert.equal(analyticsAllowed(accepted, true, true), false)
  })

  it("asks only when a token is configured, and loads only after acceptance", () => {
    assert.equal(shouldAskForConsent(null, false, false), false)
    assert.equal(analyticsAllowed(accepted, false, false), false)
    assert.equal(shouldAskForConsent(null, false, true), true)
    assert.equal(analyticsAllowed(null, false, true), false)
    assert.equal(analyticsAllowed(accepted, false, true), true)
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
