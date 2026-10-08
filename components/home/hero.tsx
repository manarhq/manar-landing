import { bookingHref } from "@/lib/site"
import { ArrowRightIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"

import { DecisionRecord } from "./decision-record"

/** Asymmetric split: the promise on the start side, a real approval record on the end side. */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="hero-title" className="border-b border-line">
      <div className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <h1
            id="hero-title"
            className="max-w-[14ch] text-4xl font-semibold tracking-tight text-balance text-foreground md:text-5xl"
          >
            {dict.hero.title}
          </h1>
          <p className="mt-6 max-w-[44ch] text-lg text-pretty text-muted-foreground">{dict.hero.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={bookingHref(locale, dict)} className={buttonVariants({ size: "lg" })}>
              {dict.hero.primaryCta}
              <ArrowRightIcon aria-hidden className="rtl:-scale-x-100" />
            </Link>
            <Link href="#how-it-works" className={buttonVariants({ size: "lg", variant: "secondary" })}>
              {dict.hero.secondaryCta}
            </Link>
          </div>
        </div>
        <figure id="workspace" className="scroll-mt-24 lg:col-span-6">
          <DecisionRecord t={dict.hero.record} />
          <figcaption className="mt-3 text-xs text-muted-foreground">{dict.hero.record.caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}
