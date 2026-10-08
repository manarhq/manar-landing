"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { meetApi, type BookingSummary } from "@/lib/meet/api"

import { CallSummary } from "./call-summary"
import { Notice } from "./notice"

type State =
  | { kind: "working" }
  | { kind: "confirmed"; summary: BookingSummary }
  | { kind: "slot_taken" | "expired" | "invalid" | "failed" }

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Verify once, retrying briefly while a concurrent verify of the same booking is running. */
async function verify(token: string): Promise<State> {
  for (let tries = 0; ; tries += 1) {
    const r = await meetApi.verify(token)
    if (r.ok) return { kind: "confirmed", summary: r.data }
    if (r.status === 409 && r.error.error === "verify_in_progress" && tries < 3) {
      await wait(1000)
      continue
    }
    if (r.status === 409 && r.error.error === "slot_taken") return { kind: "slot_taken" }
    if (r.status === 410) return { kind: "expired" }
    if (r.status === 404 || r.status === 400) return { kind: "invalid" }
    return { kind: "failed" }
  }
}

/** The emailed link lands here. The token leaves the address bar after the first attempt. */
export function ConfirmView({ t, locale, meetHref }: { t: Dictionary["meet"]; locale: "en" | "ar"; meetHref: string }) {
  const c = t.confirm
  const params = useSearchParams()
  const [token] = useState(() => params.get("token"))
  const [state, setState] = useState<State>(token ? { kind: "working" } : { kind: "invalid" })
  const [attempt, setAttempt] = useState(0)
  const started = useRef(-1)

  useEffect(() => {
    if (!token || started.current === attempt) return
    started.current = attempt
    ;(async () => {
      setState(await verify(token))
      const url = new URL(window.location.href)
      url.searchParams.delete("token")
      window.history.replaceState(window.history.state, "", url)
    })()
  }, [token, attempt])

  if (state.kind === "working") return <p role="status" className="text-lg text-muted-foreground">{c.working}</p>
  if (state.kind === "confirmed") {
    return (
      <div className="grid max-w-[60ch] gap-6 rounded-md border border-line bg-surface p-6 md:p-8">
        <Notice tone="allow" title={c.confirmedTitle}>
          {c.confirmedBody}
        </Notice>
        <CallSummary host={state.summary.host.name} start={state.summary.start} locale={locale} t={t} />
      </div>
    )
  }

  const [title, body, href, cta] =
    state.kind === "slot_taken"
      ? [c.slotTakenTitle, c.slotTakenBody, `${meetHref}?retry=1`, c.slotTakenCta]
      : state.kind === "expired"
        ? [c.expiredTitle, c.expiredBody, meetHref, c.startAgain]
        : state.kind === "invalid"
          ? [c.invalidTitle, c.invalidBody, meetHref, c.startAgain]
          : [c.failTitle, c.failBody, null, null]

  return (
    <div className="grid max-w-[60ch] gap-4">
      <Notice tone={state.kind === "failed" ? "deny" : "wait"} title={title}>
        {body}
      </Notice>
      {href && cta ? (
        <Link href={href} className={buttonVariants({ size: "lg", className: "justify-self-start" })}>
          {cta}
        </Link>
      ) : (
        <Button
          size="lg"
          className="justify-self-start"
          onClick={() => {
            setState({ kind: "working" })
            setAttempt((a) => a + 1)
          }}
        >
          {t.retry}
        </Button>
      )}
    </div>
  )
}
