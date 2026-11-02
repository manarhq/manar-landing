import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { isMeetPath, pathOnly, scrubEvent } from "./analytics-privacy.ts"

describe("analytics privacy", () => {
  it("skips every /meet route", () => {
    for (const p of ["/en/meet", "/ar/meet/confirm", "/en/meet/manage", "/meet/manage"]) assert.equal(isMeetPath(p), true, p)
    for (const p of ["/en", "/en/docs/meetings", "/en/pricing", "/en/meeting"]) assert.equal(isMeetPath(p), false, p)
  })
  it("keeps only origin and path", () => {
    assert.equal(pathOnly("https://manar.fixio.ae/en/meet/manage?token=SECRET#x"), "https://manar.fixio.ae/en/meet/manage")
    assert.equal(pathOnly("/en/meet?token=SECRET"), "/en/meet?token=SECRET") // not absolute: left alone, never sent as $current_url
    assert.equal(pathOnly("hello?x=1"), "hello?x=1")
  })
  it("scrubs URL properties in events, including referrers and $set_once", () => {
    const out = scrubEvent({
      properties: {
        $current_url: "https://manar.fixio.ae/en/meet/confirm?token=SECRET",
        $referrer: "https://manar.fixio.ae/en/meet/manage?token=SECRET#a",
        $pathname: "/en/docs",
        n: 3,
      },
      $set_once: { $initial_current_url: "https://manar.fixio.ae/en?token=SECRET", $initial_referrer: "$direct" },
    })!
    assert.doesNotMatch(JSON.stringify(out), /SECRET|token=/)
    assert.equal(out.properties!.n, 3)
    assert.equal(out.properties!.$pathname, "/en/docs")
    assert.equal(out.$set_once!.$initial_referrer, "$direct")
    assert.equal(scrubEvent(null), null)
  })
})
