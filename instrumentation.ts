import { turnstileEnabled } from "./lib/turnstile"

/** Runs once when the server starts. */
export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  if (turnstileEnabled({ siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, secret: process.env.TURNSTILE_SECRET_KEY })) {
    console.info(JSON.stringify({ event: "turnstile_on", detail: "turnstile: enabled" }))
  } else {
    console.warn(
      JSON.stringify({
        event: "turnstile_off",
        detail:
          "turnstile: disabled. NEXT_PUBLIC_TURNSTILE_SITE_KEY (build) and TURNSTILE_SECRET_KEY (runtime) are not both set: the demo form is not checked by Turnstile; rate limits still apply",
      })
    )
  }
}
