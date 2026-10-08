import {
  CheckCircleIcon,
  HashIcon,
  HourglassMediumIcon,
  KeyIcon,
  PaperPlaneTiltIcon,
  ProhibitIcon,
  ScalesIcon,
  UserCheckIcon,
} from "@phosphor-icons/react/ssr"

import { Badge } from "@/components/ui/badge"
import type { Dictionary } from "@/lib/i18n/dictionaries"

import { SectionHeading } from "./section-heading"

const icons = [PaperPlaneTiltIcon, ScalesIcon, UserCheckIcon, KeyIcon, HashIcon]

/** The flow as a five-stop rail: horizontal from lg, vertical below. One fact per stop. */
export function HowItWorks({ dict }: { dict: Dictionary }) {
  const h = dict.how
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="how-title" title={h.title} body={h.body} />

        <ol className="mt-16 grid gap-12 border-s border-line-strong ps-8 lg:grid-cols-5 lg:gap-8 lg:border-s-0 lg:border-t lg:ps-0">
          {h.steps.map((step, i) => {
            const Icon = icons[i]
            return (
              <li key={step.title} className="relative lg:pt-12">
                <span
                  aria-hidden
                  className="absolute -start-[37px] top-1 size-2.5 rounded-sm bg-foreground lg:start-0 lg:-top-[5px]"
                />
                <Icon aria-hidden className="size-6 text-foreground" />
                <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 max-w-[32ch] text-base text-muted-foreground">{step.fact}</p>
                {i === 1 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    <li>
                      <Badge variant="allow">
                        <CheckCircleIcon aria-hidden weight="fill" />
                        {h.outcomes.allow}
                      </Badge>
                    </li>
                    <li>
                      <Badge variant="wait">
                        <HourglassMediumIcon aria-hidden />
                        {h.outcomes.approval}
                      </Badge>
                    </li>
                    <li>
                      <Badge variant="deny">
                        <ProhibitIcon aria-hidden />
                        {h.outcomes.deny}
                      </Badge>
                    </li>
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
