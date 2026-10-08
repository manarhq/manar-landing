import { handleDemoRequest, MAX_BODY_BYTES } from "@/lib/demo/handle-request"
import { clientKey, readBoundedText } from "@/lib/http"
import { demoFromAddress, demoRequestLimiter, sendDemoRequestEmail } from "@/lib/demo/server"

export const runtime = "nodejs"

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
