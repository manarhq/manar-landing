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
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || request.headers.get("x-real-ip") || "unknown"
}
