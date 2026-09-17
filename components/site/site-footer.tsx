import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"

import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { CONTACT_EMAIL, VAX_URL } from "@/lib/site"

import { BrandMark } from "./brand"
import { navItems } from "./nav-items"

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="shell grid gap-12 py-14 md:grid-cols-12 md:gap-8 lg:py-16">
        <div className="md:col-span-6 lg:col-span-5">
          <Link href={`/${locale}`} aria-label={dict.common.homeLink} className="inline-flex items-center gap-3 rounded-md">
            <BrandMark className="h-11" />
            <span className="text-xl font-bold tracking-[-0.02em] rtl:tracking-normal">{dict.common.brandName}</span>
          </Link>
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-muted-foreground">{dict.footer.tagline}</p>
          <a
            href={VAX_URL}
            target="_blank"
            rel="noopener"
            aria-label={`${dict.common.endorsement}. ${dict.common.endorsementLink}`}
            className="mt-6 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {dict.common.endorsement}
            <ArrowUpRightIcon aria-hidden className="size-3.5 rtl:-scale-x-100" />
          </a>
        </div>

        <nav aria-label={dict.footer.sectionsTitle} className="md:col-span-3 lg:col-span-3 lg:col-start-8">
          <h2 className="text-sm font-semibold text-foreground">{dict.footer.sectionsTitle}</h2>
          <ul className="mt-4 space-y-1">
            {navItems(locale, dict).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3 lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">{dict.footer.contactTitle}</h2>
          <ul className="mt-4 space-y-1">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="ltr-fragment inline-flex min-h-9 items-center text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <Link
                href={`/${locale}/demo`}
                className="inline-flex min-h-9 items-center text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {dict.footer.demoLink}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="shell py-6 text-sm text-muted-foreground">
          <p>
            © <span className="ltr-fragment">{year}</span> VAX. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
