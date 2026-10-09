import { NextResponse } from "next/server"

import { contentSecurityPolicy, previewFrameAncestor } from "@/lib/security-headers"

/**
 * Preview only (the matcher): the admin console frames `<site>/<locale>?preview=<token>`, so a
 * browser in draft mode, and the /api/preview hop that switches it on, may be framed by
 * ADMIN_ORIGIN and by nothing else. Every other response keeps frame-ancestors 'none'
 * (next.config.ts). Unset ADMIN_ORIGIN: previews are not frameable either.
 */
export default function proxy() {
  const res = NextResponse.next()
  const admin = previewFrameAncestor(process.env.ADMIN_ORIGIN)
  if (admin) {
    res.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicy({ dev: process.env.NODE_ENV !== "production", frameAncestor: admin })
    )
  }
  return res
}

export const config = {
  matcher: [
    { source: "/((?!_next/static|_next/image|.*\\..*).*)", has: [{ type: "cookie", key: "__prerender_bypass" }] },
    "/api/preview",
  ],
}
