import type { MetadataRoute } from "next"

import { locales } from "@/lib/i18n/config"
import { localizedAlternates, localizedPath, siteOrigin } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin()
  const paths = ["", "/demo"] as const

  // Only canonical, indexable pages belong here. The root redirects to /en.
  // Omit lastModified until actual content modification dates are available.
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: new URL(localizedPath(locale, path), origin).href,
      alternates: { languages: localizedAlternates(path) },
    })),
  )
}
