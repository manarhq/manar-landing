"use client"

import { useSyncExternalStore } from "react"

import type { Dictionary } from "@/lib/i18n/dictionaries"
import { formatTime, formatWhen, visitorTimeZone } from "@/lib/meet/api"

const noop = () => () => {}

/** Who and when: UAE time, plus the visitor's own time when their clock is elsewhere. */
export function CallSummary({ host, start, locale, t }: { host: string; start: string; locale: "en" | "ar"; t: Dictionary["meet"] }) {
  const zone = useSyncExternalStore(noop, visitorTimeZone, () => null)
  return (
    <dl className="grid gap-x-8 gap-y-2 text-base sm:grid-cols-[auto_1fr]">
      <dt className="text-muted-foreground">{t.summary.hostLabel}</dt>
      <dd className="font-medium text-foreground">
        <bdi>{host}</bdi>
      </dd>
      <dt className="text-muted-foreground">{t.summary.whenLabel}</dt>
      <dd className="font-medium text-foreground">
        {formatWhen(start, locale)}
        <span className="block text-sm font-normal text-muted-foreground">
          {t.timezone}
          {zone ? (
            <>
              {" "}
              {t.yourTime.split("{time}")[0]}
              <bdi className="ltr-fragment">{`${formatTime(start, locale, zone)} (${zone})`}</bdi>
              {t.yourTime.split("{time}")[1]}
            </>
          ) : null}
        </span>
      </dd>
    </dl>
  )
}
