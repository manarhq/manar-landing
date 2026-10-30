/**
 * schema.org JSON-LD for the home page, as one linked @graph so Google reads
 * the site, the company and the product as related entities. Pure (no path
 * aliases) so `node --test` can load it.
 *
 * No FAQPage: the home page no longer shows an FAQ, and structured data must
 * never claim text the page does not show.
 */
export function homeStructuredData({
  origin,
  lang,
  description,
  vaxUrl,
  email,
  logo,
}: {
  origin: URL
  lang: string
  description: string
  vaxUrl: string
  email: string
  logo: string
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
        name: "Fixio",
        legalName: "Fixio",
        url: site,
        email,
        brand: { "@type": "Brand", name: "Manar", logo: new URL(logo, origin).href },
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
    ],
  }

  // Escape "<" so no dictionary text can close the surrounding <script>.
  return JSON.stringify(graph).replace(/</g, "\\u003c")
}
