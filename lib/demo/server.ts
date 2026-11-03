import "server-only"

import { SITE_HOST } from "../hosts.ts"
import { verifyTurnstile } from "../turnstile.ts"
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

// Five attempts per client per ten minutes, and three requests per email address per hour.
// ponytail: process-local, so with N replicas the caps are N times higher (Traefik caps form posts per
// address in front, apps/landing.yaml); a shared store when one exists for the landing.
export const demoRequestLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 })
export const demoEmailLimiter = createRateLimiter({ limit: 3, windowMs: 60 * 60 * 1000 })

export function checkDemoTurnstile(token: unknown, remoteIp: string) {
  return verifyTurnstile(
    {
      siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      secret: process.env.TURNSTILE_SECRET_KEY,
      hostnames: [SITE_HOST],
    },
    token,
    remoteIp,
    "demo"
  )
}
