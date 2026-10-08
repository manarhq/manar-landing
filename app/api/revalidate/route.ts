import { createHash, timingSafeEqual } from "node:crypto"

import { revalidateTag } from "next/cache"

import { CONTENT_TAG } from "@/lib/content/load"

export const runtime = "nodejs"

const digest = (value: string) => createHash("sha256").update(value).digest()

/**
 * manar-site calls this after publishing: POST with "Authorization: Bearer <REVALIDATE_SECRET>".
 * Every page reads content through the "site-content" tag, so one call refreshes the whole site.
 * Without a configured secret the route does not exist (404), so it can never be called open.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET?.trim()
  if (!secret || secret.length < 32) return Response.json({ ok: false }, { status: 404 })

  const given = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1] ?? ""
  if (!timingSafeEqual(digest(given), digest(secret))) return Response.json({ ok: false }, { status: 401 })

  // expire 0: the next visit fetches the new document instead of serving the old one once more.
  revalidateTag(CONTENT_TAG, { expire: 0 })
  return Response.json({ ok: true, revalidated: CONTENT_TAG })
}
