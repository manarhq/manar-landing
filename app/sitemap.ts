import type { MetadataRoute } from "next"

import { locales } from "@/lib/i18n/config"
import { cookies } from "@/lib/legal/cookies"
import { privacy } from "@/lib/legal/privacy"
import { terms } from "@/lib/legal/terms"
import { localizedAlternates, localizedPath, siteOrigin, type SitePath } from "@/lib/site"

// Legal pages carry a stored "last updated" date, so only they report lastModified.
const legalUpdated: Partial<Record<SitePath, string>> = {
  "/privacy": privacy.en.updated,
  "/cookies": cookies.en.updated,
  "/terms": terms.en.updated,
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin()
  const paths: SitePath[] = ["", "/demo", "/privacy", "/cookies", "/terms"]

  // Only canonical, indexable pages belong here. The root redirects to /en.
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: new URL(localizedPath(locale, path), origin).href,
      alternates: { languages: localizedAlternates(path) },
      ...(legalUpdated[path] ? { lastModified: legalUpdated[path] } : {}),
    })),
  )
}
