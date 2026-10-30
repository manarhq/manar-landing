"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
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
import { POSTHOG_HOST, POSTHOG_KEY } from "@/lib/site"

import { OPEN_CONSENT_EVENT } from "./events"

/** The settings dialog loads only when someone opens it, so it stays off the first-paint path. */
const ConsentSettings = dynamic(() => import("./consent-settings").then((m) => m.ConsentSettings), { ssr: false })

const TOKEN = Boolean(POSTHOG_KEY)

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
 * Consent for the only optional processing on the site, PostHog analytics.
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
      if (!loaded.current) {
        loaded.current = true
        // Cookieless: memory persistence, nothing written to cookies or storage. Loaded only after opt-in.
        import("posthog-js").then(({ default: posthog }) => {
          posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            persistence: "memory",
            autocapture: false,
            disable_session_recording: true,
            capture_pageview: "history_change",
            respect_dnt: true,
          })
        })
      }
    } else if (loaded.current) {
      // The analytics code cannot be unloaded in place; a reload is the honest way to stop it.
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

      {prefsOpen ? (
        <ConsentSettings
          locale={locale}
          labels={labels}
          signal={signal}
          tokenConfigured={TOKEN}
          draft={draft}
          setDraft={setDraft}
          onClose={() => setPrefsOpen(false)}
          onSave={() => choose(draft && !signal)}
        />
      ) : null}
    </>
  )
}
