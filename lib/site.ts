import type { Metadata } from "next"

import { defaultLocale, localeTag, locales, ogLocale, otherLocale, type Locale } from "./i18n/config"

export const CONTACT_EMAIL = "nofal@vax.sh"
export const VAX_URL = "https://vax.sh"
export const THEME_STORAGE_KEY = "manar-theme"

/** Cloudflare Web Analytics token. Analytics and the consent banner exist only when it is set. */
export const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim() || ""

export type SitePath = "" | "/demo" | "/privacy" | "/cookies" | "/terms"

/**
 * Shared build-time origin for metadata, robots, and the sitemap. The default is
 * the deployed public domain; an override must be an HTTP(S) origin, not a path.
 */
export function siteOrigin(): URL {
  const raw = process.env.SITE_URL?.trim() || "https://manar.vax.sh"
  try {
    const url = new URL(raw)
    if (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash
    ) {
      return new URL(url.origin)
    }
  } catch {
    // Fail the build instead of publishing invalid canonical or sitemap URLs.
  }
  throw new Error("SITE_URL must be an absolute HTTP(S) origin without credentials, a path, query, or fragment")
}

export function localizedPath(locale: Locale, path = ""): string {
  return `/${locale}${path}`
}

export function localizedAlternates(path: SitePath): Record<string, string> {
  const origin = siteOrigin()
  return {
    ...Object.fromEntries(
      locales.map((locale) => [localeTag[locale], new URL(localizedPath(locale, path), origin).href]),
    ),
    "x-default": new URL(localizedPath(defaultLocale, path), origin).href,
  }
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  siteName,
}: {
  locale: Locale
  path: SitePath
  title: string
  description: string
  siteName: string
}): Metadata {
  const origin = siteOrigin()

  return {
    title,
    description,
    metadataBase: origin,
    alternates: {
      canonical: localizedPath(locale, path),
      languages: localizedAlternates(path),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      siteName,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[otherLocale(locale)]],
      url: localizedPath(locale, path),
      images: [{ url: `/og/manar-${locale}.png`, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
