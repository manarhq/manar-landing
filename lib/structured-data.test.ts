import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { homeStructuredData } from "./structured-data.ts"

const faq = [
  { question: "What does Manar govern?", answer: "The AI systems you register." },
  { question: "Can text break out?", answer: "Not with </script> in it." },
]

function parse() {
  const json = homeStructuredData({
    origin: new URL("https://manar.vax.sh"),
    lang: "en",
    description: "AI governance.",
    faq,
    vaxUrl: "https://vax.sh",
    email: "nofal@vax.sh",
  })
  return { json, graph: JSON.parse(json)["@graph"] as Record<string, unknown>[] }
}

describe("homeStructuredData", () => {
  it("emits one FAQ question per visible dictionary item, verbatim", () => {
    const faqPage = parse().graph.find((node) => node["@type"] === "FAQPage") as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[]
    }
    assert.deepEqual(
      faqPage.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text })),
      faq,
    )
  })

  it("links the site and the product to the publishing organization", () => {
    const { graph } = parse()
    const org = graph.find((node) => node["@type"] === "Organization")
    for (const type of ["WebSite", "SoftwareApplication"]) {
      const node = graph.find((n) => n["@type"] === type) as { publisher: { "@id": string } }
      assert.equal(node.publisher["@id"], org?.["@id"])
    }
  })

  it("never lets dictionary text close the script tag", () => {
    assert.ok(!parse().json.includes("</script>"))
  })
})
