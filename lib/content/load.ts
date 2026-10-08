import "server-only"

import { cache } from "react"

import type { Locale } from "@/lib/i18n/config"

import { bundledContent } from "./index"
import { publishedContentSchema, type SiteContent } from "./schema"

export const CONTENT_TAG = "site-content"
/** Seconds a fetched document is reused before a background refresh. Publishing also revalidates at once. */
const REVALIDATE_SECONDS = 60
const TIMEOUT_MS = 3000

/** manar-site's origin, or null when unset or not an http(s) origin. */
export function siteApiOrigin(): string | null {
  const raw = process.env.SITE_API_URL?.trim()
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : null
  } catch {
    return null
  }
}

/**
 * The published content for a locale, from manar-site (GET /public/content/:locale), cached with
 * the "site-content" tag. Falls back to the bundled document when SITE_API_URL is unset, the API is
 * unreachable or slow, or the answer does not validate, so the site never breaks on the CMS.
 */
export const getContent = cache(async (locale: Locale): Promise<SiteContent> => {
  const origin = siteApiOrigin()
  if (!origin) return bundledContent[locale]
  try {
    const response = await fetch(`${origin}/public/content/${locale}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [CONTENT_TAG] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`status ${response.status}`)
    const parsed = publishedContentSchema.safeParse(await response.json())
    if (!parsed.success) throw new Error("published content failed validation")
    return parsed.data.content
  } catch (error) {
    // Only the reason, never content (README: logs carry no payloads).
    console.warn("site_content_fallback", { locale, reason: error instanceof Error ? error.message : "unknown" })
    return bundledContent[locale]
  }
})
