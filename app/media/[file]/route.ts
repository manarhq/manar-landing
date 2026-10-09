import { siteApiOrigin } from "@/lib/content/load"

export const runtime = "nodejs"

/** Same pattern manar-site hands out for uploads: `<uuid>.<ext>`, raster images only. */
const FILE = /^[0-9a-f-]{36}\.(png|jpg|webp|avif)$/
const TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"])
const TIMEOUT_MS = 8000

/**
 * Images uploaded in the admin (content paths `/media/<uuid>.<ext>`), served from manar-site's
 * GET /public/media/:file through this origin, so CSP img-src stays 'self' and next/image can
 * optimise them. Only image types pass; anything else is a 404.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const origin = siteApiOrigin()
  if (!origin || !FILE.test(file)) return new Response("Not found", { status: 404 })

  try {
    const upstream = await fetch(`${origin}/public/media/${file}`, { redirect: "manual", signal: AbortSignal.timeout(TIMEOUT_MS) })
    const type = upstream.headers.get("content-type")?.split(";")[0].trim() ?? ""
    if (!upstream.ok || !upstream.body || !TYPES.has(type)) return new Response("Not found", { status: 404 })
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "content-type": type,
        // A new upload always gets a new name, so a file at a given name never changes.
        "cache-control": "public, max-age=31536000, immutable",
        "content-disposition": "inline",
        "x-content-type-options": "nosniff",
      },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}
