export const CONSENT_STORAGE_KEY = "manar-consent"
export const UTM_STORAGE_KEY = "manar-utm"

/** Stored privacy choice (W02). A choice older than a year is treated as never made. */
export type Consent = { v: 1; analytics: boolean; ts: number }

const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000
const EVENT = "manar:consent"

export function parseConsent(raw: string | null, now = Date.now()): Consent | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Partial<Consent>
    if (value.v !== 1 || typeof value.analytics !== "boolean" || typeof value.ts !== "number") return null
    if (now - value.ts > MAX_AGE_MS || value.ts > now) return null
    return { v: 1, analytics: value.analytics, ts: value.ts }
  } catch {
    return null
  }
}

/** The privacy signals a browser can send. Both are read from `navigator`. */
export type PrivacySignals = { globalPrivacyControl?: boolean; doNotTrack?: string | null }

/**
 * Global Privacy Control, or Do Not Track set to "1", counts as a rejection of analytics.
 * With either signal the banner is not shown and the beacon never loads.
 */
export function hasPrivacySignal(signals: PrivacySignals | undefined): boolean {
  return signals?.globalPrivacyControl === true || signals?.doNotTrack === "1"
}

export function readPrivacySignal(): boolean {
  try {
    return hasPrivacySignal(navigator as PrivacySignals)
  } catch {
    return false
  }
}

/**
 * Whether the analytics beacon may load: only with a configured token, no browser privacy
 * signal, and a stored, unexpired acceptance. Anything else, including no choice yet, is off.
 */
export function analyticsAllowed(consent: Consent | null, signal: boolean, tokenConfigured: boolean): boolean {
  return tokenConfigured && !signal && consent?.analytics === true
}

/** The first-visit banner shows only when there is something to ask and nothing has answered it. */
export function shouldAskForConsent(consent: Consent | null, signal: boolean, tokenConfigured: boolean): boolean {
  return tokenConfigured && !signal && consent === null
}

let cachedRaw: string | null | undefined
let cached: Consent | null = null

/** Snapshot for useSyncExternalStore; stable identity until storage changes. */
export function readConsent(): Consent | null {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(CONSENT_STORAGE_KEY)
  } catch {
    // Storage blocked: behave as undecided and keep asking without breaking the page.
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cached = parseConsent(raw)
  }
  return cached
}

export function writeConsent(analytics: boolean) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics, ts: Date.now() } satisfies Consent))
    if (!analytics) sessionStorage.removeItem(UTM_STORAGE_KEY)
  } catch {
    // The choice still applies to this page view through the event below.
  }
  window.dispatchEvent(new Event(EVENT))
}

export function subscribeConsent(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>

const UTM_VALUE = /^[\p{L}\p{N} ._\-+:/]{1,100}$/u

/** W14: allowlisted, length-bounded campaign fields only. Anything else in the query is ignored. */
export function pickUtm(search: string | URLSearchParams): Utm {
  const params = typeof search === "string" ? new URLSearchParams(search) : search
  const utm: Utm = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim()
    if (value && UTM_VALUE.test(value)) utm[key] = value
  }
  return utm
}

export function readStoredUtm(): Utm {
  try {
    return pickUtm(new URLSearchParams(JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) ?? "{}")))
  } catch {
    return {}
  }
}
