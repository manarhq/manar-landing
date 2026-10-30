import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { describe, it } from "node:test"

/** Pins the Midnight palette (spec 4.8) and WCAG contrast for every text and fill pair in both themes. */
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`\n${selector} {`)
  assert.ok(start >= 0, selector)
  const body = css.slice(start, css.indexOf("\n}", start))
  return Object.fromEntries([...body.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})\s*;/g)].map((m) => [m[1], m[2]]))
}
const light = block(":root")
const dark = block(".dark")

const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe("Midnight tokens", () => {
  it("uses the spec palette", () => {
    assert.equal(dark.page, "#02070a")
    assert.equal(light.brand, "#0297de")
    assert.equal(dark.brand, "#0297de")
    assert.equal(dark.wait, "#fc734d")
    assert.equal(dark.deny, "#ff5470")
    assert.equal(light.deny, "#c8102e")
    assert.equal(light.allow, "#0277b6")
    assert.equal(light.wait, "#b4451f")
  })
  for (const [name, t] of [["light", light], ["dark", dark]] as const) {
    it(`${name}: text pairs reach 4.5:1`, () => {
      for (const bg of ["page", "surface", "elevated"]) {
        assert.ok(ratio(t.text, t[bg]) >= 4.5, `text on ${bg}`)
        assert.ok(ratio(t["muted-text"], t[bg]) >= 4.5, `muted on ${bg}`)
      }
      for (const s of ["allow", "wait", "deny"]) {
        assert.ok(ratio(t[s], t[`${s}-soft`]) >= 4.5, `${s} on ${s}-soft`)
        assert.ok(ratio(t[s], t.page) >= 4.5, `${s} on page`)
      }
      assert.ok(ratio(t["brand-text"], t.brand) >= 4.5, "button label on blue")
      assert.ok(ratio(t["brand-text"], t["brand-hover"]) >= 4.5, "button label on blue hover")
      assert.ok(ratio(t["deny-text"], t.deny) >= 4.5, "button label on deny")
      assert.ok(ratio(t["deny-text"], t["deny-hover"]) >= 4.5, "button label on deny hover")
      assert.ok(ratio(t.focus, t.page) >= 3, "focus ring")
      assert.ok(ratio(t["line-strong"], t.page) >= 3, "input border")
    })
  }
  it("Midnight label on orange reaches 4.5:1", () => assert.ok(ratio("#02070a", "#fc734d") >= 4.5))
})
