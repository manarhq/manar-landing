"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { format, type Dictionary } from "@/lib/i18n/dictionaries"
import { meetApi } from "@/lib/meet/api"

import { CallSummary } from "./call-summary"
import { Notice, type Tone } from "./notice"
import { useTurnstile } from "./turnstile"

const RESEND_COOLDOWN = 60

/** After booking: the time is held until the emailed link is clicked. Resend is locked for a minute. */
export function Pending({
  t,
  locale,
  bookingRef,
  email,
  host,
  start,
  onHoldExpired,
}: {
  t: Dictionary["meet"]
  locale: "en" | "ar"
  bookingRef: string
  email: string
  host: string
  start: string
  onHoldExpired: () => void
}) {
  const [remaining, setRemaining] = useState(RESEND_COOLDOWN)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ tone: Tone; title?: string; body: string } | null>(null)
  const turnstile = useTurnstile(locale)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => heading.current?.focus(), [])
  useEffect(() => {
    if (remaining <= 0) return
    const timer = setTimeout(() => setRemaining((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining])

  async function resend() {
    if (!turnstile.token) return setResult({ tone: "wait", body: t.turnstileFailed })
    setSending(true)
    setResult(null)
    const r = await meetApi.resend(bookingRef, turnstile.token)
    setSending(false)
    turnstile.reset()
    if (r.ok) {
      setRemaining(RESEND_COOLDOWN)
      setResult({ tone: "allow", body: t.resent })
    } else if (r.status === 410) onHoldExpired()
    else if (r.status === 429) {
      setRemaining(RESEND_COOLDOWN)
      setResult({ tone: "wait", title: t.rateTitle, body: t.rateBody })
    } else setResult({ tone: "deny", title: t.failTitle, body: t.failBody })
  }

  const [before, after] = t.pendingBody.split("{email}")
  return (
    <div className="grid max-w-[60ch] gap-6 rounded-md border border-line bg-surface p-6 md:p-8">
      <div>
        <h2 ref={heading} tabIndex={-1} className="text-2xl font-semibold text-foreground outline-none">
          {t.pendingTitle}
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          {before}
          <bdi className="ltr-fragment font-medium text-foreground">{email}</bdi>
          {after}
        </p>
      </div>
      <CallSummary host={host} start={start} locale={locale} t={t} />
      {result ? (
        <Notice tone={result.tone} title={result.title}>
          {result.body}
        </Notice>
      ) : null}
      {turnstile.element}
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" onClick={resend} disabled={remaining > 0 || sending} aria-busy={sending}>
          {t.resend}
        </Button>
        {remaining > 0 ? <p className="text-sm text-muted-foreground">{format(t.resendWait, { seconds: remaining })}</p> : null}
      </div>
    </div>
  )
}
