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
    assert.equal(bad((c) => (c.hero.title = "Owners \u2014 for every action")), false)
    assert.equal(bad((c) => (c.hero.body = "A guaranteed result")), false)
    assert.equal(bad((c) => (c.closing.body = "<script>x</script>")), false)
    assert.equal(bad((c) => (c.links.booking = "https://evil.example/meet")), false)
    assert.equal(bad((c) => (c.images.deployment.src = "https://evil.example/a.png")), false)
  })

  it("closes the image path bypasses: protocol-relative, dot segments, SVG", () => {
    const img = (src: string) => {
      const copy = structuredClone(bundledContent.en)
      copy.images.deployment.src = src
      return siteContentSchema.safeParse(copy).success
    }
    assert.equal(img("/photo/lighthouse-dawn.webp"), true)
    assert.equal(img("//evil.example/x.png"), false)
    assert.equal(img("/photo/../../etc/x.png"), false)
    assert.equal(img("/./photo/x.png"), false)
    assert.equal(img("/photo//x.png"), false)
    assert.equal(img("/brand/logo.svg"), false)
    assert.equal(img("/photo/x.png?track=1"), false)
  })

  it("only links to allowlisted https hosts, parsed like a browser", () => {
    const link = (vax: string) => {
      const copy = structuredClone(bundledContent.en)
      copy.links.vax = vax
      return siteContentSchema.safeParse(copy).success
    }
    assert.equal(link("https://vax.sh"), true)
    assert.equal(link("https://manar.fixio.ae/en"), true)
    assert.equal(link("http://vax.sh"), false)
    assert.equal(link("https://evil.example"), false)
    assert.equal(link("https://vax.sh.evil.example"), false)
    assert.equal(link("https://vax.sh@evil.example"), false)
    assert.equal(link("https://user:pw@vax.sh"), false)
    assert.equal(link("https://vax.sh\\@evil.example"), false)
    assert.equal(link("https://evil.example\\vax.sh"), false)
    assert.equal(link("https://vax.sh/\u0000x"), false)
    assert.equal(link("javascript:alert(1)"), false)
    assert.equal(link("//vax.sh"), false)
  })

  it("normalises with NFKC before the dash, word and markup checks", () => {
    const title = (value: string) => {
      const copy = structuredClone(bundledContent.en)
      copy.hero.title = value
      return siteContentSchema.safeParse(copy).success
    }
    assert.equal(title("Owners \u2012 everywhere"), false)
    assert.equal(title("Owners \u2015 everywhere"), false)
    assert.equal(title("\uff1cb\uff1ebold"), false)
    assert.equal(title("\uff47uaranteed owners"), false)
    assert.equal(title("Every AI action has an owner."), true)
  })

  it("accepts contact addresses only at the allowed domains", () => {
    const mail = (email: string) => {
      const copy = structuredClone(bundledContent.en)
      copy.links.support = email
      return siteContentSchema.safeParse(copy).success
    }
    assert.equal(mail("support@fixio.ae"), true)
    assert.equal(mail("someone@evil.example"), false)
    assert.equal(mail("support@fixio.ae.evil.example"), false)
    assert.equal(mail("not-an-email"), false)
  })
})
