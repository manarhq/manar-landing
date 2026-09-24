import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { CONTACT_EMAIL, VAX_URL } from "@/lib/site"

import { BrandMark } from "./brand"
import { CookieSettingsButton } from "./cookie-settings-button"
import { navItems } from "./nav-items"

const linkClass =
  "inline-flex min-h-9 items-center text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear()
  const f = dict.footer

  return (
    <footer className="relative isolate overflow-hidden border-t border-border" data-print="hide">
      <div className="shell grid gap-12 pt-16 pb-10 md:grid-cols-12 md:gap-8 lg:pt-20">
        <div className="md:col-span-12 lg:col-span-5">
          <Link href={`/${locale}`} aria-label={dict.common.homeLink} className="inline-flex items-center gap-3 rounded-md">
            <BrandMark className="h-11" />
            <span className="text-xl font-semibold tracking-[-0.03em] rtl:tracking-normal">{dict.common.brandName}</span>
          </Link>
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-muted-foreground">{f.tagline}</p>
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

        <nav aria-label={f.sectionsTitle} className="md:col-span-4 lg:col-span-2 lg:col-start-7">
          <h2 className="text-sm font-semibold text-foreground">{f.sectionsTitle}</h2>
          <ul className="mt-4 space-y-1">
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
          <ul className="mt-4 space-y-1">
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
          <ul className="mt-4 space-y-1">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={`ltr-fragment ${linkClass}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <Link href={`/${locale}/demo`} className={linkClass}>
                {f.demoLink}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="shell py-6 text-sm text-muted-foreground">
          <p>
            © <span className="ltr-fragment">{year}</span> VAX. {f.rights}
          </p>
        </div>
      </div>
      {/* The wordmark, set large and cropped by the page edge: the lighthouse signs off. */}
      <div aria-hidden className="shell select-none">
        <p className="-mb-[0.2em] text-[clamp(6rem,24vw,22rem)] leading-[0.8] font-semibold tracking-[-0.06em] text-foreground/[0.06] rtl:tracking-normal">
          {dict.common.brandName}
        </p>
      </div>

    </footer>
  )
}
