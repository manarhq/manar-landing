import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { homeStructuredData } from "./structured-data.ts"

function parse() {
  const json = homeStructuredData({
    origin: new URL("https://manar.fixio.ae"),
    lang: "en",
    description: "Not with </script> in it.",
    vaxUrl: "https://vax.sh",
    email: "info@fixio.ae",
    logo: "/brand/manar-lighthouse.png",
  })
  return { json, graph: JSON.parse(json)["@graph"] as Record<string, unknown>[] }
}

describe("homeStructuredData", () => {
  it("emits no FAQPage, because the page shows no FAQ", () => {
    assert.ok(!parse().graph.some((node) => node["@type"] === "FAQPage"))
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
