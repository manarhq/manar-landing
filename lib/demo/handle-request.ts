import { pickUtm } from "../consent.ts"
import { buildDemoRequestEmail } from "./email-content.ts"
import type { TurnstileOutcome } from "../turnstile.ts"
import type { RateLimiter } from "./rate-limit.ts"
import type { EmailTransport, SendResult } from "./acs.ts"
import { validateDemoRequest, type FieldErrors } from "./validation.ts"

/** Fixed destination. It is never read from the request. */
export const DEMO_REQUEST_RECIPIENT = "info@fixio.ae"

/** The structured log line for a failed send. Operational reason only: no names, emails or messages. */
export const demoFailureEvent = (reason: string) =>
  reason === "suspected_abuse"
    ? JSON.stringify({ event: "demo_request_suspected_abuse" })
    : JSON.stringify({ event: "demo_request_email_failed", reason })

/**
 * The address as a mailbox, for limits only (the email itself keeps what was typed): lower-cased,
 * "+tag" dropped, and for Gmail the dots too, so one inbox cannot get many buckets.
 */
export function mailboxKey(email: string): string {
  const lower = email.trim().toLowerCase()
  const at = lower.lastIndexOf("@")
  if (at < 1) return lower
  const domain = lower.slice(at + 1) === "googlemail.com" ? "gmail.com" : lower.slice(at + 1)
  let local = lower.slice(0, at).split("+")[0]
  if (domain === "gmail.com") local = local.replaceAll(".", "")
  return `${local}@${domain}`
}

export const MAX_BODY_BYTES = 16 * 1024

export type DemoApiBody =
  | { ok: true }
  | { ok: false; error: "validation"; fields: FieldErrors }
  | { ok: false; error: "rate_limited"; retryAfterSeconds: number }
  | { ok: false; error: "turnstile" }
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
  /** Per mailbox and client: over it, that requester gets a 429 with the wait. */
  emailLimiter: RateLimiter
  /**
   * Per mailbox from any client: over it the request is answered as accepted but not sent (logged as
   * suspected abuse), so requests from elsewhere can never get a 429 in the owner's name.
   */
  emailCap: RateLimiter
  /** Turnstile check of `turnstileToken`; "off" when a key is missing. */
  turnstile: (token: unknown, remoteIp: string) => Promise<TurnstileOutcome>
  now?: () => Date
  /** Receives operational reasons only; never submission content. */
  logFailure?: (reason: Exclude<SendResult, { ok: true }>["reason"] | "turnstile_unavailable" | "suspected_abuse") => void
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
  if (!rate.allowed) return rateLimited(rate.retryAfterSeconds)

  // Honeypot: real visitors never see or fill this field. Respond as accepted, send nothing.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return { status: 200, body: { ok: true } }
  }

  const result = validateDemoRequest(data)
  if (!result.ok) {
    return { status: 422, body: { ok: false, error: "validation", fields: result.errors } }
  }

  // After validation, so a field error does not spend the single-use token on the server's side.
  const check = await deps.turnstile(data.turnstileToken, request.clientKey)
  if (check === "failed") return { status: 403, body: { ok: false, error: "turnstile" } }
  if (check === "unavailable") deps.logFailure?.("turnstile_unavailable")

  const mailbox = mailboxKey(result.value.email)
  const byEmail = deps.emailLimiter.check(`${mailbox}|${request.clientKey}`)
  if (!byEmail.allowed) return rateLimited(byEmail.retryAfterSeconds)
  if (!deps.emailCap.check(mailbox).allowed) {
    deps.logFailure?.("suspected_abuse")
    return { status: 200, body: { ok: true } }
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

function rateLimited(retryAfterSeconds: number): DemoApiResponse {
  return {
    status: 429,
    body: { ok: false, error: "rate_limited", retryAfterSeconds },
    headers: { "Retry-After": String(retryAfterSeconds) },
  }
}
