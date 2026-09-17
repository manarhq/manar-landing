/**
 * Minimal Resend transport over its REST API (https://resend.com/docs/api-reference/emails/send-email).
 * Uses fetch directly, so no SDK dependency is needed and tests can inject a mock.
 */

export type OutboundEmail = {
  from: string
  to: string
  replyTo: string
  subject: string
  text: string
  html: string
}

export type SendResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: "not_configured" | "rejected" | "network" }

export type EmailTransport = (email: OutboundEmail) => Promise<SendResult>

export type ResendConfig = {
  apiKey: string | undefined
  fetchImpl?: typeof fetch
  timeoutMs?: number
}

const RESEND_ENDPOINT = "https://api.resend.com/emails"

export function createResendTransport({ apiKey, fetchImpl = fetch, timeoutMs = 10_000 }: ResendConfig): EmailTransport {
  return async (email) => {
    if (!apiKey || !email.from) {
      return { ok: false, reason: "not_configured" }
    }

    let response: Response
    try {
      response = await fetchImpl(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: email.from,
          to: [email.to],
          reply_to: email.replyTo,
          subject: email.subject,
          text: email.text,
          html: email.html,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch {
      return { ok: false, reason: "network" }
    }

    if (!response.ok) {
      return { ok: false, reason: "rejected" }
    }

    let id: string | null = null
    try {
      const body = (await response.json()) as { id?: unknown }
      id = typeof body.id === "string" ? body.id : null
    } catch {
      // Accepted without a parseable body; acceptance is still the provider's 2xx.
    }
    return { ok: true, id }
  }
}
