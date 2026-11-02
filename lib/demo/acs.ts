/**
 * Minimal Azure Communication Services Email transport over its REST API
 * (https://learn.microsoft.com/rest/api/communication/dataplane/email/send). It signs in as the
 * email-only Entra app (client credentials, never the resource's access key) and uses fetch only,
 * so no SDK dependency is needed and tests can inject a mock.
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

export type AcsConfig = {
  /** ACS SMTP username form: "<acs resource name>.<entra app id>.<tenant id>". */
  username: string | undefined
  /** That Entra app's client secret. */
  password: string | undefined
  fetchImpl?: typeof fetch
  timeoutMs?: number
  now?: () => number
}

const API_VERSION = "2023-03-31"
const NAME = /^[A-Za-z0-9-]{1,128}$/

function parseUsername(username: string | undefined) {
  const [resource, clientId, tenantId, ...rest] = (username ?? "").trim().split(".")
  if (rest.length || ![resource, clientId, tenantId].every((p) => p && NAME.test(p))) return null
  return {
    // The resource's global endpoint name serves the data-location one too.
    endpoint: `https://${resource}.communication.azure.com`,
    tokenUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    clientId: clientId!,
  }
}

/** ACS takes a bare address; the display name is set on the sender in Azure. */
function bareAddress(from: string): string {
  return /<([^<>]+)>\s*$/.exec(from)?.[1] ?? from.trim()
}

export function createAcsTransport({
  username,
  password,
  fetchImpl = fetch,
  timeoutMs = 10_000,
  now = Date.now,
}: AcsConfig): EmailTransport {
  const config = parseUsername(username)
  let token: { value: string; expiresAt: number } | null = null

  async function accessToken(): Promise<string | null> {
    if (token && now() < token.expiresAt) return token.value
    const response = await fetchImpl(config!.tokenUrl, {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: config!.clientId,
        client_secret: password!,
        scope: "https://communication.azure.com/.default",
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!response.ok) return null
    const body = (await response.json().catch(() => ({}))) as { access_token?: unknown; expires_in?: unknown }
    if (typeof body.access_token !== "string") return null
    // Renew a minute early so a token never expires in flight.
    const lifetime = typeof body.expires_in === "number" ? body.expires_in : 300
    token = { value: body.access_token, expiresAt: now() + Math.max(lifetime - 60, 0) * 1000 }
    return token.value
  }

  return async (email) => {
    if (!config || !password || !email.from) {
      return { ok: false, reason: "not_configured" }
    }

    let response: Response
    try {
      const bearer = await accessToken()
      if (!bearer) return { ok: false, reason: "rejected" }
      response = await fetchImpl(`${config.endpoint}/emails:send?api-version=${API_VERSION}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${bearer}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          senderAddress: bareAddress(email.from),
          recipients: { to: [{ address: email.to }] },
          replyTo: [{ address: email.replyTo }],
          content: { subject: email.subject, plainText: email.text, html: email.html },
        }),
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch {
      return { ok: false, reason: "network" }
    }

    // 202 Accepted: queued for delivery. A refused token is dropped so the next send signs in again.
    if (!response.ok) {
      if (response.status === 401) token = null
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
