import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { describe, it } from "node:test"

import { text } from "../content/schema.ts"
import { cellLabel, coverageRows, coverageText, type CellId } from "./coverage.ts"
import { docSlugs, launchCopy } from "./copy.ts"
import { planOrder, pricingText } from "./pricing.ts"

/** All leaf strings of a value, with their paths. */
function leaves(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`))
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => leaves(v, `${path}.${k}`))
  return []
}
const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]))
      : typeof value

describe("launch strings", () => {
  const all = { copy: launchCopy, pricing: pricingText, coverage: coverageText }
  it("pass the content rules: no dashes, no banned words, no markup", () => {
    for (const [path, value] of leaves(all)) {
      if (value === "") continue // an empty string is a deliberate "nothing here" (hero feed rows)
      assert.ok(text.safeParse(value).success, `${path}: ${value}`)
    }
  })
  it("EN and AR have the same shape", () => {
    for (const [name, pair] of Object.entries(all)) {
      const strip = (o: object) => ({ ...o, rowNames: undefined }) // rowNames exists only where names are translated
      assert.deepEqual(shape(strip(pair.en)), shape(strip(pair.ar)), name)
    }
  })
})

describe("coverage matrix (spec section 6)", () => {
  const row = (id: string) => coverageRows.find((r) => r.id === id)!
  it("has the six rows in spec order", () => {
    assert.deepEqual(coverageRows.map((r) => r.id), ["claude-code", "cursor", "cli-agents", "editors", "desktop", "cloud"])
  })
  it("claims hooks only for Claude Code", () => {
    assert.equal(row("claude-code").approve.id, "yes_hook")
    assert.equal(row("claude-code").blocked.id, "yes")
    for (const id of ["editors", "desktop"]) {
      assert.equal(row(id).approve.id, "mcp_only")
      assert.equal(row(id).blocked.id, "linux_yes_windows_vault")
    }
  })
  it("shows Being verified, with the guaranteed minimum, where the spec says if hooks verified", () => {
    for (const id of ["cursor", "cli-agents"]) {
      assert.equal(row(id).approve.id, "verifying")
      assert.equal(row(id).blocked.id, "verifying")
      assert.ok(row(id).approve.floor && row(id).blocked.floor)
    }
    assert.equal(row("cursor").approve.floor, "mcp_only")
    assert.equal(row("cli-agents").approve.floor, "gateway_mcp")
    assert.equal(row("cursor").blocked.floor, "linux_yes_windows_vault")
    assert.equal(cellLabel("en", row("cursor").approve).text, "Being verified")
  })
  it("cloud agents: gated by the MCP gateway, secrets not applicable", () => {
    assert.equal(row("cloud").approve.id, "yes_mcp_gateway")
    assert.equal(row("cloud").alert.id, "na")
    assert.equal(row("cloud").blocked.id, "na")
  })
  it("every cell id has an English and Arabic label", () => {
    const ids = new Set<CellId>(coverageRows.flatMap((r) => [r.seen, r.approve, r.alert, r.blocked]).flatMap((c) => [c.id, ...(c.floor ? [c.floor] : [])]))
    for (const id of ids) for (const l of ["en", "ar"] as const) assert.ok(coverageText[l].cells[id], `${l} ${id}`)
  })
})

describe("pricing (spec 2 item 8)", () => {
  const en = pricingText.en.plans
  it("lists the four plans with the decided prices", () => {
    assert.deepEqual(planOrder, ["free", "pro", "company", "enterprise"])
    assert.equal(en.free.price, "$0")
    assert.equal(en.pro.price, "$9")
    assert.equal(en.pro.alt, "or $90 per year")
    assert.equal(en.company.price, "$15")
    assert.equal(en.enterprise.price, null)
  })
  it("states the free and Pro limits", () => {
    assert.deepEqual(en.free.features, ["3 devices", "10 agents", "30-day audit", "1 cloud agent"])
    for (const f of ["10 devices", "Unlimited agents", "1-year audit", "5 cloud agents", "TLS inspection", "Priority email support"]) {
      assert.ok(en.pro.features.includes(f), f)
    }
  })
  it("states VAT and the billable user rule", () => {
    assert.match(pricingText.en.vat, /UAE VAT of 5%/)
    assert.match(en.company.note ?? "", /enrolled device or a console sign-in/)
  })
})

describe("docs", () => {
  const dir = new URL("../../content/docs/", import.meta.url)
  it("every slug has an EN and AR MDX file, and nothing else is there", () => {
    for (const l of ["en", "ar"]) {
      const files = readdirSync(new URL(`${l}/`, dir)).sort()
      assert.deepEqual(files, docSlugs.map((s) => `${s}.mdx`).sort(), l)
    }
  })
  it("docs prose has no dashes or banned words", () => {
    for (const l of ["en", "ar"]) {
      for (const s of docSlugs) {
        const body = readFileSync(new URL(`${l}/${s}.mdx`, dir), "utf8")
        assert.doesNotMatch(body, /[‒-―]/, `${l}/${s} dash`)
        assert.doesNotMatch(body, /\b(immutable|unhackable|tamper-proof|guaranteed|provably safe|production-ready|seamless)\b|100% safe/i, `${l}/${s} banned`)
      }
    }
  })
  it("install page carries the four one-liners", () => {
    const en = readFileSync(new URL("en/install.mdx", dir), "utf8")
    for (const c of [
      "irm https://console-manar.vax.sh/i/<code> | iex",
      "curl -fsSL https://console-manar.vax.sh/i/<code>.sh | sudo sh",
      "irm https://console-manar.vax.sh/i/uninstall | iex",
      "curl -fsSL https://console-manar.vax.sh/i/uninstall.sh | sudo sh",
    ]) assert.ok(en.includes(c), c)
  })
})

describe("legal drafts", () => {
  it("validate against the legal schema in both languages and name Fixio", async () => {
    const { legalDocSchema } = await import("../content/schema.ts")
    const { legalDoc, legalPaths } = await import("./legal.ts")
    for (const l of ["en", "ar"] as const) {
      for (const p of legalPaths) {
        const doc = legalDoc(l, p)
        const r = legalDocSchema.safeParse(doc)
        assert.ok(r.success, `${l}/${p}: ${r.success ? "" : JSON.stringify(r.error.issues.slice(0, 3))}`)
        assert.doesNotMatch(JSON.stringify(doc), /VAX Labs/, `${l}/${p}`)
      }
      assert.match(JSON.stringify(legalDoc(l, "terms")), /Fixio/)
      assert.match(JSON.stringify(legalDoc(l, "privacy")), /Azure/)
      assert.match(JSON.stringify(legalDoc(l, "privacy")), /UAE North/)
    }
  })
})
