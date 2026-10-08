import {
  CheckCircleIcon,
  HashIcon,
  HourglassMediumIcon,
  KeyIcon,
  PaperPlaneTiltIcon,
  ScalesIcon,
  UserCheckIcon,
} from "@phosphor-icons/react/ssr"
import type { CSSProperties } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

const stepIcons = [PaperPlaneTiltIcon, ScalesIcon, UserCheckIcon, KeyIcon, HashIcon]
/** The policy step ends in "needs approval", so its marker carries the wait colour. */
const waitStep = 1
const approvalStep = 2

/**
 * A real component, not a picture of an app: one approval record as the console shows it,
 * with invented data. On load the markers fill in order and the badge switches from
 * "needs approval" to "approved" (globals.css, .flow-*). The resting state is the final one.
 */
export function DecisionRecord({ t }: { t: Dictionary["hero"]["record"] }) {
  const at = { "--at": approvalStep } as CSSProperties

  return (
    <Card aria-label={t.label} role="group" className="bg-elevated">
      <CardHeader className="border-b border-line">
        <CardTitle>{t.title}</CardTitle>
        <span className="grid">
          <Badge variant="wait" aria-hidden className="flow-before [grid-area:1/1]" style={at}>
            <HourglassMediumIcon aria-hidden />
            {t.pending}
          </Badge>
          <Badge variant="allow" className="flow-after [grid-area:1/1]" style={at}>
            <CheckCircleIcon aria-hidden weight="fill" />
            {t.approved}
          </Badge>
        </span>
      </CardHeader>

      <CardContent className="grid gap-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{t.agent}</span> {t.wants}{" "}
          <code className="ltr-fragment rounded-sm bg-surface px-1 py-0.5 font-mono text-[13px] text-foreground">
            {t.action}
          </code>
        </p>

        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {t.fields.map((field) => (
            <div key={field.label} className="contents">
              <dt className="text-muted-foreground">{field.label}</dt>
              <dd className={cn("text-foreground", field.mono && "ltr-fragment font-mono text-[13px]")}>{field.value}</dd>
            </div>
          ))}
        </dl>

        <div>
          <p className="text-sm font-medium text-foreground">{t.timelineLabel}</p>
          <ol className="relative mt-3 grid gap-3">
            <span aria-hidden className="absolute start-3 top-3 bottom-3 w-px bg-line-strong" />
            {t.steps.map((step, i) => {
              const Icon = stepIcons[i]
              return (
                <li key={step.text} className="relative grid grid-cols-[24px_1fr] items-center gap-3">
                  <span
                    aria-hidden
                    style={{ "--i": i } as CSSProperties}
                    className={cn(
                      "flow-mark flex size-6 items-center justify-center rounded-sm border",
                      i === waitStep ? "border-wait bg-wait-soft text-wait" : "border-allow bg-allow-soft text-allow"
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="flex flex-wrap items-baseline gap-x-3 text-sm">
                    <time className="ltr-fragment font-mono text-xs text-muted-foreground">{step.time}</time>
                    <span className="text-foreground">{step.text}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
