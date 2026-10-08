import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { bookingHref } from "@/lib/site"

import { BrandMark } from "./brand"
import { CookieSettingsButton } from "./cookie-settings-button"
import { navItems } from "./nav-items"

const linkClass =
  "inline-flex min-h-9 items-center text-sm text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear()
  const f = dict.footer

  return (
    <footer className="mt-auto border-t border-line bg-surface" data-print="hide">
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-12 lg:col-span-6">
          <Link href={`/${locale}`} aria-label={dict.common.homeLink} className="inline-flex items-center gap-2 rounded-md">
            <BrandMark src={dict.images.logo.src} className="h-8" />
            <span className="text-lg font-semibold text-foreground">{dict.common.brandName}</span>
          </Link>
          <p className="mt-4 text-base font-medium text-foreground">{f.tagline}</p>
          <p className="mt-2 max-w-[48ch] text-sm text-muted-foreground">{f.hackathon}</p>
          <a
            href={dict.links.vax}
            target="_blank"
            rel="noopener"
            aria-label={`${dict.common.endorsement}. ${dict.common.endorsementLink}`}
            className="mt-4 inline-flex min-h-9 items-center gap-1 rounded-sm text-sm font-medium text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
          >
            {dict.common.endorsement}
            <ArrowUpRightIcon aria-hidden className="size-3.5 rtl:-scale-x-100" />
          </a>
        </div>

        <nav aria-label={f.sectionsTitle} className="md:col-span-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">{f.sectionsTitle}</h2>
          <ul className="mt-3">
            {navItems(locale, dict).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={f.legalTitle} className="md:col-span-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">{f.legalTitle}</h2>
          <ul className="mt-3">
            <li>
              <Link href={`/${locale}/privacy`} className={linkClass}>
                {f.privacy}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/cookies`} className={linkClass}>
                {f.cookies}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/terms`} className={linkClass}>
                {f.terms}
              </Link>
            </li>
            <li>
              <CookieSettingsButton label={f.cookieSettings} className={`${linkClass} cursor-pointer text-start`} />
            </li>
          </ul>
        </nav>

        <div className="md:col-span-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">{f.contactTitle}</h2>
          <ul className="mt-3">
            <li>
              <a href={`mailto:${dict.links.email}`} className={`ltr-fragment ${linkClass}`}>
                {dict.links.email}
              </a>
            </li>
            <li>
              <Link href={bookingHref(locale, dict)} className={linkClass}>
                {dict.common.bookDemo}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="shell py-6 text-sm text-muted-foreground">
          © <span className="ltr-fragment">{year}</span> VAX Labs Cloud Computing Services L.L.C S.P.C. {f.rights}
        </p>
      </div>
    </footer>
  )
}
