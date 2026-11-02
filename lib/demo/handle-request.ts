import { pickUtm } from "../consent.ts"
import { buildDemoRequestEmail } from "./email-content.ts"
import type { RateLimiter } from "./rate-limit.ts"
import type { EmailTransport, SendResult } from "./acs.ts"
import { validateDemoRequest, type FieldErrors } from "./validation.ts"

/** Fixed destination. It is never read from the request. */
export const DEMO_REQUEST_RECIPIENT = "info@fixio.ae"

/** The structured log line for a failed send. Operational reason only: no names, emails or messages. */
export const demoFailureEvent = (reason: string) => JSON.stringify({ event: "demo_request_email_failed", reason })

export const MAX_BODY_BYTES = 16 * 1024

export type DemoApiBody =
  | { ok: true }
  | { ok: false; error: "validation"; fields: FieldErrors }
  | { ok: false; error: "rate_limited" }
  | { ok: false; error: "unavailable" }
  | { ok: false; error: "bad_request" }

export type DemoApiResponse = {
  status: number
  body: DemoApiBody
  headers?: Record<string, string>
}

export type DemoRequestDeps = {
  transport: EmailTransport
  fromAddress: string | undefined
  limiter: RateLimiter
  now?: () => Date
  /** Receives operational reasons only; never submission content. */
  logFailure?: (reason: Exclude<SendResult, { ok: true }>["reason"]) => void
}

export async function handleDemoRequest(
  request: { bodyText: string; contentType: string | null; clientKey: string },
  deps: DemoRequestDeps
): Promise<DemoApiResponse> {
  if (!request.contentType?.toLowerCase().startsWith("application/json")) {
    return { status: 415, body: { ok: false, error: "bad_request" } }
  }
  if (new TextEncoder().encode(request.bodyText).byteLength > MAX_BODY_BYTES) {
    return { status: 413, body: { ok: false, error: "bad_request" } }
  }

  let payload: unknown
  try {
    payload = JSON.parse(request.bodyText)
  } catch {
    return { status: 400, body: { ok: false, error: "bad_request" } }
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { status: 400, body: { ok: false, error: "bad_request" } }
  }
  const data = payload as Record<string, unknown>

  const rate = deps.limiter.check(request.clientKey)
  if (!rate.allowed) {
    return {
      status: 429,
      body: { ok: false, error: "rate_limited" },
      headers: { "Retry-After": String(rate.retryAfterSeconds) },
    }
  }

  // Honeypot: real visitors never see or fill this field. Respond as accepted, send nothing.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return { status: 200, body: { ok: true } }
  }

  const result = validateDemoRequest(data)
  if (!result.ok) {
    return { status: 422, body: { ok: false, error: "validation", fields: result.errors } }
  }

  const locale = data.locale === "ar" ? "ar" : "en"
  // Campaign fields (W14): only allowlisted keys with bounded, plain values survive.
  const utmSource = data.utm && typeof data.utm === "object" ? (data.utm as Record<string, unknown>) : {}
  const utm = pickUtm(
    new URLSearchParams(Object.entries(utmSource).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
  )
  const content = buildDemoRequestEmail(result.value, {
    locale,
    utm,
    submittedAt: (deps.now ?? (() => new Date()))(),
  })

  const sent = await deps.transport({
    from: deps.fromAddress ?? "",
    to: DEMO_REQUEST_RECIPIENT,
    replyTo: result.value.email,
    ...content,
  })

  if (!sent.ok) {
    deps.logFailure?.(sent.reason)
    return {
      status: sent.reason === "not_configured" ? 503 : 502,
      body: { ok: false, error: "unavailable" },
    }
  }

  return { status: 200, body: { ok: true } }
}
