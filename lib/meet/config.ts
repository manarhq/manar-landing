/** Pure helpers for the booking proxy, kept free of server-only imports so tests can run them. */

/** manar-site's origin from a raw SITE_API_URL, or null when unset or not an http(s) URL. */
export function parseSiteOrigin(raw: string | undefined): string | null {
  const value = raw?.trim()
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : null
  } catch {
    return null
  }
}

/** Any upstream server error is "booking_unavailable" to the browser, which then shows the fallback. */
export const publicStatus = (upstream: number): number => (upstream >= 500 ? 503 : upstream)
