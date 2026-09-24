"use client"

import { Dialog } from "@base-ui/react/dialog"
import { Switch } from "@base-ui/react/switch"
import { XIcon } from "@phosphor-icons/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import { pickUtm, readConsent, subscribeConsent, UTM_STORAGE_KEY, writeConsent } from "@/lib/consent"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { CF_BEACON_TOKEN } from "@/lib/site"

export const OPEN_CONSENT_EVENT = "manar:open-consent"
const BEACON_SRC = "https://static.cloudflareinsights.com/beacon.min.js"

const useConsent = () => useSyncExternalStore(subscribeConsent, readConsent, () => null)
const useHydrated = () => useSyncExternalStore(() => () => {}, () => true, () => false)

/** True while the first-visit banner is showing, so floating controls can step aside (W44). */
export function useConsentPending() {
  const consent = useConsent()
  return useHydrated() && Boolean(CF_BEACON_TOKEN) && consent === null
}

/**
 * W02 + W14: real consent for the only optional processing on the site, Cloudflare Web Analytics.
 * Without a configured beacon token there is nothing optional, so no banner is shown.
 */
export function Consent({ locale, labels }: { locale: Locale; labels: Dictionary["site"]["consent"] }) {
  const consent = useConsent()
  const pending = useConsentPending()
  const reduce = useReducedMotion()
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [draft, setDraft] = useState(false)
  const [announce, setAnnounce] = useState("")
  const loaded = useRef(false)
  const analytics = Boolean(CF_BEACON_TOKEN && consent?.analytics)

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

      <AnimatePresence>
        {pending && !prefsOpen ? (
          <motion.section
            aria-labelledby="consent-title"
            data-print="hide"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-(--z-banner) mx-auto max-w-3xl rounded-lg border border-border bg-popover/95 p-5 shadow-[0_30px_80px_-30px_rgb(5_8_12/0.6)] backdrop-blur-md sm:p-6"
          >
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <h2 id="consent-title" className="text-base font-semibold text-foreground">
                  {labels.title}
                </h2>
                <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                  {labels.body}{" "}
                  <Link href={`/${locale}/cookies`} className="font-medium text-link underline underline-offset-4">
                    {labels.policy}
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:flex-nowrap">
                <Button variant="ghost" onClick={() => { setDraft(false); setPrefsOpen(true) }}>
                  {labels.preferences}
                </Button>
                <Button variant="outline" onClick={() => choose(false)}>
                  {labels.reject}
                </Button>
                <Button onClick={() => choose(true)}>{labels.accept}</Button>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <Dialog.Root open={prefsOpen} onOpenChange={setPrefsOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-(--z-overlay) bg-[#05080c]/55 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <Dialog.Popup className="fixed inset-x-3 top-1/2 z-(--z-overlay) mx-auto max-h-[90dvh] max-w-lg -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-popover p-6 text-popover-foreground shadow-[0_40px_120px_-30px_rgb(5_8_12/0.7)] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="text-lg font-semibold text-foreground">{labels.title}</Dialog.Title>
              <Dialog.Close
                aria-label={labels.dialogClose}
                className="-me-2 -mt-1 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-elevated hover:text-foreground"
              >
                <XIcon aria-hidden className="size-4" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {labels.body}
            </Dialog.Description>

            <div className="mt-6 divide-y divide-border rounded-md border border-border">
              <Row title={labels.necessaryTitle} body={labels.necessaryBody}>
                <Switch.Root checked disabled aria-label={labels.necessaryTitle} className={switchRoot}>
                  <Switch.Thumb className={switchThumb} />
                </Switch.Root>
              </Row>
              <Row title={labels.analyticsTitle} body={labels.analyticsBody}>
                <Switch.Root
                  checked={draft}
                  onCheckedChange={setDraft}
                  disabled={!CF_BEACON_TOKEN}
                  aria-label={labels.analyticsTitle}
                  className={switchRoot}
                >
                  <Switch.Thumb className={switchThumb} />
                </Switch.Root>
              </Row>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Link href={`/${locale}/cookies`} className="text-sm font-medium text-link underline underline-offset-4">
                {labels.policy}
              </Link>
              <Button onClick={() => choose(draft)}>{labels.save}</Button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

const switchRoot =
  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-control bg-elevated p-0.5 transition-colors data-checked:border-transparent data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const switchThumb =
  "block size-[1.125rem] rounded-full bg-foreground/80 shadow-sm transition-transform duration-200 data-checked:translate-x-5 data-checked:bg-primary-foreground rtl:data-checked:-translate-x-5"

function Row({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-5 p-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
      {children}
    </div>
  )
}
