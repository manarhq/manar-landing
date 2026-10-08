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
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: true }]
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
    ]
  },
}

export default nextConfig
