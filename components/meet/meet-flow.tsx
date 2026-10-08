"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { ANY_HOST, isUnavailable, meetApi, mergeDays, type MeetDays, type MeetHost } from "@/lib/meet/api"
import { cn } from "@/lib/utils"

import { DetailsForm, EMPTY_DETAILS, type Details, type SubmitOutcome } from "./details-form"
import { Notice } from "./notice"
import { Pending } from "./pending"
import { SlotPicker } from "./slot-picker"
import { Unavailable } from "./unavailable"

type Load<T> = { state: "loading" } | { state: "ok"; data: T } | { state: "error" } | { state: "off" }
type Held = { bookingRef: string; host: string; start: string; email: string }

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

/**
 * Pick a person (or "Any of us"), then a time, then details. For "Any of us" the calendar is
 * every host's free times merged here, and the booking goes to hostKey "any": manar-site picks
 * whoever is free and re-checks. When booking is off, the page says so and offers the form.
 */
export function MeetFlow({ t, locale, requestHref }: { t: Dictionary["meet"]; locale: "en" | "ar"; requestHref: string }) {
  const params = useSearchParams()
  const [hosts, setHosts] = useState<Load<MeetHost[]>>({ state: "loading" })
  const [hostKey, setHostKey] = useState<string>(ANY_HOST)
  const [days, setDays] = useState<Load<MeetDays>>({ state: "loading" })
  const [version, setVersion] = useState(0)
  const [slot, setSlot] = useState<string | null>(null)
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS)
  const [held, setHeld] = useState<Held | null>(null)
  const [notice, setNotice] = useState<string | null>(() => (params.get("retry") === "1" ? t.retryAfterConfirm : null))

  useEffect(() => {
    let live = true
    meetApi.hosts().then((r) => {
      if (!live) return
      if (r.ok && Array.isArray(r.data) && r.data.length) setHosts({ state: "ok", data: r.data })
      else setHosts({ state: r.ok || isUnavailable(r) ? "off" : "error" })
    })
    return () => {
      live = false
    }
  }, [])

  useEffect(() => {
    if (hosts.state !== "ok") return
    let live = true
    const keys = hostKey === ANY_HOST ? hosts.data.map((h) => h.key) : [hostKey]
    Promise.all(keys.map((key) => meetApi.slots(key))).then((results) => {
      if (!live) return
      if (results.every((r) => !r.ok)) return setDays({ state: results.every(isUnavailable) ? "off" : "error" })
      setDays({ state: "ok", data: mergeDays(results.map((r) => (r.ok ? r.data : null))) })
    })
    return () => {
      live = false
    }
  }, [hosts, hostKey, version])

  if (hosts.state === "off" || days.state === "off") return <Unavailable t={t.unavailable} href={requestHref} />
  if (hosts.state === "error") {
    return (
      <div className="grid max-w-[60ch] gap-4">
        <Notice tone="wait">{t.slotsFailed}</Notice>
        <Unavailable t={t.unavailable} href={requestHref} />
      </div>
    )
  }

  const hostName = (key: string) =>
    key === ANY_HOST ? t.anyone : hosts.state === "ok" ? (hosts.data.find((h) => h.key === key)?.name ?? t.anyone) : t.anyone

  if (held) {
    return (
      <Pending
        t={t}
        locale={locale}
        {...held}
        onHoldExpired={() => {
          setHeld(null)
          setSlot(null)
          setNotice(t.holdExpired)
          setVersion((v) => v + 1)
        }}
      />
    )
  }

  async function book(input: { website: string; turnstileToken: string }): Promise<SubmitOutcome> {
    if (!slot) return { type: "notice", tone: "wait", body: t.pickTimeFirst }
    const clean = Object.fromEntries(Object.entries(details).map(([k, v]) => [k, v.trim()])) as Details
    const r = await meetApi.book({
      hostKey,
      slotStart: slot,
      name: clean.name,
      email: clean.email,
      company: clean.company,
      role: clean.role,
      message: clean.message || undefined,
      locale,
      ...input,
    })
    if (r.ok) {
      setHeld({ bookingRef: r.data.bookingRef, host: r.data.host?.name ?? hostName(hostKey), start: slot, email: clean.email })
      window.scrollTo({ top: 0 })
      return { type: "done" }
    }
    if (r.status === 409 && r.error.error === "slot_taken") {
      setSlot(null)
      setNotice(t.slotTaken)
      setVersion((v) => v + 1)
      document.getElementById("meet-when")?.scrollIntoView({ block: "start" })
      return { type: "handled" }
    }
    if (r.status === 409 && r.error.error === "active_booking_exists") return { type: "notice", tone: "neutral", body: t.activeBooking }
    if (r.status === 429) return { type: "notice", tone: "wait", title: t.rateTitle, body: t.rateBody }
    if (r.status === 400 && (r.error.error === "turnstile_failed" || r.error.fields?.turnstileToken))
      return { type: "notice", tone: "wait", body: t.turnstileFailed }
    if (r.status === 400 && r.error.fields && !r.error.fields.slotStart) return { type: "fields", fields: r.error.fields }
    return { type: "notice", tone: "deny", title: t.failTitle, body: t.failBody }
  }

  const people = hosts.state === "ok" ? [{ key: ANY_HOST, name: t.anyone, title: t.anyoneHint }, ...hosts.data] : []

  return (
    <div className="grid gap-12">
      <fieldset>
        <legend className="mb-4 text-xl font-semibold text-foreground">{t.hostHeading}</legend>
        {hosts.state === "loading" ? (
          <HostsSkeleton label={t.loading} />
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {people.map((person) => {
              const active = person.key === hostKey
              return (
                <label
                  key={person.key}
                  className={cn(
                    "flex min-h-16 cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors duration-[120ms] has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                    active ? "border-ink bg-elevated" : "border-line bg-surface hover:bg-subtle"
                  )}
                >
                  <input
                    type="radio"
                    name="meet-host"
                    value={person.key}
                    checked={active}
                    onChange={() => {
                      setHostKey(person.key)
                      setSlot(null)
                      setDays({ state: "loading" })
                    }}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                      active ? "bg-ink text-ink-text" : "bg-subtle text-foreground"
                    )}
                  >
                    {person.key === ANY_HOST ? "+" : initials(person.name)}
                  </span>
                  <span>
                    <span className="block text-base font-medium text-foreground">
                      <bdi>{person.name}</bdi>
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      <bdi>{person.title}</bdi>
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </fieldset>

      <section id="meet-when" aria-labelledby="meet-when-heading" className="grid scroll-mt-24 gap-4">
        <h2 id="meet-when-heading" className="text-xl font-semibold text-foreground">
          {t.whenHeading}
        </h2>
        {notice ? <Notice tone="wait">{notice}</Notice> : null}
        {hosts.state === "loading" || days.state === "loading" ? (
          <TimesSkeleton label={t.loading} timezone={t.timezone} />
        ) : days.state === "error" ? (
          <Notice tone="wait">
            <p>{t.slotsFailed}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => setVersion((v) => v + 1)}>
              {t.retry}
            </Button>
          </Notice>
        ) : days.state === "ok" ? (
          <SlotPicker
            days={days.data}
            selected={slot}
            locale={locale}
            labels={t}
            onSelect={(value) => {
              setNotice(null)
              setSlot(value)
            }}
          />
        ) : null}
      </section>

      {slot ? (
        <section aria-labelledby="meet-details-heading" className="grid gap-4">
          <h2 id="meet-details-heading" className="text-xl font-semibold text-foreground">
            {t.detailsHeading}
          </h2>
          <DetailsForm t={t} locale={locale} details={details} onChange={(patch) => setDetails((d) => ({ ...d, ...patch }))} onSubmit={book} />
        </section>
      ) : null}
    </div>
  )
}

function HostsSkeleton({ label }: { label: string }) {
  return (
    <div role="status" className="grid gap-2 sm:grid-cols-2">
      <span className="sr-only">{label}</span>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} aria-hidden className="h-16 rounded-md bg-subtle" />
      ))}
    </div>
  )
}

function TimesSkeleton({ label, timezone }: { label: string; timezone: string }) {
  return (
    <div role="status" className="grid gap-6">
      <span className="sr-only">{label}</span>
      <p aria-hidden className="text-sm text-muted-foreground">{timezone}</p>
      {[5, 3].map((n, row) => (
        <div key={row} aria-hidden className="flex flex-wrap gap-2">
          {Array.from({ length: n }, (_, i) => (
            <span key={i} className="h-11 w-24 rounded-md bg-subtle" />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Same shape as the loading flow, for the server render before the browser takes over. */
export function MeetSkeleton({ t }: { t: Dictionary["meet"] }) {
  return (
    <div className="grid gap-12">
      <div>
        <p className="mb-4 text-xl font-semibold text-foreground">{t.hostHeading}</p>
        <HostsSkeleton label={t.loading} />
      </div>
      <div className="grid gap-4">
        <p className="text-xl font-semibold text-foreground">{t.whenHeading}</p>
        <TimesSkeleton label={t.loading} timezone={t.timezone} />
      </div>
    </div>
  )
}
