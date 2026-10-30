/**
 * Response headers for every route (next.config.ts) and for preview pages (proxy.ts). No Next.js
 * imports, so `node --test` can load this file.
 *
 * Scripts keep 'unsafe-inline': the pages are prerendered and revalidated (ISR), so there is no
 * request to mint a nonce for, and the inline App Router payload differs per page, so it cannot be
 * hashed in a static header. A nonce CSP would make every page dynamic. What limits the exposure
 * instead: no visitor input is ever rendered as HTML, CMS content is plain text validated by the
 * shared schema, and script origins are an allow-list of two (consent-gated PostHog (bundled; it only
 * connects to the EU host) and Turnstile on the booking pages).
 */
export function contentSecurityPolicy({ dev = false, frameAncestor }: { dev?: boolean; frameAncestor?: string } = {}) {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://eu-assets.i.posthog.com https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self' https://eu.i.posthog.com https://eu-assets.i.posthog.com https://challenges.cloudflare.com",
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
export function previewFrameAncestor(
  raw: string | undefined,
  { production = process.env.NODE_ENV === "production" }: { production?: boolean } = {}
): string | null {
  try {
    const url = new URL(raw?.trim() ?? "")
    // The value goes into a CSP header: a plain DNS name or IP only, so `*`, `;` or a quote can
    // never widen the policy or add a directive.
    const plainHost = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i.test(url.hostname)
    // Production frames previews only from an https admin origin; http is for local development.
    const web = url.protocol === "https:" || (!production && url.protocol === "http:")
    return web && plainHost && !url.username && !url.password ? url.origin : null
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
