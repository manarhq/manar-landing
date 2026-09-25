/**
 * schema.org JSON-LD for the home page, as one linked @graph so Google reads
 * the site, the company and the product as related entities. Pure (no path
 * aliases) so `node --test` can load it.
 *
 * The FAQPage entries are built from the same dictionary items the FAQ section
 * renders, so the markup never claims text the page does not show.
 */
export function homeStructuredData({
  origin,
  lang,
  description,
  faq,
  vaxUrl,
  email,
}: {
  origin: URL
  lang: string
  description: string
  faq: readonly { question: string; answer: string }[]
  vaxUrl: string
  email: string
}): string {
  const site = origin.href
  const page = new URL(`/${lang}`, origin).href
  const orgId = `${vaxUrl}/#organization`

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: "VAX",
        legalName: "VAX Labs Cloud Computing Services L.L.C S.P.C",
        url: vaxUrl,
        email,
        address: { "@type": "PostalAddress", addressLocality: "Abu Dhabi", addressCountry: "AE" },
        brand: { "@type": "Brand", name: "Manar", logo: new URL("/brand/manar-lighthouse.png", origin).href },
      },
      {
        "@type": "WebSite",
        "@id": `${site}#website`,
        name: "Manar",
        alternateName: "منار",
        url: site,
        inLanguage: lang,
        publisher: { "@id": orgId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${site}#software`,
        name: "Manar",
        applicationCategory: "SecurityApplication",
        operatingSystem: "Web",
        description,
        url: page,
        inLanguage: lang,
        publisher: { "@id": orgId },
      },
      {
        "@type": "FAQPage",
        "@id": `${page}#faq`,
        url: page,
        inLanguage: lang,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  }

  // Escape "<" so no dictionary text can close the surrounding <script>.
  return JSON.stringify(graph).replace(/</g, "\\u003c")
}
