/** Request helpers shared by the route handlers. */

/** Read at most `limit` bytes; returns null when the body is larger. */
export async function readBoundedText(request: Request, limit: number): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"))
  if (Number.isFinite(declared) && declared > limit) return null
  if (!request.body) return ""

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
    if (received > limit) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}

export function clientKey(request: Request): string {
  // In the K3s deployment Traefik rewrites X-Forwarded-For, so the edge passes the
  // client IP in a dedicated header named by TRUSTED_CLIENT_IP_HEADER. Only set that
  // variable when every request reaches the pod through an edge that overwrites it.
  const trustedHeader = process.env.TRUSTED_CLIENT_IP_HEADER
  if (trustedHeader) {
    return request.headers.get(trustedHeader)?.trim() || "unknown"
  }
  // The last entry is the one the nearest proxy appended; earlier ones are whatever the client
  // sent, so keying on the first would let a visitor pick a fresh rate-limit bucket per request.
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim()
  return forwarded || request.headers.get("x-real-ip") || "unknown"
}

/**
 * The page's own origin when a browser POST comes from this site, else null. The browser sets Origin
 * and Sec-Fetch-Site itself (a page cannot), and a cross-site page cannot choose the Host it reaches.
 * Used where a POST is forwarded with JSON on our behalf, so a cross-site "simple" form post is refused.
 */
export function sameSiteOrigin(request: Request): string | null {
  const site = request.headers.get("sec-fetch-site")
  if (site && site !== "same-origin") return null
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")
  if (!origin || !host) return null
  try {
    const url = new URL(origin)
    return (url.protocol === "https:" || url.protocol === "http:") && url.host === host ? url.origin : null
  } catch {
    return null
  }
}
