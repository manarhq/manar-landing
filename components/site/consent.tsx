"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  analyticsAllowed,
  pickUtm,
  readConsent,
  readPrivacySignal,
  shouldAskForConsent,
  subscribeConsent,
  UTM_STORAGE_KEY,
  writeConsent,
} from "@/lib/consent"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { CF_BEACON_TOKEN } from "@/lib/site"

export const OPEN_CONSENT_EVENT = "manar:open-consent"
const BEACON_SRC = "https://static.cloudflareinsights.com/beacon.min.js"
const TOKEN = Boolean(CF_BEACON_TOKEN)

const useConsent = () => useSyncExternalStore(subscribeConsent, readConsent, () => null)
/** GPC / Do Not Track. Read on the client only; the server snapshot assumes no signal. */
const usePrivacySignal = () => useSyncExternalStore(() => () => {}, readPrivacySignal, () => false)
const useHydrated = () => useSyncExternalStore(() => () => {}, () => true, () => false)

/** True while the first-visit banner is showing, so floating controls can step aside. */
export function useConsentPending() {
  const consent = useConsent()
  const signal = usePrivacySignal()
  return useHydrated() && shouldAskForConsent(consent, signal, TOKEN)
}

/**
 * Consent for the only optional processing on the site, Cloudflare Web Analytics.
 * Opt-in: nothing optional runs before a choice. Accept and Reject carry equal weight.
 * A browser privacy signal (GPC or DNT) counts as a rejection, and the banner is not shown.
 * Without a configured beacon token there is nothing optional, so there is no banner at all.
 */
export function Consent({ locale, labels }: { locale: Locale; labels: Dictionary["site"]["consent"] }) {
  const consent = useConsent()
  const signal = usePrivacySignal()
  const pending = useConsentPending()
  const hydrated = useHydrated()
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [draft, setDraft] = useState(false)
  const [announce, setAnnounce] = useState("")
  const loaded = useRef(false)
  const analytics = analyticsAllowed(consent, signal, TOKEN)

  useEffect(() => {
    const open = () => {
      setDraft(readConsent()?.analytics ?? false)
      setPrefsOpen(true)
    }
    window.addEventListener(OPEN_CONSENT_EVENT, open)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open)
  }, [])

  useEffect(() => {
    if (analytics) {
      // Campaign fields are kept for this tab only, and only with consent.
      const utm = pickUtm(window.location.search)
      try {
        if (Object.keys(utm).length) sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm))
      } catch {}
      if (!document.querySelector(`script[src="${BEACON_SRC}"]`)) {
        const script = document.createElement("script")
        script.src = BEACON_SRC
        script.defer = true
        script.dataset.cfBeacon = JSON.stringify({ token: CF_BEACON_TOKEN, spa: true })
        document.head.appendChild(script)
        loaded.current = true
      }
    } else if (loaded.current) {
      // The beacon cannot be unloaded in place; a reload is the honest way to stop it.
      window.location.reload()
    }
  }, [analytics])

  function choose(value: boolean) {
    writeConsent(value)
    setPrefsOpen(false)
    setAnnounce(labels.saved)
  }

  return (
    <>
      <p role="status" className="sr-only">
        {announce}
      </p>

      {/*
        Server-rendered and hidden; the pre-paint script in the layout sets data-consent-pending
        on <html> when a choice is needed, so the banner paints with the page (no late pop-in).
        After hydration the same decision comes from useConsentPending().
      */}
      {TOKEN && !prefsOpen && (pending || !hydrated) ? (
          <section
            aria-labelledby="consent-title"
            data-print="hide"
            className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-(--z-banner) mx-auto hidden max-w-3xl rounded-md border border-line bg-elevated p-4 shadow-pop md:p-6 [[data-consent-pending]_&]:block"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end md:gap-8">
              <div>
                <h2 id="consent-title" className="text-base font-semibold text-foreground">
                  {labels.title}
                </h2>
                <p className="mt-1 max-w-[60ch] text-sm text-muted-foreground">
                  {labels.body}{" "}
                  <Link href={`/${locale}/cookies`} className="font-medium text-foreground underline underline-offset-4">
                    {labels.policy}
                  </Link>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 md:flex">
                <Button variant="secondary" size="lg" onClick={() => choose(false)}>
                  {labels.reject}
                </Button>
                <Button variant="secondary" size="lg" onClick={() => choose(true)}>
                  {labels.accept}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="col-span-2 md:col-span-1"
                  onClick={() => {
                    setDraft(false)
                    setPrefsOpen(true)
                  }}
                >
                  {labels.preferences}
                </Button>
              </div>
            </div>
          </section>
      ) : null}

      <Dialog open={prefsOpen} onOpenChange={setPrefsOpen}>
        <DialogContent closeLabel={labels.dialogClose}>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.body}</DialogDescription>

          <div className="divide-y divide-line rounded-md border border-line">
            <Row title={labels.necessaryTitle} body={labels.necessaryBody}>
              <Switch checked disabled aria-label={labels.necessaryTitle} />
            </Row>
            <Row title={labels.analyticsTitle} body={signal ? `${labels.analyticsBody} ${labels.signalNote}` : labels.analyticsBody}>
              <Switch
                checked={draft && !signal}
                onCheckedChange={setDraft}
                disabled={!TOKEN || signal}
                aria-label={labels.analyticsTitle}
              />
            </Row>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="flex flex-wrap gap-4 text-sm">
              <Link href={`/${locale}/cookies`} className="font-medium text-foreground underline underline-offset-4">
                {labels.policy}
              </Link>
              <Link href={`/${locale}/privacy`} className="font-medium text-foreground underline underline-offset-4">
                {labels.privacy}
              </Link>
            </span>
            <Button size="lg" onClick={() => choose(draft && !signal)}>
              {labels.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Row({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  )
}
