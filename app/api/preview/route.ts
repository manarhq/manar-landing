import { cookies, draftMode } from "next/headers"

import { fetchPreviewContent } from "@/lib/content/load"
import { PREVIEW_COOKIE, PREVIEW_MAX_AGE_SECONDS, safePreviewPath, safePreviewToken } from "@/lib/preview/paths"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const noStore = { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" }

/**
 * Entry point for the admin editor's preview links (next.config.ts redirects `?preview=<token>`
 * here). The token is checked with manar-site first; only then is draft mode switched on for this
 * browser and the token kept in an httpOnly cookie, so it leaves the address bar.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const target = safePreviewPath(url.searchParams.get("path"))
  const token = safePreviewToken(url.searchParams.get("token"))
  if (!target || !token) return new Response("Invalid preview link.", { status: 400, headers: noStore })

  if (!(await fetchPreviewContent(target.locale, token))) {
    return new Response("This preview link is invalid or has expired. Open a new one from the editor.", {
      status: 404,
      headers: noStore,
    })
  }

  ;(await draftMode()).enable()
  ;(await cookies()).set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PREVIEW_MAX_AGE_SECONDS,
  })
  return new Response(null, { status: 307, headers: { ...noStore, location: target.path } })
}
