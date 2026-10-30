"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { meetApi, type ApiResult, type BookingSummary, type MeetDays } from "@/lib/meet/api"

import { CallSummary } from "./call-summary"
import { Notice, type Tone } from "./notice"
import { SlotPicker } from "./slot-picker"

type Load = { kind: "loading" } | { kind: "ok"; summary: BookingSummary } | { kind: "ended" | "invalid" | "failed" }

/** The manage link from every booking email: see the call, move it (same host) or cancel it. */
export function ManageView({ t, locale, meetHref }: { t: Dictionary["meet"]; locale: "en" | "ar"; meetHref: string }) {
  const m = t.manage
  const urlToken = useSearchParams().get("token")
  // Read the token once, then drop it from the address bar (as confirm-view does) and keep it here.
  const [kept, setKept] = useState<string | null>(null)
  if (urlToken && kept !== urlToken) setKept(urlToken)
  const token = kept ?? urlToken
  const [load, setLoad] = useState<Load>(token ? { kind: "loading" } : { kind: "invalid" })
  const [version, setVersion] = useState(0)
  const [message, setMessage] = useState<{ tone: Tone; title?: string; body: string } | null>(null)
  const [days, setDays] = useState<MeetDays | "loading" | "error" | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (!urlToken) return
    const url = new URL(window.location.href)
    url.searchParams.delete("token")
    window.history.replaceState(window.history.state, "", url)
  }, [urlToken])

  useEffect(() => {
    if (!token) return
    let live = true
    meetApi.manage(token).then((r) => {
      if (!live) return
      if (r.ok) setLoad({ kind: "ok", summary: r.data })
      else setLoad({ kind: r.status === 410 ? "ended" : r.status === 404 ? "invalid" : "failed" })
    })
    return () => {
      live = false
    }
  }, [token, version])

  if (load.kind === "loading") return <p role="status" className="text-lg text-muted-foreground">{m.loading}</p>
  if (load.kind !== "ok" || !token) {
    const [title, body] =
      load.kind === "ended" ? [m.endedTitle, m.endedBody] : load.kind === "invalid" ? [m.invalidTitle, m.invalidBody] : [m.failTitle, m.failBody]
    return (
      <div className="grid max-w-[60ch] gap-4">
        <Notice tone={load.kind === "failed" ? "deny" : "wait"} title={title}>
          {body}
        </Notice>
        {load.kind === "failed" ? (
          <Button
            size="lg"
            className="justify-self-start"
            onClick={() => {
              setLoad({ kind: "loading" })
              setVersion((v) => v + 1)
            }}
          >
            {t.retry}
          </Button>
        ) : (
          <Link href={meetHref} className={buttonVariants({ size: "lg", className: "justify-self-start" })}>
            {m.bookAnother}
          </Link>
        )}
      </div>
    )
  }

  const summary = load.summary
  const active = summary.status === "confirmed"

  function handle(r: ApiResult<BookingSummary>, success: string) {
    if (r.ok) {
      setLoad({ kind: "ok", summary: r.data })
      setMessage({ tone: "allow", body: success })
      setDays(null)
      setPicked(null)
      return
    }
    if (r.status === 409 && r.error.error === "slot_taken") {
      setDays(r.error.slots ?? "error")
      setPicked(null)
      setMessage({ tone: "wait", body: t.slotTaken })
    } else if (r.status === 409) setMessage({ tone: "wait", body: m.statusInactive })
    else if (r.status === 410) setLoad({ kind: "ended" })
    else if (r.status === 404) setLoad({ kind: "invalid" })
    else if (r.status === 429) setMessage({ tone: "wait", title: t.rateTitle, body: t.rateBody })
    else setMessage({ tone: "deny", title: m.failTitle, body: m.failBody })
  }

  async function openReschedule() {
    setMessage(null)
    setDays("loading")
    const r = await meetApi.slots(summary.host.key)
    setDays(r.ok ? r.data : "error")
  }

  async function reschedule() {
    if (!picked || !token) return
    setBusy(true)
    handle(await meetApi.reschedule(token, picked), m.rescheduled)
    setBusy(false)
  }

  async function cancel() {
    if (!token) return
    setBusy(true)
    const r = await meetApi.cancel(token, reason.trim() || undefined)
    setBusy(false)
    setCancelOpen(false)
    handle(r, m.cancelled)
  }

  const status = summary.status === "confirmed" ? m.statusConfirmed : summary.status === "cancelled" ? m.statusCancelled : m.statusInactive

  return (
    <div className="grid max-w-[60ch] gap-6">
      <div className="grid gap-6 rounded-md border border-line bg-surface p-6 md:p-8">
        <p className="text-sm">
          <span className="text-muted-foreground">{m.statusLabel}: </span>
          <span className="font-medium text-foreground">{status}</span>
        </p>
        <CallSummary host={summary.host.name} start={summary.start} locale={locale} t={t} />
        {active && summary.teamsJoinUrl?.startsWith("https://") ? (
          <a href={summary.teamsJoinUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ className: "justify-self-start" })}>
            {m.join}
          </a>
        ) : null}
      </div>

      {message ? (
        <Notice tone={message.tone} title={message.title}>
          {message.body}
        </Notice>
      ) : null}

      {active && days === null ? (
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" size="lg" onClick={openReschedule}>
            {m.reschedule}
          </Button>
          <Button variant="ghost" size="lg" onClick={() => setCancelOpen(true)}>
            {m.cancel}
          </Button>
        </div>
      ) : null}
      {!active ? (
        <Link href={meetHref} className={buttonVariants({ variant: "secondary", size: "lg", className: "justify-self-start" })}>
          {m.bookAnother}
        </Link>
      ) : null}

      {active && days !== null ? (
        <section aria-labelledby="manage-reschedule" className="grid gap-4">
          <h2 id="manage-reschedule" className="text-xl font-semibold text-foreground">
            {m.rescheduleHeading}
          </h2>
          {days === "loading" ? <p role="status" className="text-muted-foreground">{t.loading}</p> : null}
          {days === "error" ? <Notice tone="wait">{t.slotsFailed}</Notice> : null}
          {Array.isArray(days) ? <SlotPicker days={days} selected={picked} onSelect={setPicked} locale={locale} labels={t} /> : null}
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={reschedule} disabled={!picked || busy} aria-busy={busy}>
              {busy ? m.rescheduling : m.rescheduleSubmit}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                setDays(null)
                setPicked(null)
              }}
            >
              {m.keepTime}
            </Button>
          </div>
        </section>
      ) : null}

      {/* Cancelling is the one destructive action here, so it asks first and is red. */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogTitle>{m.cancelTitle}</DialogTitle>
          <DialogDescription>{m.cancelBody}</DialogDescription>
          <Field className="gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="manage-reason" className="text-sm font-medium text-foreground">
                {m.cancelReason}
              </FieldLabel>
              <span className="text-xs text-muted-foreground">{t.optional}</span>
            </div>
            <Textarea id="manage-reason" rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
          <div className="flex flex-wrap justify-between gap-4">
            <DialogClose render={<Button variant="secondary" size="lg" />}>{m.cancelKeep}</DialogClose>
            <Button variant="destructive" size="lg" onClick={cancel} disabled={busy} aria-busy={busy}>
              {busy ? m.cancelling : m.cancelConfirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
