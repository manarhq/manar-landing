/**
 * Browser client for booking, through the same-origin proxy at /api/meet (which forwards to
 * manar-site's /public/meet). Shapes follow the public contract agreed with manar-site.
 */
export type MeetHost = { key: string; name: string; title: string }
/** Free times grouped by UAE date: [{ date: "2026-10-14", slots: [ISO, ...] }]. */
export type MeetDays = { date: string; slots: string[] }[]
export type BookingStatus = "pending_verification" | "confirmed" | "cancelled" | "expired" | "completed" | "no_show"
export type BookingSummary = {
  status: BookingStatus
  host: MeetHost
  start: string
  end: string
  locale: "en" | "ar"
  teamsJoinUrl?: string
  company?: string
}
export type BookingCreated = { status: "pending"; holdExpiresAt: string; bookingRef: string; host?: MeetHost }
export type ApiError = { error: string; fields?: Record<string, string>; slots?: MeetDays }

/** "any" asks manar-site to assign whoever is free (it re-checks free/busy). */
export const ANY_HOST = "any"

export type BookingRequest = {
  hostKey: string
  slotStart: string
  name: string
  email: string
  company: string
  role: string
  message?: string
  locale: "en" | "ar"
  website: string
  turnstileToken: string
}

/** status 0: no answer at all (network, offline). 503 with booking_unavailable: booking is off. */
export type ApiResult<T> = { ok: true; status: number; data: T } | { ok: false; status: number; error: ApiError }

async function call<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  let response: Response
  try {
    response = await fetch(`/api/meet/${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    })
  } catch {
    return { ok: false, status: 0, error: { error: "network" } }
  }
  const json: unknown = await response.json().catch(() => null)
  if (response.ok) return { ok: true, status: response.status, data: json as T }
  const error =
    json && typeof json === "object" && typeof (json as ApiError).error === "string" ? (json as ApiError) : { error: "unknown" }
  return { ok: false, status: response.status, error }
}

export const meetApi = {
  hosts: () => call<MeetHost[]>("hosts"),
  slots: (hostKey: string) => call<MeetDays>(`hosts/${encodeURIComponent(hostKey)}/slots`),
  book: (body: BookingRequest) => call<BookingCreated>("bookings", body),
  resend: (bookingRef: string, turnstileToken: string) => call<{ status: "ok" }>("bookings/resend", { bookingRef, turnstileToken }),
  verify: (token: string) => call<BookingSummary>("bookings/verify", { token }),
  manage: (token: string) => call<BookingSummary>(`manage?token=${encodeURIComponent(token)}`),
  reschedule: (token: string, slotStart: string) => call<BookingSummary>("manage/reschedule", { token, slotStart }),
  cancel: (token: string, reason?: string) => call<BookingSummary>("manage/cancel", { token, reason }),
}

/** Booking is switched off or unreachable: show the calm fallback, never invented times. */
export const isUnavailable = (r: { ok: boolean; status: number }) => !r.ok && (r.status === 0 || r.status === 503 || r.status === 404)

/** One calendar for "Any of us": the union of every host's free times. */
export function mergeDays(perHost: (MeetDays | null)[]): MeetDays {
  const byDate = new Map<string, Set<string>>()
  for (const days of perHost) {
    for (const day of days ?? []) {
      const set = byDate.get(day.date) ?? new Set<string>()
      day.slots.forEach((slot) => set.add(slot))
      byDate.set(day.date, set)
    }
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, set]) => ({ date, slots: [...set].sort() }))
}

export const UAE_TIME_ZONE = "Asia/Dubai"
const tag = (locale: "en" | "ar") => (locale === "ar" ? "ar-AE-u-nu-latn" : "en-GB")

export function formatTime(iso: string, locale: "en" | "ar", timeZone = UAE_TIME_ZONE): string {
  return new Intl.DateTimeFormat(tag(locale), { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone }).format(new Date(iso))
}

/** A UAE calendar date ("2026-10-14") as "Wed 14 Oct". */
export function formatDay(date: string, locale: "en" | "ar"): string {
  return new Intl.DateTimeFormat(tag(locale), { weekday: "short", day: "numeric", month: "short", timeZone: UAE_TIME_ZONE }).format(
    new Date(`${date}T12:00:00+04:00`)
  )
}

export function formatWhen(iso: string, locale: "en" | "ar", timeZone = UAE_TIME_ZONE): string {
  return new Intl.DateTimeFormat(tag(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(new Date(iso))
}

/** The visitor's own time zone, or null when it is UAE time already (nothing extra to show). */
export function visitorTimeZone(): string | null {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return zone && zone !== UAE_TIME_ZONE && zone !== "Asia/Muscat" ? zone : null
  } catch {
    return null
  }
}
