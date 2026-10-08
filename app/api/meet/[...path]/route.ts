import { siteApiOrigin } from "@/lib/content/load"
import { clientKey, readBoundedText } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_BODY_BYTES = 16 * 1024
const TIMEOUT_MS = 8000

/**
 * Same-origin proxy to manar-site's public booking endpoints, so the browser never needs the
 * API origin (CSP connect-src stays 'self') and SITE_API_URL stays server-side. Only these
 * routes pass; everything else is a 404.
 */
const ROUTES: { method: "GET" | "POST"; pattern: RegExp }[] = [
  { method: "GET", pattern: /^hosts$/ },
  { method: "GET", pattern: /^hosts\/[A-Za-z0-9_-]{1,64}\/slots$/ },
  { method: "POST", pattern: /^bookings$/ },
  { method: "POST", pattern: /^bookings\/(resend|verify)$/ },
  { method: "GET", pattern: /^manage$/ },
  { method: "POST", pattern: /^manage\/(reschedule|cancel)$/ },
]

async function forward(request: Request, path: string[], method: "GET" | "POST") {
  const joined = path.join("/")
  if (!ROUTES.some((r) => r.method === method && r.pattern.test(joined))) {
    return Response.json({ error: "not_found" }, { status: 404 })
  }
  const origin = siteApiOrigin()
  if (!origin) return Response.json({ error: "booking_unavailable" }, { status: 503 })

  let body: string | undefined
  if (method === "POST") {
    const text = await readBoundedText(request, MAX_BODY_BYTES)
    if (text === null) return Response.json({ error: "too_large" }, { status: 413 })
    body = text
  }

  const search = new URL(request.url).search
  try {
    const upstream = await fetch(`${origin}/public/meet/${joined}${search}`, {
      method,
      headers: {
        accept: "application/json",
        ...(body !== undefined ? { "content-type": "application/json" } : {}),
        // manar-site rate limits per visitor, so it needs the visitor's address, not ours.
        "x-forwarded-for": clientKey(request),
      },
      body,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    const json: unknown = await upstream.json().catch(() => ({ error: "unknown" }))
    return Response.json(json, { status: upstream.status, headers: { "cache-control": "no-store" } })
  } catch {
    return Response.json({ error: "booking_unavailable" }, { status: 503 })
  }
}

type Context = { params: Promise<{ path: string[] }> }

export async function GET(request: Request, { params }: Context) {
  return forward(request, (await params).path, "GET")
}

export async function POST(request: Request, { params }: Context) {
  return forward(request, (await params).path, "POST")
}
