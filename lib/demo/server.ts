import "server-only"

import { createRateLimiter } from "./rate-limit.ts"
import { createResendTransport } from "./resend.ts"

/**
 * Server-side wiring for demo requests. Swap the transport here to change
 * email providers; the handler and UI do not depend on Resend.
 */
export const sendDemoRequestEmail = createResendTransport({
  apiKey: process.env.RESEND_API_KEY,
})

export function demoFromAddress(): string | undefined {
  return process.env.DEMO_FROM_EMAIL || undefined
}

// Five attempts per client per ten minutes. Process-local; see rate-limit.ts.
export const demoRequestLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 })
