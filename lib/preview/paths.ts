/**
 * Preview helpers with no Next.js imports, so `node --test` can load them.
 * Staff open `<site>/<locale>[/<page>]?preview=<token>`; see app/api/preview/route.ts.
 */
export const PREVIEW_COOKIE = "manar-preview"
/** manar-site issues preview tokens for one hour. */
export const PREVIEW_MAX_AGE_SECONDS = 3600

/** A same-site page path such as "/en" or "/ar/meet". Anything else is refused (no open redirect). */
export function safePreviewPath(raw: string | null): { path: string; locale: "en" | "ar" } | null {
  if (!raw) return null
  const match = /^\/(en|ar)(\/[a-z0-9-]+)*$/.exec(raw)
  return match ? { path: raw, locale: match[1] as "en" | "ar" } : null
}

/** manar-site accepts tokens of 1 to 200 characters; we also refuse anything that is not URL-safe. */
export function safePreviewToken(raw: string | null): string | null {
  return raw && /^[A-Za-z0-9_-]{1,200}$/.test(raw) ? raw : null
}
