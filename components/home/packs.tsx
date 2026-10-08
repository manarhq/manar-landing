import { CheckCircleIcon, ShieldCheckIcon } from "@phosphor-icons/react/ssr"

import { Badge } from "@/components/ui/badge"
import type { Dictionary } from "@/lib/i18n/dictionaries"

import { SectionHeading } from "./section-heading"

/** One built pack shown in full, the planned ones as a quiet list beside it. */
export function Packs({ dict }: { dict: Dictionary }) {
  const p = dict.packs
  return (
    <section id="platform" aria-labelledby="packs-title" className="border-y border-line bg-surface py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="packs-title" title={p.title} body={p.body} />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <article className="rounded-md border border-line bg-elevated p-6 lg:col-span-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ShieldCheckIcon aria-hidden className="size-8 text-foreground" />
              <Badge variant="allow">
                <CheckCircleIcon aria-hidden weight="fill" />
                {p.available}
              </Badge>
            </div>
            <h3 className="mt-8 text-2xl font-semibold text-foreground">{p.soc.name}</h3>
            <p className="mt-2 text-base text-muted-foreground">{p.soc.systems}</p>
            <ul className="mt-8 grid gap-2 border-t border-line pt-6">
              {p.soc.actions.map((action) => (
                <li key={action} className="ltr-fragment font-mono text-sm text-foreground">
                  {action}
                </li>
              ))}
            </ul>
          </article>

          <ul className="divide-y divide-line self-start lg:col-span-6">
            {p.others.map((pack) => (
              <li key={pack.name} className="flex items-start justify-between gap-6 py-6 first:pt-0">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{pack.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pack.systems}</p>
                </div>
                <Badge variant="neutral" className="mt-1">
                  {p.planned}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
