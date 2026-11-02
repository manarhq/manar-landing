import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { parseSiteOrigin, publicStatus } from "./config.ts"

describe("booking config", () => {
  it("treats an unset or invalid SITE_API_URL as booking off", () => {
    for (const raw of [undefined, "", "  ", "not a url", "ftp://x.example"]) assert.equal(parseSiteOrigin(raw), null)
  })
  it("keeps only the origin of a valid URL", () => {
    assert.equal(parseSiteOrigin(" https://site.example/api/ "), "https://site.example")
  })
  it("maps every upstream 5xx to 503 so the browser shows the fallback", () => {
    assert.equal(publicStatus(500), 503)
    assert.equal(publicStatus(502), 503)
    assert.equal(publicStatus(409), 409)
  })
})
