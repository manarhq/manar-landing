import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { bundledContent } from "./index.ts"
import { siteContentSchema } from "./schema.ts"

describe("bundled content", () => {
  for (const locale of ["en", "ar"] as const) {
    it(`${locale} validates against the schema manar-site uses`, () => {
      const result = siteContentSchema.safeParse(bundledContent[locale])
      assert.ok(result.success, result.success ? "" : JSON.stringify(result.error.issues.slice(0, 5), null, 2))
    })
  }

  it("rejects dashes, banned words, markup and off-site booking links", () => {
    const bad = (patch: (c: typeof bundledContent.en) => void) => {
      const copy = structuredClone(bundledContent.en)
      patch(copy)
      return siteContentSchema.safeParse(copy).success
    }
    assert.equal(bad((c) => (c.hero.title = "Owners — for every action")), false)
    assert.equal(bad((c) => (c.hero.body = "A guaranteed result")), false)
    assert.equal(bad((c) => (c.closing.body = "<script>x</script>")), false)
    assert.equal(bad((c) => (c.links.booking = "https://evil.example/meet")), false)
    assert.equal(bad((c) => (c.images.deployment.src = "https://evil.example/a.png")), false)
  })
})
