"use client"

import { useState } from "react"

import { formatDay, formatTime, type MeetDays } from "@/lib/meet/api"
import { cn } from "@/lib/utils"

const choice = (active: boolean) =>
  cn(
    "inline-flex h-11 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors duration-[120ms] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    active ? "border-ink bg-ink text-ink-text" : "border-line bg-elevated text-foreground hover:bg-subtle"
  )

/**
 * Day buttons, then that day's free times in UAE time. Plain buttons with aria-pressed, so the
 * keyboard order is the reading order in either direction.
 */
export function SlotPicker({
  days,
  selected,
  onSelect,
  locale,
  labels,
}: {
  days: MeetDays
  selected: string | null
  onSelect: (slot: string) => void
  locale: "en" | "ar"
  labels: { timezone: string; daysLabel: string; timesLabel: string; emptyDay: string }
}) {
  const fallback = days.find((d) => selected && d.slots.includes(selected)) ?? days.find((d) => d.slots.length) ?? days[0]
  const [picked, setPicked] = useState<string | null>(null)
  const day = days.find((d) => d.date === picked) ?? fallback
  if (!day) return <p className="text-base text-muted-foreground">{labels.emptyDay}</p>

  return (
    <div className="grid gap-6">
      <p className="text-sm text-muted-foreground">{labels.timezone}</p>
      <div role="group" aria-label={labels.daysLabel} className="flex flex-wrap gap-2">
        {days.map((d) => (
          <button key={d.date} type="button" aria-pressed={d.date === day.date} onClick={() => setPicked(d.date)} className={choice(d.date === day.date)}>
            {formatDay(d.date, locale)}
          </button>
        ))}
      </div>
      <div role="group" aria-label={labels.timesLabel}>
        {day.slots.length === 0 ? (
          <p className="text-base text-muted-foreground">{labels.emptyDay}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {day.slots.map((slot) => (
              <button key={slot} type="button" aria-pressed={slot === selected} onClick={() => onSelect(slot)} className={choice(slot === selected)}>
                <span className="ltr-fragment font-mono">{formatTime(slot, locale)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
