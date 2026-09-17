import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

export function Deployment({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const d = dict.deployment

  return (
    <section id="deployment" aria-labelledby="deployment-title" className="relative py-20 sm:py-24 lg:py-32">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">{d.eyebrow}</p>
            <h2 id="deployment-title" className="headline mt-5">
              {d.title}
            </h2>
            <p className="lede mt-5">{d.body}</p>
            <Link href={`/${locale}/demo`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "group mt-8")}>
              {d.cta}
              <ArrowRightIcon aria-hidden className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 lg:ps-10">
          <ol className="relative grid gap-4">
            {d.dimensions.map((dim, i) => (
              <li key={dim.title} className="rounded-lg border border-border bg-card p-6 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    <span aria-hidden className="ltr-fragment me-3 font-mono text-sm font-medium text-primary/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {dim.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">{dim.question}</p>
                </div>
                <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">{dim.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {dim.options.map((option) => (
                    <li
                      key={option}
                      className="rounded-md border border-control/50 bg-background/50 px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{d.footnote}</p>
        </div>
      </div>
    </section>
  )
}
