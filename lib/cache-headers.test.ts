import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"

const root = join(import.meta.dirname, "..")
const confPath = join(root, "deploy/nginx/manar.conf")
// The image build runs `npm test` without deploy/ (.dockerignore); CI runs it on the full checkout.
const hasConf = existsSync(confPath)
const conf = hasConf ? readFileSync(confPath, "utf8") : ""

/** The text of the last `location <selector> { ... }` block in the 443 server. */
function block(selector: string): string {
  const start = conf.lastIndexOf(`location ${selector} {`)
  assert.ok(start >= 0, `nginx has no location ${selector}`)
  return conf.slice(start, conf.indexOf("\n    }", start))
}

describe("nginx cache headers", { skip: !hasConf && "deploy/ is not in the image build context" }, () => {
  it("lets /media/ keep the app's immutable header (the catch-all forces max-age=0)", () => {
    const media = block("^~ /media/")
    assert.ok(!media.includes("max-age=0"))
    assert.ok(!media.includes("proxy_hide_header Cache-Control"))
    assert.ok(block("/").includes("max-age=0"), "pages still revalidate")
  })

  it("caches /fonts/ for a year, immutable", () => {
    assert.match(block("^~ /fonts/"), /Cache-Control "public, max-age=31536000, immutable"/)
  })
})

describe("fingerprinted fonts", () => {
  const dir = join(root, "public/fonts")
  const fonts = readdirSync(dir).filter((f) => f.endsWith(".woff2"))

  it("every font name carries the first 8 hex of its own sha256", () => {
    assert.ok(fonts.length > 0)
    for (const f of fonts) {
      const hash = createHash("sha256").update(readFileSync(join(dir, f))).digest("hex").slice(0, 8)
      assert.ok(f.endsWith(`.${hash}.woff2`), `${f} should end with .${hash}.woff2`)
    }
  })

  it("the stylesheet and preloads only reference fonts that exist", () => {
    const refs = [
      ...readFileSync(join(root, "app/fonts.css"), "utf8").matchAll(/\/fonts\/([\w.-]+\.woff2)/g),
      ...readFileSync(join(root, "lib/fonts.ts"), "utf8").matchAll(/\/fonts\/([\w.-]+\.woff2)/g),
    ].map((m) => m[1])
    assert.ok(refs.length >= 4)
    for (const r of refs) assert.ok(fonts.includes(r), `${r} is referenced but missing`)
  })
})

describe("dependencies", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
  it("ships no @mdx-js/react and keeps @types/mdx out of production", () => {
    assert.equal(pkg.dependencies["@mdx-js/react"], undefined)
    assert.equal(pkg.dependencies["@types/mdx"], undefined)
    assert.ok(pkg.devDependencies["@types/mdx"])
  })
  it("has no unused image optimiser formats (the site uses no next/image)", () => {
    assert.ok(!readFileSync(join(root, "next.config.ts"), "utf8").includes("formats:"))
  })
})
