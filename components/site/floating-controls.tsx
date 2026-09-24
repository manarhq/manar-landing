"use client"

import { Popover } from "@base-ui/react/popover"
import { ArrowRightIcon, ArrowUpIcon, ChatCircleTextIcon, CopyIcon, EnvelopeSimpleIcon, XIcon } from "@phosphor-icons/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { CONTACT_EMAIL } from "@/lib/site"
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
  "inline-flex size-12 items-center justify-center rounded-full border border-border bg-popover/90 text-foreground shadow-[0_18px_40px_-18px_rgb(5_8_12/0.6)] backdrop-blur-md transition-[transform,background-color] duration-200 hover:bg-elevated active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-5"

/** W04 + W20 + W44: one bottom-end stack, stepping aside while the consent banner is up. */
export function FloatingControls({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const reduce = useReducedMotion()
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
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
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
        <AnimatePresence>
          {scrolled ? (
            <motion.button
              type="button"
              onClick={toTop}
              aria-label={dict.site.backToTop}
              title={dict.site.backToTop}
              initial={reduce ? false : { opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className={floatButton}
            >
              <ArrowUpIcon aria-hidden />
            </motion.button>
          ) : null}
        </AnimatePresence>
        <ContactPopover locale={locale} dict={dict} />
      </div>
    </>
  )
}

function ContactPopover({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.site.contact
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")

  async function copy() {
    setStatus((await copyText(CONTACT_EMAIL)) ? "copied" : "failed")
  }

  return (
    <Popover.Root onOpenChange={(open) => !open && setStatus("idle")}>
      <Popover.Trigger aria-label={c.open} title={c.open} className={cn(floatButton, "data-popup-open:bg-elevated")}>
        <ChatCircleTextIcon aria-hidden />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="top" align="end" sideOffset={12} className="z-(--z-float)">
          <Popover.Popup className="w-[min(20rem,calc(100vw-2rem))] origin-(--transform-origin) rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-[0_30px_80px_-30px_rgb(5_8_12/0.6)] transition-[opacity,transform] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <div className="flex items-start justify-between gap-3">
              <Popover.Title className="text-base font-semibold text-foreground">{c.title}</Popover.Title>
              <Popover.Close
                aria-label={c.close}
                className="-me-2 -mt-1 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-elevated hover:text-foreground"
              >
                <XIcon aria-hidden className="size-4" />
              </Popover.Close>
            </div>
            <Popover.Description className="mt-1 text-sm text-muted-foreground">{c.body}</Popover.Description>

            <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-background/60 p-1.5 ps-3">
              <EnvelopeSimpleIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="ltr-fragment min-w-0 flex-1 truncate text-sm font-medium text-foreground select-all hover:text-link">
                {CONTACT_EMAIL}
              </a>
              <button
                type="button"
                onClick={copy}
                aria-label={c.copy}
                title={c.copy}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground active:scale-95"
              >
                <CopyIcon aria-hidden className="size-4" />
              </button>
            </div>
            <p role="status" className={cn("mt-2 min-h-5 text-xs", status === "failed" ? "text-danger" : "text-success")}>
              {status === "copied" ? c.copied : status === "failed" ? c.copyFailed : ""}
            </p>

            <Link href={`/${locale}/demo`} className={cn(buttonVariants(), "group mt-2 w-full")}>
              {dict.common.bookDemo}
              <ArrowRightIcon aria-hidden className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </Link>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
