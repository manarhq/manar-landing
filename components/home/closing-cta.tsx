import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { CONTACT_EMAIL } from "@/lib/site"
import { cn } from "@/lib/utils"

export function ClosingCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="closing-title" className="pb-20 sm:pb-24 lg:pb-32">
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center sm:px-12 sm:py-20 lg:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="beam absolute top-0 left-1/2 h-full w-[1000px] -translate-x-1/2" />
            <div className="absolute top-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-primary to-transparent" />
          </div>
          <h2 id="closing-title" className="headline mx-auto max-w-3xl">
            {dict.closing.title}
          </h2>
          <p className="lede mx-auto mt-5 max-w-2xl">{dict.closing.body}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
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
      </div>
    </section>
  )
}
