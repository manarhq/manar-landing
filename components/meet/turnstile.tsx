"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || ""
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

/**
 * Sent when no site key is configured (local development). manar-site's development adapter
 * accepts it; the production verifier rejects it, so a build without a key fails closed.
 */
const UNCONFIGURED_TOKEN = "turnstile-not-configured"

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}

let loader: Promise<TurnstileApi> | null = null

/** Loaded on demand, only on the pages that submit a booking. */
function loadTurnstile(): Promise<TurnstileApi> {
  loader ??= new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = SCRIPT
    script.async = true
    script.onload = () => {
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile
      if (api) resolve(api)
      else reject(new Error("turnstile missing"))
    }
    script.onerror = () => {
      loader = null
      reject(new Error("turnstile failed to load"))
    }
    document.head.appendChild(script)
  })
  return loader
}

/** Explicitly rendered widget. `token` is null until the check passes; each token is single use. */
export function useTurnstile(locale: "en" | "ar") {
  const container = useRef<HTMLDivElement>(null)
  const widget = useRef<string | null>(null)
  const api = useRef<TurnstileApi | null>(null)
  const [token, setToken] = useState<string | null>(SITE_KEY ? null : UNCONFIGURED_TOKEN)

  useEffect(() => {
    if (!SITE_KEY) return
    let cancelled = false
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !container.current) return
        api.current = turnstile
        widget.current = turnstile.render(container.current, {
          sitekey: SITE_KEY,
          language: locale,
          theme: "auto",
          callback: (value: string) => setToken(value),
          "expired-callback": () => setToken(null),
          "error-callback": () => setToken(null),
        })
      })
      .catch(() => {
        // The submit reports a failed check; nothing else to do here.
      })
    return () => {
      cancelled = true
      if (widget.current) api.current?.remove(widget.current)
      widget.current = null
    }
  }, [locale])

  const reset = useCallback(() => {
    if (!SITE_KEY) return
    setToken(null)
    if (widget.current) api.current?.reset(widget.current)
  }, [])

  const element = SITE_KEY ? <div ref={container} className="min-h-[65px]" /> : null
  return { token, reset, element }
}
