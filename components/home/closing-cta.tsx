import { ArrowRightIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { CONTACT_EMAIL } from "@/lib/site"
import { cn } from "@/lib/utils"

/** Closing beam: the light comes down onto the one action on the page that matters. */
export function ClosingCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="closing-title" className="relative isolate overflow-hidden pt-32 pb-28 text-center lg:pt-44 lg:pb-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="beam absolute top-0 left-1/2 h-full w-[min(90rem,180vw)] -translate-x-1/2" />
        <div className="absolute top-0 left-1/2 h-28 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="shell">
        <h2 id="closing-title" className="display mx-auto max-w-[16ch]">
          {dict.closing.title}
        </h2>
        <p className="lede mx-auto mt-6 max-w-[46ch]">{dict.closing.body}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
          <Link href={`/${locale}/demo`} className={cn(buttonVariants({ size: "lg" }), "group w-full sm:w-auto")}>
            {dict.closing.cta}
            <ArrowRightIcon aria-hidden className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="ltr-fragment text-[0.9375rem] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  )
}
