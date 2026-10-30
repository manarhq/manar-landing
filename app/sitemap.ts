import type { MetadataRoute } from "next"

import { locales } from "@/lib/i18n/config"
import { docSlugs } from "@/lib/launch/copy"
import { legalDoc } from "@/lib/launch/legal"
import { localizedAlternates, localizedPath, siteOrigin, type SitePath } from "@/lib/site"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin()
  // Legal pages carry a stored "last updated" date, so only they report lastModified.
  const legalUpdated: Partial<Record<SitePath, string>> = {
    "/privacy": legalDoc("en", "privacy").updated,
    "/cookies": legalDoc("en", "cookies").updated,
    "/terms": legalDoc("en", "terms").updated,
    "/acceptable-use": legalDoc("en", "acceptable-use").updated,
  }
  // /meet/confirm and /meet/manage are reached only from emailed links and are never indexed.
  const paths: SitePath[] = ["", "/meet", "/demo", "/privacy", "/cookies", "/terms", "/acceptable-use", "/docs", ...docSlugs.map((s) => `/docs/${s}` as SitePath)]

  // Only canonical, indexable pages belong here. The root redirects to /en.
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: new URL(localizedPath(locale, path), origin).href,
      alternates: { languages: localizedAlternates(path) },
      ...(legalUpdated[path] ? { lastModified: legalUpdated[path] } : {}),
    })),
  )
}
