/**
 * Response headers for every route (next.config.ts) and for preview pages (proxy.ts). No Next.js
 * imports, so `node --test` can load this file.
 *
 * Scripts keep 'unsafe-inline': the pages are prerendered and revalidated (ISR), so there is no
 * request to mint a nonce for, and the inline App Router payload differs per page, so it cannot be
 * hashed in a static header. A nonce CSP would make every page dynamic. What limits the exposure
 * instead: no visitor input is ever rendered as HTML, CMS content is plain text validated by the
 * shared schema, and script origins are an allow-list of two (the consent-gated Cloudflare beacon,
 * and Turnstile on the booking pages).
 */
export function contentSecurityPolicy({ dev = false, frameAncestor }: { dev?: boolean; frameAncestor?: string } = {}) {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://static.cloudflareinsights.com https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self' https://cloudflareinsights.com https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "worker-src 'self' blob:",
    `frame-ancestors ${frameAncestor ?? "'none'"}`,
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    ...(dev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ")
}

/** The admin console's origin, the only page allowed to frame a preview; null when unset or not http(s). */
export function previewFrameAncestor(raw: string | undefined): string | null {
  try {
    const url = new URL(raw?.trim() ?? "")
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : null
  } catch {
    return null
  }
}

/** HSTS is not here: the nginx edge sets it (deploy/nginx), and a second, different value would conflict. */
export const STATIC_SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
]
