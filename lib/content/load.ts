import "server-only"

import { cookies, draftMode } from "next/headers"
import { cache } from "react"

import type { Locale } from "@/lib/i18n/config"
import { PREVIEW_COOKIE, safePreviewToken } from "@/lib/preview/paths"

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
 * The unpublished draft for a locale (GET /public/content/:locale/preview?token=), never cached.
 * Null when the token is refused, the API is unreachable, or the draft fails the schema.
 */
export async function fetchPreviewContent(locale: Locale, token: string): Promise<SiteContent | null> {
  const origin = siteApiOrigin()
  if (!origin) return null
  try {
    const response = await fetch(`${origin}/public/content/${locale}/preview?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) return null
    const parsed = publishedContentSchema.safeParse(await response.json())
    if (!parsed.success) console.warn("site_content_preview_invalid", { locale, issues: parsed.error.issues.length })
    return parsed.success ? parsed.data.content : null
  } catch {
    return null
  }
}

/** True while this browser is in preview (draft mode on and a preview token cookie set). */
export const isPreviewing = cache(async (): Promise<boolean> => {
  if (!(await draftMode()).isEnabled) return false
  return Boolean(safePreviewToken((await cookies()).get(PREVIEW_COOKIE)?.value ?? null))
})

/**
 * The content for a locale: in preview, the draft; otherwise the published document from manar-site (GET /public/content/:locale), cached with
 * the "site-content" tag. Falls back to the bundled document when SITE_API_URL is unset, the API is
 * unreachable or slow, or the answer does not validate, so the site never breaks on the CMS.
 */
export const getContent = cache(async (locale: Locale): Promise<SiteContent> => {
  // Preview: draft mode makes Next render per request, so the draft is never cached or shared.
  if (await isPreviewing()) {
    const token = safePreviewToken((await cookies()).get(PREVIEW_COOKIE)?.value ?? null)
    const draft = token ? await fetchPreviewContent(locale, token) : null
    if (draft) return draft
  }
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
