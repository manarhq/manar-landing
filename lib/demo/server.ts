import "server-only"

import { createRateLimiter } from "./rate-limit.ts"
import { createAcsTransport } from "./acs.ts"

/**
 * Server-side wiring for demo requests: Azure Communication Services Email (UAE), signed in as the
 * landing's own Entra app. Swap the transport here to change email providers; the handler and UI
 * do not depend on it.
 */
export const sendDemoRequestEmail = createAcsTransport({
  endpoint: process.env.ACS_EMAIL_ENDPOINT,
  tenantId: process.env.ACS_EMAIL_TENANT_ID,
  clientId: process.env.ACS_EMAIL_CLIENT_ID,
  clientSecret: process.env.ACS_EMAIL_CLIENT_SECRET,
})

export function demoFromAddress(): string | undefined {
  return process.env.DEMO_FROM_EMAIL || undefined
}

// Five attempts per client per ten minutes. Process-local; see rate-limit.ts.
export const demoRequestLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 })
