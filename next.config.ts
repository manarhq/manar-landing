import type { NextConfig } from "next"

const isDev = process.env.NODE_ENV !== "production"

// W42: a narrow policy. Inline scripts are required by statically prerendered App Router pages
// (no per-request nonce). Third-party origins: the consent-gated analytics beacon, and Cloudflare
// Turnstile, which loads only on the booking pages when a site key is configured.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://static.cloudflareinsights.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ")

const nextConfig: NextConfig = {
  // Minimal self-contained server for the container image (see Dockerfile).
  output: "standalone",
  poweredByHeader: false,
  images: {
    // AVIF first, WebP for browsers without it; next/image picks per request.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: true },
      // Admin preview links (<site>/<locale>?preview=<token>) go through the token check first.
      {
        source: "/:lang(en|ar)",
        has: [{ type: "query", key: "preview", value: "(?<token>[A-Za-z0-9_-]{1,200})" }],
        destination: "/api/preview?token=:token&path=/:lang",
        permanent: false,
      },
      {
        source: "/:lang(en|ar)/:rest(.+)",
        has: [{ type: "query", key: "preview", value: "(?<token>[A-Za-z0-9_-]{1,200})" }],
        destination: "/api/preview?token=:token&path=/:lang/:rest",
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
      {
        // A browser in preview (draft mode cookie) sees unpublished drafts: never index, never store.
        source: "/:path*",
        has: [{ type: "cookie", key: "__prerender_bypass" }],
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ]
  },
}

export default nextConfig
