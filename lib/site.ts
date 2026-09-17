import type { Metadata } from "next"

import { localeTag, locales, ogLocale, otherLocale, type Locale } from "./i18n/config"

export const CONTACT_EMAIL = "nofal@vax.sh"
export const VAX_URL = "https://vax.sh"
export const THEME_STORAGE_KEY = "manar-theme"

/**
 * Public origin from SITE_URL (for example https://manar.example). Read at build
 * time for prerendered pages. When unset, canonical and hreflang URLs are omitted
 * rather than pointing at an invented domain.
 */
export function siteOrigin(): URL | undefined {
  const raw = process.env.SITE_URL
  if (!raw) return undefined
  try {
    const url = new URL(raw)
    return url.protocol === "https:" || url.protocol === "http:" ? url : undefined
  } catch {
    return undefined
  }
}

export function localizedPath(locale: Locale, path = ""): string {
  return `/${locale}${path}`
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  siteName,
}: {
  locale: Locale
  path: "" | "/demo"
  title: string
  description: string
  siteName: string
}): Metadata {
  const origin = siteOrigin()
  const languages = Object.fromEntries(locales.map((l) => [localeTag[l], localizedPath(l, path)]))

  return {
    title,
    description,
    metadataBase: origin,
    alternates: origin
      ? {
          canonical: localizedPath(locale, path),
          languages: { ...languages, "x-default": localizedPath("en", path) },
        }
      : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      siteName,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[otherLocale(locale)]],
      ...(origin ? { url: localizedPath(locale, path) } : {}),
      images: origin
        ? [{ url: `/og/manar-${locale}.png`, width: 1200, height: 630, alt: siteName }]
        : undefined,
    },
    twitter: {
      card: origin ? "summary_large_image" : "summary",
      title,
      description,
    },
  }
}
