/**
 * Cloudflare Turnstile, checked on the server (siteverify) for the forms this server handles itself
 * (the demo request). Booking tokens are checked by manar-site.
 *
 * It only refuses when Cloudflare says the visitor failed. Missing keys, a wrong secret or Cloudflare
 * being unreachable let the request through (the rate limits still apply): a configuration mistake or
 * an outage never locks people out.
 */

export const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export type TurnstileOutcome = "passed" | "failed" | "unavailable" | "off"

export type TurnstileConfig = {
  /** Built in (NEXT_PUBLIC_TURNSTILE_SITE_KEY): without it the page shows no widget and sends no token. */
  siteKey: string | undefined
  /** Runtime (TURNSTILE_SECRET_KEY, Key Vault turnstile-secret-key). */
  secret: string | undefined
  /** Hostnames the token may come from (the site's own); empty = not checked. */
  hostnames?: string[]
  fetchImpl?: typeof fetch
}

/** Errors that mean our configuration is wrong or Cloudflare had a problem, not that the visitor failed. */
const NOT_THE_VISITOR = new Set(["missing-input-secret", "invalid-input-secret", "internal-error"])

export function turnstileEnabled(config: Pick<TurnstileConfig, "siteKey" | "secret">): boolean {
  return Boolean(config.siteKey?.trim() && config.secret?.trim())
}

export async function verifyTurnstile(
  config: TurnstileConfig,
  token: unknown,
  remoteIp: string,
  action: string
): Promise<TurnstileOutcome> {
  if (!turnstileEnabled(config)) return "off"
  if (typeof token !== "string" || token === "" || token.length > 2048) return "failed"
  let answer: { success?: unknown; "error-codes"?: unknown; hostname?: unknown; action?: unknown }
  try {
    const response = await (config.fetchImpl ?? fetch)(SITEVERIFY, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: config.secret!.trim(),
        response: token,
        ...(remoteIp && remoteIp !== "unknown" ? { remoteip: remoteIp } : {}),
      }).toString(),
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return "unavailable"
    answer = await response.json()
  } catch {
    return "unavailable"
  }
  if (answer.success !== true) {
    const codes = Array.isArray(answer["error-codes"]) ? answer["error-codes"] : []
    return codes.some((c) => NOT_THE_VISITOR.has(String(c))) ? "unavailable" : "failed"
  }
  // A token solved for another form or another site is not valid here. Test keys answer
  // hostname "example.com" and no action, so both checks apply only to real answers.
  if (typeof answer.action === "string" && answer.action !== "" && answer.action !== action) return "failed"
  if (
    config.hostnames?.length &&
    typeof answer.hostname === "string" &&
    answer.hostname !== "example.com" &&
    !config.hostnames.includes(answer.hostname)
  ) {
    return "failed"
  }
  return "passed"
}
