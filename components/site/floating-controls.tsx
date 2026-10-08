"use client"

import { Popover } from "@base-ui/react/popover"
import { ArrowRightIcon, ArrowUpIcon, ChatCircleTextIcon, CopyIcon, EnvelopeSimpleIcon, XIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"

/** Only what the controls show, so the page does not ship the whole content document to the browser. */
export type ChromeText = Pick<Dictionary, "site" | "common" | "links">
import { bookingHref } from "@/lib/site"
import { cn } from "@/lib/utils"

import { useConsentPending } from "./consent"

/** Try the async clipboard, fall back to execCommand, and report honestly (W09). */
export async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    const area = document.createElement("textarea")
    area.value = value
    area.setAttribute("readonly", "")
    area.style.cssText = "position:fixed;opacity:0"
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand?.("copy") ?? false
    area.remove()
    return ok
  }
}

const floatButton =
  "inline-flex size-11 items-center justify-center rounded-md border border-line bg-elevated text-foreground shadow-pop transition-colors duration-[120ms] hover:bg-subtle active:translate-y-px focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-5"

/** W04 + W20 + W44: one bottom-end stack, stepping aside while the consent banner is up. */
export function FloatingControls({ locale, dict }: { locale: Locale; dict: ChromeText }) {
  const pending = useConsentPending()
  const [scrolled, setScrolled] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = sentinel.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(entry.boundingClientRect.top < 0))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function toTop() {
    // Smooth only when the visitor allows motion (html scroll-behavior is set in globals.css).
    window.scrollTo({ top: 0 })
    // Move focus with the view so keyboard users are not left at the bottom (W04).
    document.getElementById("main")?.focus({ preventScroll: true })
  }

  if (pending) return <div ref={sentinel} aria-hidden className="pointer-events-none absolute top-[150vh] h-px w-px" />

  return (
    <>
      <div ref={sentinel} aria-hidden className="pointer-events-none absolute top-[150vh] h-px w-px" />
      <div
        data-print="hide"
        className="fixed end-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-(--z-float) flex flex-col items-end gap-3"
      >
        {scrolled ? (
          <button type="button" onClick={toTop} aria-label={dict.site.backToTop} title={dict.site.backToTop} className={floatButton}>
            <ArrowUpIcon aria-hidden />
          </button>
        ) : null}
        <ContactPopover locale={locale} dict={dict} />
      </div>
    </>
  )
}

function ContactPopover({ locale, dict }: { locale: Locale; dict: ChromeText }) {
  const c = dict.site.contact
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")

  async function copy() {
    setStatus((await copyText(dict.links.email)) ? "copied" : "failed")
  }

  return (
    <Popover.Root onOpenChange={(open) => !open && setStatus("idle")}>
      <Popover.Trigger aria-label={c.open} title={c.open} className={cn(floatButton, "data-popup-open:bg-subtle")}>
        <ChatCircleTextIcon aria-hidden />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="top" align="end" sideOffset={12} className="z-(--z-float)">
          <Popover.Popup className="w-[min(20rem,calc(100vw-2rem))] origin-(--transform-origin) rounded-md border border-line bg-popover p-4 text-popover-foreground shadow-pop transition-[opacity,translate] duration-[160ms] data-ending-style:translate-y-1 data-ending-style:opacity-0 data-starting-style:translate-y-1 data-starting-style:opacity-0">
            <div className="flex items-start justify-between gap-3">
              <Popover.Title className="text-base font-semibold text-foreground">{c.title}</Popover.Title>
              <Popover.Close
                aria-label={c.close}
                className="-me-2 -mt-1 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-subtle hover:text-foreground"
              >
                <XIcon aria-hidden className="size-4" />
              </Popover.Close>
            </div>
            <Popover.Description className="mt-1 text-sm text-muted-foreground">{c.body}</Popover.Description>

            <div className="mt-4 flex items-center gap-2 rounded-md border border-line bg-page p-1 ps-3">
              <EnvelopeSimpleIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              <a href={`mailto:${dict.links.email}`} className="ltr-fragment min-w-0 flex-1 truncate text-sm font-medium text-foreground select-all hover:underline">
                {dict.links.email}
              </a>
              <button
                type="button"
                onClick={copy}
                aria-label={c.copy}
                title={c.copy}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-[120ms] hover:bg-subtle hover:text-foreground active:translate-y-px"
              >
                <CopyIcon aria-hidden className="size-4" />
              </button>
            </div>
            <p role="status" className={cn("mt-2 min-h-5 text-xs", status === "failed" ? "text-deny" : "text-allow")}>
              {status === "copied" ? c.copied : status === "failed" ? c.copyFailed : ""}
            </p>

            <Link href={bookingHref(locale, dict)} className={cn(buttonVariants(), "mt-2 w-full")}>
              {dict.common.bookDemo}
              <ArrowRightIcon aria-hidden className="rtl:-scale-x-100" />
            </Link>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
