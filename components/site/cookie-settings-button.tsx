"use client"

import { OPEN_CONSENT_EVENT } from "./events"

/** Reopens the privacy preferences so a choice can be changed or withdrawn (W02). */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={className}>
      {label}
    </button>
  )
}
