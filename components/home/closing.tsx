import { ArrowRightIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { bookingHref } from "@/lib/site"

export function Closing({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.closing
  return (
    <section aria-labelledby="closing-title" className="border-t border-line py-16 md:py-24">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[40ch]">
          <h2 id="closing-title" className="text-3xl font-semibold tracking-tight text-balance text-foreground md:text-4xl">
            {c.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{c.body}</p>
        </div>
        <Link href={bookingHref(locale, dict)} className={buttonVariants({ size: "lg" })}>
          {c.cta}
          <ArrowRightIcon aria-hidden className="rtl:-scale-x-100" />
        </Link>
      </div>
    </section>
  )
}
