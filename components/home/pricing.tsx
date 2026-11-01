import { CheckIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { links } from "@/lib/launch/links"
import { planOrder, pricingText, type PlanCta } from "@/lib/launch/pricing"
import { bookingHref } from "@/lib/site"

import { LaunchCounter } from "./launch-counter"
import { SectionHeading } from "./section-heading"

export function Pricing({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = pricingText[locale]
  const href = (kind: PlanCta) => (kind === "talk" ? bookingHref(locale, dict) : links.console)

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="pricing-title" title={t.title} body={t.body} />

        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {planOrder.map((id) => {
            const p = t.plans[id]
            return (
              <li key={id} className="flex flex-col rounded-md border border-line bg-surface p-6">
                <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
                  {p.price ? (
                    <>
                      <span className="ltr-fragment text-4xl font-semibold tracking-tight text-foreground">{p.price}</span>
                      <span className="text-sm text-muted-foreground">{p.unit}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-semibold tracking-tight text-foreground">{p.unit}</span>
                  )}
                </p>
                {p.alt ? <p className="mt-1 text-sm text-muted-foreground">{p.alt}</p> : null}
                <ul className="mt-6 flex-1 space-y-2.5 text-sm text-foreground">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckIcon aria-hidden weight="bold" className="mt-0.5 size-4 shrink-0 text-allow" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {id === "pro" ? <LaunchCounter locale={locale} className="mt-4 text-sm text-muted-foreground" /> : null}
                {p.note ? <p className="mt-4 text-xs text-muted-foreground">{p.note}</p> : null}
                {p.ctaKind === "talk" ? (
                  <Link href={href(p.ctaKind)} className={`${buttonVariants({ variant: "secondary", size: "lg" })} mt-6`}>
                    {p.cta}
                  </Link>
                ) : (
                  <a
                    href={href(p.ctaKind)}
                    className={`${buttonVariants({ variant: id === "free" ? "primary" : "secondary", size: "lg" })} mt-6`}
                  >
                    {p.cta}
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        <p className="mt-6 text-sm text-muted-foreground">{t.vat}</p>
      </div>
    </section>
  )
}
