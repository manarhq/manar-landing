import { ArrowDownIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

import { DecisionCard } from "./decision-card"

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Decorative light: a narrow aperture at the top edge and a controlled beam below it. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="blueprint absolute inset-0 opacity-60" />
        <div
          className="beam animate-beam-settle absolute top-0 h-[980px] w-[1500px] origin-top"
          style={{ left: "50%" }}
        />
        <div className="absolute top-0 left-1/2 hidden h-40 w-px lg:block -translate-x-1/2 bg-gradient-to-b from-transparent via-primary to-transparent opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="shell grid items-center gap-12 pt-14 pb-20 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-24 lg:pb-28">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="eyebrow">{dict.hero.eyebrow}</p>
          <h1 id="hero-title" className="display mt-6 max-w-[13ch] rtl:max-w-[14ch]">
            {dict.hero.title}
          </h1>
          <p className="lede mt-6 max-w-xl">{dict.hero.body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={`/${locale}/demo`} className={cn(buttonVariants({ size: "lg" }), "group")}>
              {dict.hero.primaryCta}
              <ArrowRightIcon
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
            <Link href="#workspace" className={buttonVariants({ size: "lg", variant: "outline" })}>
              {dict.hero.secondaryCta}
              <ArrowDownIcon aria-hidden className="text-muted-foreground" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 lg:ps-4 xl:col-span-5 xl:col-start-8 xl:ps-0">
          <DecisionCard dict={dict} />
        </div>
      </div>
    </section>
  )
}
