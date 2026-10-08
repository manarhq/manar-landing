import type { MetadataRoute } from "next"

import { locales } from "@/lib/i18n/config"
import { getContent } from "@/lib/content/load"
import { localizedAlternates, localizedPath, siteOrigin, type SitePath } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin()
  const { legal } = await getContent("en")
  // Legal pages carry a stored "last updated" date, so only they report lastModified.
  const legalUpdated: Partial<Record<SitePath, string>> = {
    "/privacy": legal.privacy.updated,
    "/cookies": legal.cookies.updated,
    "/terms": legal.terms.updated,
  }
  // /meet/confirm and /meet/manage are reached only from emailed links and are never indexed.
  const paths: SitePath[] = ["", "/meet", "/demo", "/privacy", "/cookies", "/terms"]

  // Only canonical, indexable pages belong here. The root redirects to /en.
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: new URL(localizedPath(locale, path), origin).href,
      alternates: { languages: localizedAlternates(path) },
      ...(legalUpdated[path] ? { lastModified: legalUpdated[path] } : {}),
    })),
  )
}
