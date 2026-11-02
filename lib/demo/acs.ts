/**
 * Minimal Azure Communication Services Email transport over its REST API
 * (https://learn.microsoft.com/rest/api/communication/dataplane/email/send), signed with the
 * HMAC-SHA256 scheme from the resource's connection string. Uses fetch and node:crypto, so no SDK
 * dependency is needed and tests can inject a mock.
 */
import { createHash, createHmac } from "node:crypto"

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

export type AcsConfig = {
  /** "endpoint=https://<resource>.communication.azure.com/;accesskey=<base64>" */
  connectionString: string | undefined
  fetchImpl?: typeof fetch
  timeoutMs?: number
  now?: () => Date
}

const API_VERSION = "2023-03-31"

function parseConnectionString(value: string | undefined): { endpoint: URL; key: Buffer } | null {
  if (!value) return null
  const parts = new Map<string, string>()
  for (const part of value.split(";")) {
    const i = part.indexOf("=")
    if (i > 0) parts.set(part.slice(0, i).trim().toLowerCase(), part.slice(i + 1).trim())
  }
  const endpoint = parts.get("endpoint")
  const key = parts.get("accesskey")
  if (!endpoint || !key) return null
  try {
    const url = new URL(endpoint)
    return url.protocol === "https:" ? { endpoint: url, key: Buffer.from(key, "base64") } : null
  } catch {
    return null
  }
}

/** ACS takes a bare address; the display name is set on the sender in Azure. */
function bareAddress(from: string): string {
  return /<([^<>]+)>\s*$/.exec(from)?.[1] ?? from.trim()
}

export function createAcsTransport({
  connectionString,
  fetchImpl = fetch,
  timeoutMs = 10_000,
  now = () => new Date(),
}: AcsConfig): EmailTransport {
  const config = parseConnectionString(connectionString)
  return async (email) => {
    if (!config || !email.from) {
      return { ok: false, reason: "not_configured" }
    }

    const url = new URL(`/emails:send?api-version=${API_VERSION}`, config.endpoint)
    const body = JSON.stringify({
      senderAddress: bareAddress(email.from),
      recipients: { to: [{ address: email.to }] },
      replyTo: [{ address: email.replyTo }],
      content: { subject: email.subject, plainText: email.text, html: email.html },
    })
    const date = now().toUTCString()
    const contentHash = createHash("sha256").update(body).digest("base64")
    const stringToSign = `POST\n${url.pathname}${url.search}\n${date};${url.host};${contentHash}`
    const signature = createHmac("sha256", config.key).update(stringToSign).digest("base64")

    let response: Response
    try {
      response = await fetchImpl(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ms-date": date,
          "x-ms-content-sha256": contentHash,
          Authorization: `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}`,
        },
        body,
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch {
      return { ok: false, reason: "network" }
    }

    // 202 Accepted: queued for delivery.
    if (!response.ok) {
      return { ok: false, reason: "rejected" }
    }

    let id: string | null = null
    try {
      const parsed = (await response.json()) as { id?: unknown }
      id = typeof parsed.id === "string" ? parsed.id : null
    } catch {
      // Accepted without a parseable body; acceptance is still the provider's 2xx.
    }
    return { ok: true, id }
  }
}
