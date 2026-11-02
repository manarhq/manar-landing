import type { Metadata } from "next"

import { DEFAULT_SITE_URL } from "./hosts"
import { defaultLocale, localeTag, locales, ogLocale, otherLocale, type Locale } from "./i18n/config"

export const THEME_STORAGE_KEY = "manar-theme"

/** PostHog (EU) project key. Analytics and the consent banner exist only when it is set. */
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() || ""
/** PostHog EU ingestion host. */
export const POSTHOG_HOST = "https://eu.i.posthog.com"

export type SitePath = "" | "/meet" | "/demo" | "/privacy" | "/cookies" | "/terms" | "/acceptable-use" | "/dpa" | "/docs" | `/docs/${string}`

/** Where every "Book a meeting" link goes. The path is content (links.booking), editable in the CMS. */
export function bookingHref(locale: Locale, content: { links: { booking: string } }): string {
  return `/${locale}${content.links.booking}`
}

/** The written request form: the fallback whenever online booking is unavailable. */
export function requestHref(locale: Locale, content: { links: { requestForm: string } }): string {
  return `/${locale}${content.links.requestForm}`
}

/**
 * Shared build-time origin for metadata, robots, and the sitemap. The default is
 * the deployed public domain; an override must be an HTTP(S) origin, not a path.
 */
export function siteOrigin(): URL {
  const raw = process.env.SITE_URL?.trim() || DEFAULT_SITE_URL
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
  image,
}: {
  locale: Locale
  path: SitePath
  title: string
  description: string
  siteName: string
  /** Open Graph image from the content model; defaults to the bundled card for the locale. */
  image?: { src: string; alt: string }
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
      images: [{ url: image?.src ?? `/og/manar-${locale}.png`, width: 1200, height: 630, alt: image?.alt || siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
