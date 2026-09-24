"use client"

import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"

import { OPEN_SEARCH_EVENT } from "./search-dialog"

const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

/** Visible search entry on every size (W03); the shortcut hint matches the platform. */
export function SearchButton({ label }: { label: string }) {
  const apple = useSyncExternalStore(() => () => {}, isApple, () => false)
  const open = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))

  return (
    <>
      <Button variant="ghost" size="icon" onClick={open} aria-label={label} className="md:hidden">
        <MagnifyingGlassIcon aria-hidden />
      </Button>
      <button
        type="button"
        onClick={open}
        aria-keyshortcuts={apple ? "Meta+K" : "Control+K"}
        className="hidden h-10 items-center gap-2 rounded-full border border-border bg-card/60 ps-3 pe-1.5 text-sm text-muted-foreground transition-colors hover:border-control hover:text-foreground md:inline-flex"
      >
        <MagnifyingGlassIcon aria-hidden className="size-4" />
        <span className="me-3 hidden xl:inline">{label}</span>
        <kbd className="ltr-fragment rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">
          {apple ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>
    </>
  )
}
