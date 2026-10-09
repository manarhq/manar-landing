import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { safePreviewPath, safePreviewToken } from "./paths.ts"

describe("preview entry", () => {
  it("only returns to a same-site page of a known locale", () => {
    assert.deepEqual(safePreviewPath("/en"), { path: "/en", locale: "en" })
    assert.deepEqual(safePreviewPath("/ar/meet"), { path: "/ar/meet", locale: "ar" })
    for (const bad of [null, "", "/", "/fr", "//evil.example", "/en//x", "/en/../admin", "https://evil.example", "/en?x=1", "/en/"])
      assert.equal(safePreviewPath(bad), null, String(bad))
  })

  it("accepts URL-safe tokens only", () => {
    assert.equal(safePreviewToken("abc_DEF-123"), "abc_DEF-123")
    for (const bad of [null, "", "a b", "a/b", "x".repeat(201), "<script>"]) assert.equal(safePreviewToken(bad), null)
  })
})
