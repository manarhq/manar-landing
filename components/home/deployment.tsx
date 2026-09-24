import { ArrowRightIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

/** Three independent decisions, each a row: the question on one side, the answers on the other. */
export function Deployment({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const d = dict.deployment

  return (
    <section id="deployment" aria-labelledby="deployment-title" className="relative border-y border-border bg-card/40 py-24 sm:py-28 lg:py-40">
      <div className="shell">
        <div className="max-w-3xl">
          <h2 id="deployment-title" className="headline">
            {d.title}
          </h2>
          <p className="lede mt-5 max-w-[56ch]">{d.body}</p>
        </div>

        <dl className="mt-16 lg:mt-20">
          {d.dimensions.map((dim) => (
            <div key={dim.title} className="reveal grid gap-4 border-t border-border py-10 lg:grid-cols-12 lg:gap-10 lg:py-12">
              <dt className="lg:col-span-4">
                <span className="block text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] leading-none font-semibold tracking-[-0.03em] text-foreground rtl:leading-tight rtl:tracking-normal">
                  {dim.title}
                </span>
                <span className="mt-3 block text-base text-link">{dim.question}</span>
              </dt>
              <dd className="lg:col-span-8">
                <p className="max-w-[60ch] text-[1.0625rem] leading-relaxed text-muted-foreground">{dim.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {dim.options.map((option) => (
                    <li key={option} className="rounded-full border border-control/60 bg-background px-4 py-2 text-sm font-medium text-foreground">
                      {option}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">{d.footnote}</p>
          <Link href={`/${locale}/demo`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "group shrink-0")}>
            {d.cta}
            <ArrowRightIcon aria-hidden className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  )
}
