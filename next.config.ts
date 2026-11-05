import createMDX from "@next/mdx"
import type { NextConfig } from "next"

import { contentSecurityPolicy, STATIC_SECURITY_HEADERS } from "./lib/security-headers"

const isDev = process.env.NODE_ENV !== "production"

// W42: a narrow policy; lib/security-headers.ts says why scripts keep 'unsafe-inline'.
const csp = contentSecurityPolicy({ dev: isDev })

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // Minimal self-contained server for the container image (see Dockerfile).
  output: "standalone",
  poweredByHeader: false,
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
          ...STATIC_SECURITY_HEADERS,
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

export default createMDX({})(nextConfig)
