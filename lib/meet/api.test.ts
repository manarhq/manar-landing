import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { formatTime, isUnavailable, mergeDays } from "./api.ts"

describe("mergeDays", () => {
  it("unions free times per UAE date, sorted, and skips hosts that failed", () => {
    const merged = mergeDays([
      [{ date: "2026-10-14", slots: ["2026-10-14T06:00:00Z", "2026-10-14T05:00:00Z"] }],
      null,
      [
        { date: "2026-10-15", slots: ["2026-10-15T05:00:00Z"] },
        { date: "2026-10-14", slots: ["2026-10-14T05:00:00Z", "2026-10-14T07:00:00Z"] },
      ],
    ])
    assert.deepEqual(merged, [
      { date: "2026-10-14", slots: ["2026-10-14T05:00:00Z", "2026-10-14T06:00:00Z", "2026-10-14T07:00:00Z"] },
      { date: "2026-10-15", slots: ["2026-10-15T05:00:00Z"] },
    ])
  })
})

describe("time display", () => {
  it("shows UAE time by default and the visitor's zone on request", () => {
    assert.equal(formatTime("2026-10-14T05:30:00Z", "en"), "09:30")
    assert.equal(formatTime("2026-10-14T05:30:00Z", "en", "Europe/London"), "06:30")
  })
})

describe("isUnavailable", () => {
  it("treats network failure, 503 and 404 as booking switched off, not as an error to retry", () => {
    assert.equal(isUnavailable({ ok: false, status: 0 }), true)
    assert.equal(isUnavailable({ ok: false, status: 503 }), true)
    assert.equal(isUnavailable({ ok: false, status: 500 }), false)
    assert.equal(isUnavailable({ ok: true, status: 200 }), false)
  })
})
