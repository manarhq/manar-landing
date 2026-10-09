import { cookies, draftMode } from "next/headers"

import { PREVIEW_COOKIE, safePreviewPath } from "@/lib/preview/paths"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Leaves preview: draft mode off, token cookie gone, back to the published page. */
export async function GET(request: Request) {
  ;(await draftMode()).disable()
  ;(await cookies()).delete(PREVIEW_COOKIE)
  const target = safePreviewPath(new URL(request.url).searchParams.get("path"))
  return new Response(null, { status: 307, headers: { "cache-control": "no-store", location: target?.path ?? "/en" } })
}
