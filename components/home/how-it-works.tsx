import { BanIcon, CheckIcon, ClockIcon, FileTextIcon, InfoIcon, ScaleIcon, SendIcon, SplitIcon } from "lucide-react"

import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

const stepIcons = [SendIcon, ScaleIcon, SplitIcon, FileTextIcon]

export function HowItWorks({ dict }: { dict: Dictionary }) {
  const h = dict.how

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative py-20 sm:py-24 lg:py-32">
      <div className="shell">
        <div className="max-w-3xl">
          <p className="eyebrow">{h.eyebrow}</p>
          <h2 id="how-title" className="headline mt-5">
            {h.title}
          </h2>
          <p className="lede mt-5 max-w-2xl">{h.body}</p>
        </div>

        <ol className="relative mt-14 grid gap-0 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {/* Connecting rail: vertical on small screens, horizontal on large. */}
          <span
            aria-hidden
            className="absolute start-5 top-5 bottom-5 w-px bg-gradient-to-b from-primary/70 via-border to-border lg:start-5 lg:end-5 lg:top-5 lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r lg:rtl:bg-gradient-to-l"
          />
          {h.steps.map((step, i) => {
            const Icon = stepIcons[i]
            const isDecision = i === 2
            return (
              <li key={step.title} className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 pb-10 last:pb-0 lg:block lg:pb-0">
                <span
                  aria-hidden
                  className={cn(
                    "relative z-10 flex size-10 items-center justify-center rounded-md border bg-background",
                    i === 0 ? "border-primary/60 text-primary" : "border-control/60 text-foreground"
                  )}
                >
                  <Icon className="size-[1.125rem]" />
                </span>
                <div className="lg:mt-7">
                  <p className="font-mono text-xs text-muted-foreground tabular-nums">
                    <span className="ltr-fragment">{String(i + 1).padStart(2, "0")}</span>
                  </p>
                  <h3 className="mt-2 text-lg leading-snug font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{step.body}</p>
                  {isDecision ? (
                    <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                      <Outcome tone="success" icon={<CheckIcon />} label={h.outcomes.allow} />
                      <Outcome tone="warning" icon={<ClockIcon />} label={h.outcomes.approval} />
                      <Outcome tone="danger" icon={<BanIcon />} label={h.outcomes.block} />
                    </ul>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>

        <aside
          aria-labelledby="boundary-title"
          className="mt-16 grid gap-4 rounded-lg border border-border border-s-info bg-card p-5 sm:grid-cols-[auto_1fr] sm:gap-5 sm:p-7 lg:mt-20"
          style={{ borderInlineStartWidth: "3px" }}
        >
          <InfoIcon aria-hidden className="size-5 text-info sm:mt-1" />
          <div>
            <h3 id="boundary-title" className="text-lg font-semibold text-foreground">
              {h.boundaryTitle}
            </h3>
            <p className="mt-2 max-w-3xl text-base leading-relaxed text-foreground sm:text-[1.0625rem]">{h.boundary}</p>
            <p className="mt-3 max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">{h.boundaryDetail}</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Outcome({ tone, icon, label }: { tone: "success" | "warning" | "danger"; icon: React.ReactNode; label: string }) {
  return (
    <li
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-semibold [&_svg]:size-3.5",
        tone === "success" && "border-success/35 bg-success/10 text-success",
        tone === "warning" && "border-warning/40 bg-warning/10 text-warning",
        tone === "danger" && "border-danger/40 bg-danger/10 text-danger"
      )}
    >
      <span aria-hidden className="contents">
        {icon}
      </span>
      {label}
    </li>
  )
}
