import { CheckIcon, CircleDotIcon, FileTextIcon, ScaleIcon, UserRoundCheckIcon } from "lucide-react"

import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

import { IllustrativeBadge } from "./illustrative-badge"

/**
 * Hero composition: a single connected action traced from request to record.
 * All values are sample data and labelled as such.
 */
export function DecisionCard({ dict }: { dict: Dictionary }) {
  const c = dict.hero.card

  return (
    <figure className="relative">
      <div
        aria-hidden
        className="glow absolute -inset-x-10 -top-16 bottom-0 opacity-70 motion-safe:animate-rise"
      />
      <div className="relative overflow-hidden rounded-xl border border-border bg-card/95 shadow-[0_40px_90px_-40px_rgb(0_0_0/0.55)] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-2.5 text-sm">
            <span className="size-2 shrink-0 rounded-full bg-primary shadow-[0_0_0_4px_rgb(var(--beam)/0.18)]" aria-hidden />
            <span className="font-semibold text-foreground">{c.label}</span>
            <span className="ltr-fragment hidden font-mono text-xs text-muted-foreground sm:inline">{c.requestId}</span>
          </div>
          <IllustrativeBadge label={dict.common.illustrativeExample} />
        </div>

        <ol className="relative px-5 py-5 sm:px-6">
          <span
            aria-hidden
            className="absolute start-[2.1rem] top-9 bottom-10 w-px bg-gradient-to-b from-primary via-border to-border sm:start-[2.35rem]"
          />

          <Step icon={<CircleDotIcon />} tone="primary">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{c.system}</span> {c.requests}
            </p>
            <p className="mt-1 text-lg leading-snug font-semibold text-foreground sm:text-xl">{c.action}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {c.target} · <span className="ltr-fragment font-mono text-xs">{c.targetId}</span>
            </p>
          </Step>

          <Step icon={<ScaleIcon />}>
            <p className="text-xs font-semibold text-muted-foreground">{c.policyLabel}</p>
            <p className="mt-1 text-[0.9375rem] leading-snug text-foreground">{c.policy}</p>
            <p className="ltr-fragment mt-1 font-mono text-xs text-muted-foreground">{c.policyId}</p>
          </Step>

          <Step icon={<UserRoundCheckIcon />} tone="warning">
            <p className="text-xs font-semibold text-muted-foreground">{c.decisionLabel}</p>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-md border border-border bg-background/60 p-1 text-center text-xs font-semibold sm:text-sm">
              <span className="rounded-[5px] px-2 py-1.5 text-muted-foreground">{c.options.allow}</span>
              <span className="rounded-[5px] bg-warning/15 px-2 py-1.5 text-warning ring-1 ring-warning/40">
                {c.options.approval}
              </span>
              <span className="rounded-[5px] px-2 py-1.5 text-muted-foreground">{c.options.block}</span>
            </div>
            <p className="mt-2.5 text-sm text-muted-foreground">
              {c.approverLabel}: <span className="font-medium text-foreground">{c.approver}</span>
            </p>
          </Step>

          <Step icon={<FileTextIcon />} last>
            <p className="flex items-center gap-2 text-sm text-foreground">
              <CheckIcon aria-hidden className="size-4 text-success" />
              {c.record}
            </p>
          </Step>
        </ol>
      </div>
    </figure>
  )
}

function Step({
  icon,
  children,
  tone = "neutral",
  last,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  tone?: "neutral" | "primary" | "warning"
  last?: boolean
}) {
  return (
    <li className={cn("relative flex gap-4", !last && "pb-5")}>
      <span
        aria-hidden
        className={cn(
          "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-md border bg-card [&_svg]:size-4",
          tone === "primary" && "border-primary/50 text-primary",
          tone === "warning" && "border-warning/50 text-warning",
          tone === "neutral" && "border-border text-muted-foreground"
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">{children}</div>
    </li>
  )
}
