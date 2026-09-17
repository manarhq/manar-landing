import { handleDemoRequest, MAX_BODY_BYTES } from "@/lib/demo/handle-request"
import { demoFromAddress, demoRequestLimiter, sendDemoRequestEmail } from "@/lib/demo/server"

export const runtime = "nodejs"

/** Read at most `limit` bytes; returns null when the body is larger. */
async function readBoundedText(request: Request, limit: number): Promise<string | null> {
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

function clientKey(request: Request): string {
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

export async function POST(request: Request) {
  const bodyText = await readBoundedText(request, MAX_BODY_BYTES)
  if (bodyText === null) {
    return Response.json({ ok: false, error: "bad_request" }, { status: 413 })
  }

  const result = await handleDemoRequest(
    { bodyText, contentType: request.headers.get("content-type"), clientKey: clientKey(request) },
    {
      transport: sendDemoRequestEmail,
      fromAddress: demoFromAddress(),
      limiter: demoRequestLimiter,
      logFailure: (reason) => console.error(JSON.stringify({ event: "demo_request_email_failed", reason })),
    }
  )

  return Response.json(result.body, {
    status: result.status,
    headers: { "Cache-Control": "no-store", ...result.headers },
  })
}
