import { ArrowDownIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import { LazyLighthouse } from "@/components/three/lazy-scenes"
import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

/** Split hero: copy on the start side, the lighthouse scene filling the frame behind it. */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate -mt-16 flex min-h-[min(100dvh,60rem)] items-end overflow-hidden lg:-mt-[4.25rem] lg:items-center"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <LazyLighthouse mirror={locale === "ar"} className="absolute inset-0" />
        {/* Scrim on the copy side and at the fold keeps text at AA contrast over any frame. */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent max-lg:bg-gradient-to-t max-lg:from-background max-lg:via-background/85 max-lg:to-background/0 rtl:bg-gradient-to-l" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="shell pt-40 pb-16 sm:pb-20 lg:pt-24 lg:pb-24">
        <div className="max-w-[40rem]">
          <p className="eyebrow motion-safe:animate-rise">{dict.hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="display mt-6 max-w-[12ch] motion-safe:animate-rise rtl:max-w-[14ch]"
            style={{ animationDelay: "80ms" }}
          >
            {dict.hero.title}
          </h1>
          <p className="lede mt-6 max-w-[34rem] motion-safe:animate-rise" style={{ animationDelay: "160ms" }}>
            {dict.hero.body}
          </p>
          <div
            className="mt-9 flex flex-col gap-3 motion-safe:animate-rise sm:flex-row sm:items-center"
            style={{ animationDelay: "240ms" }}
          >
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
      </div>
    </section>
  )
}
