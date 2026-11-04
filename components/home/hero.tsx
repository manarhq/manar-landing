import { CheckIcon, HourglassMediumIcon, ProhibitIcon } from "@phosphor-icons/react/ssr"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import { launchCopy } from "@/lib/launch/copy"
import { links } from "@/lib/launch/links"
import { cn } from "@/lib/utils"


const pill = {
  allowed: { cls: "bg-allow-soft text-allow", Icon: CheckIcon },
  asks: { cls: "bg-wait-soft text-wait", Icon: HourglassMediumIcon },
  blocked: { cls: "bg-deny-soft text-deny", Icon: ProhibitIcon },
} as const

/**
 * Dark-first hero (approved Midnight mockup). The section forces the dark tokens whatever the page
 * theme is; the rest of the page follows the OS. The feed is sample data and says so.
 */
export function Hero({ locale }: { locale: Locale }) {
  const h = launchCopy[locale].hero

  return (
    <section aria-labelledby="hero-title" className="dark border-b border-line bg-background text-foreground">
      <div className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-allow-soft px-3 py-1 text-xs font-medium text-allow">
            <span aria-hidden className="size-1.5 rounded-[2px] bg-current" />
            {h.pill}
          </span>
          <h1
            id="hero-title"
            className="mt-5 max-w-[16ch] text-4xl leading-[1.08] font-semibold tracking-tight text-balance rtl:tracking-normal md:text-5xl lg:text-[3.4rem]"
          >
            {h.titleBefore}
            <em className="text-allow not-italic">{h.titleEm}</em>
            {h.titleAfter}
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-pretty text-muted-foreground">{h.lede}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={links.console} className={buttonVariants({ size: "lg" })}>
              {h.primary}
            </a>
            <a href={links.sample} className={buttonVariants({ size: "lg", variant: "secondary" })}>
              {h.secondary}
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{h.fine}</p>
        </div>

        <figure aria-label={h.feed.label} className="rounded-xl border border-line bg-surface p-1.5">
          <div className="flex justify-between p-2.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              {h.feed.head}
            </span>
            <span>{h.feed.sample}</span>
          </div>
          <ol>
            {h.feed.rows.map((row) => {
              const { cls, Icon } = pill[row.state]
              return (
                <li
                  key={row.time}
                  className={cn(
                    "grid grid-cols-[3.6rem_minmax(0,1fr)_auto] items-center gap-2.5 border-t border-line p-2.5 text-sm first:border-t-0",
                    row.state === "asks" && "rounded-md border-t-0 bg-wait-soft shadow-[inset_3px_0_0_var(--orange)] rtl:shadow-[inset_-3px_0_0_var(--orange)]",
                  )}
                >
                  <time className="ltr-fragment text-xs text-muted-foreground tabular-nums">{row.time}</time>
                  <span>
                    {row.before}
                    <code className="ltr-fragment font-mono text-[13px]">{row.code}</code>
                    {row.after}
                  </span>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", cls)}>
                    <Icon aria-hidden weight="bold" className="size-3" />
                    {h.feed.states[row.state]}
                  </span>
                </li>
              )
            })}
          </ol>
        </figure>
      </div>
    </section>
  )
}
