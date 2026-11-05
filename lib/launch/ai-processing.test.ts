import assert from "node:assert/strict"
import { describe, it } from "node:test"

const flat = (v: unknown): string[] => (typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(flat) : [])

describe("AI processing is stated plainly (decision 11, revised 5 Nov)", async () => {
  const { legalDoc } = await import("./legal.ts")

  for (const lang of ["en", "ar"] as const) {
    for (const page of ["dpa", "privacy"] as const) {
      it(`${lang}/${page}: Azure OpenAI row says outside the UAE, and the AI text covers DLP, switch-off and Government`, () => {
        const text = flat(legalDoc(lang, page)).join("\n")
        if (lang === "en") {
          assert.match(text, /including outside the UAE\); stored in UAE North/)
          assert.match(text, /redacts sensitive data/)
          assert.match(text, /Allow external AI/)
          assert.match(text, /self-hosted/)
          assert.doesNotMatch(text, /—|–/)
        } else {
          assert.match(text, /ومنها خارج الإمارات/)
          assert.match(text, /DLP|تحجب/)
          assert.match(text, /الذكاء الاصطناعي الخارجي/)
          assert.match(text, /مستضاف ذاتياً/)
        }
      })
    }
  }

  it("the DPA has its own section, linked to the console setting", () => {
    const section = legalDoc("en", "dpa").sections.find((s) => s.id === "ai-processing")
    assert.ok(section)
    assert.match(flat(section).join(" "), /\/settings\/ai/)
    assert.ok(legalDoc("ar", "dpa").sections.some((s) => s.id === "ai-processing"))
  })
})
