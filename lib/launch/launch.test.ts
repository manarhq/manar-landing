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
  it("has the rows in spec order", () => {
    assert.deepEqual(coverageRows.map((r) => r.id), ["claude-code", "cursor", "cli-agents", "codex-cli", "editors", "desktop", "chatgpt-desktop", "cloud"])
  })
  it("claims hooks only for tools whose docs confirm a pre-action hook", () => {
    for (const id of ["claude-code", "cursor", "cli-agents"]) assert.equal(row(id).approve.id, "yes_hook")
    for (const id of ["claude-code", "cursor", "cli-agents"]) assert.equal(row(id).blocked.id, "yes")
    for (const id of ["editors", "desktop"]) {
      assert.equal(row(id).approve.id, "mcp_only")
      assert.equal(row(id).blocked.id, "linux_yes_windows_vault")
    }
  })
  it("Codex CLI is not claimed as a hook: its owner must review the hook first", () => {
    assert.equal(row("codex-cli").approve.id, "gateway_mcp")
  })
  it("ChatGPT desktop cannot be gated, and the table says so", () => {
    assert.equal(row("chatgpt-desktop").approve.id, "observed_only")
    assert.equal(cellLabel("en", row("chatgpt-desktop").approve).text, "Seen and alerted only")
  })
  it("no cell is left as Being verified", () => {
    for (const r of coverageRows) for (const c of [r.seen, r.approve, r.alert, r.blocked]) assert.notEqual(c.id, "verifying")
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

describe("pricing (pay-as-you-go, 4 Nov 2026)", async () => {
  const { PRICE, aed, proMonthly, companyMonthly, creditPacksFor } = await import("./pricing.ts")
  const en = pricingText.en
  it("lists the four plans with the decided prices", () => {
    assert.deepEqual(planOrder, ["free", "pro", "company", "enterprise"])
    assert.equal(en.plans.free.price, "$0")
    assert.equal(en.plans.pro.price, "$5")
    assert.match(en.plans.pro.alt ?? "", /\$50 a year/)
    assert.equal(en.plans.company.price, "$15")
    assert.match(en.plans.company.alt ?? "", /Minimum 3 seats/)
    assert.equal(en.plans.enterprise.price, null)
  })
  it("computes the examples from the same numbers", () => {
    assert.equal(proMonthly(2), 5)
    assert.equal(proMonthly(4), 9)
    assert.equal(companyMonthly(5), 75)
    assert.equal(companyMonthly(2), 45)
    assert.equal(creditPacksFor(1200, PRICE.aiIncluded), 1)
    const shown = en.examples.map((e) => `${e.label}: ${e.price}`)
    assert.ok(shown.includes("2 laptops, normal use: $5 a month"), shown.join(" | "))
    assert.ok(shown.includes("A team of 5: $75 a month"), shown.join(" | "))
    assert.equal(aed(5), "18.36")
  })
  it("the FAQ answers what counts as active, zero credits and caps, in both languages", () => {
    for (const l of ["en", "ar"] as const) assert.equal(pricingText[l].faq.length, en.faq.length)
    const qs = en.faq.map((f) => f.q)
    for (const q of ["What counts as active?", "What happens at zero credits?", "How do caps and alerts work?"]) assert.ok(qs.includes(q), q)
    const zero = en.faq.find((f) => f.q === "What happens at zero credits?")!
    assert.match(zero.a, /Safety keeps working/)
  })
  it("never names the retired launch offer or the old prices", () => {
    const all = JSON.stringify(pricingText)
    assert.doesNotMatch(all, /\$9 per month|\$90|3 months|launch offer|first 100/i)
  })
  it("states VAT", () => {
    assert.match(en.vat, /UAE VAT of 5%/)
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
      "irm https://console-manar.fixio.ae/i/<code> | iex",
      "curl -fsSL https://console-manar.fixio.ae/i/<code>.sh | sudo sh",
      "irm https://console-manar.fixio.ae/i/uninstall | iex",
      "curl -fsSL https://console-manar.fixio.ae/i/uninstall.sh | sudo sh",
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
      // Pay-as-you-go terms: credits validity, no refund on a ban, VAT; no old prices.
      const terms = JSON.stringify(legalDoc(l, "terms"))
      for (const must of ["12", "5%", "$5", "$15"]) assert.ok(terms.includes(must), `${l} terms names ${must}`)
      assert.doesNotMatch(terms, /\$9 |\$90|30-day trial|تجربة 30 يوماً/, `${l} terms old prices`)
      assert.match(JSON.stringify(legalDoc(l, "privacy")), /Azure/)
      assert.match(JSON.stringify(legalDoc(l, "privacy")), /UAE North/)
    }
  })

  it("carry no placeholders, TRN or licence number, and name the provider and privacy contact", async () => {
    const { legalDoc, legalPaths } = await import("./legal.ts")
    assert.ok((legalPaths as readonly string[]).includes("dpa"))
    for (const l of ["en", "ar"] as const) {
      for (const p of legalPaths) {
        const strings = (v: unknown): string[] => (typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [])
        for (const s of strings(legalDoc(l, p))) assert.doesNotMatch(s, /[[\]]|\bTRN\b|licen[cs]e (number|no)/i, `${l}/${p}: ${s}`)
        assert.equal(legalDoc(l, p).updated, p === "terms" ? "2026-11-04" : "2026-11-02", `${l}/${p}`)
      }
      for (const p of ["privacy", "terms", "dpa"] as const) {
        assert.match(JSON.stringify(legalDoc(l, p)), /Fixio Technologies LLC SPC/, `${l}/${p}`)
        assert.match(JSON.stringify(legalDoc(l, p)), /privacy@fixio\.ae/, `${l}/${p}`)
      }
      const privacy = JSON.stringify(legalDoc(l, "privacy"))
      for (const law of ["2016/679", "45", "CCPA", "CPRA"]) assert.ok(privacy.includes(law), `${l} privacy names ${law}`)
    }
  })
})

describe("discord link", async () => {
  const { discordUrl } = await import("./discord.ts")
  it("shows the Discord link only for an https URL", () => {
    const prev = process.env.MANAR_DISCORD_URL
    try {
      process.env.MANAR_DISCORD_URL = "https://discord.gg/abc"
      assert.equal(discordUrl(), "https://discord.gg/abc")
      for (const bad of ["", "javascript:alert(1)", "http://discord.gg/abc", "nonsense"]) {
        process.env.MANAR_DISCORD_URL = bad
        assert.equal(discordUrl(), null)
      }
    } finally {
      if (prev === undefined) delete process.env.MANAR_DISCORD_URL
      else process.env.MANAR_DISCORD_URL = prev
    }
  })
})
