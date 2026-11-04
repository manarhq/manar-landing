import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { launchCopy } from "@/lib/launch/copy"
import { links } from "@/lib/launch/links"
import { discordUrl } from "@/lib/launch/discord"
import { bookingHref } from "@/lib/site"

import { BrandMark } from "./brand"
import { CookieSettingsButton } from "./cookie-settings-button"

const linkClass =
  "inline-flex min-h-9 items-center gap-1 text-sm text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear()
  const f = launchCopy[locale].footer
  const n = launchCopy[locale].nav
  const home = `/${locale}`
  const discord = discordUrl()

  return (
    <footer className="mt-auto border-t border-line bg-surface" data-print="hide">
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-12 lg:col-span-5">
          <Link href={home} aria-label={dict.common.homeLink} className="inline-flex items-center rounded-md">
            <BrandMark />
            <span className="text-lg font-semibold text-foreground">{dict.common.brandName}</span>
          </Link>
          <p className="mt-4 text-base font-medium text-foreground">{f.tagline}</p>
          <p className="mt-2 max-w-[48ch] text-sm text-muted-foreground">{f.fixio}</p>
        </div>

        <nav aria-label={f.product} className="md:col-span-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">{f.product}</h2>
          <ul className="mt-3">
            <li><Link href={`${home}#coverage`} className={linkClass}>{n.coverage}</Link></li>
            <li><Link href={`${home}#pricing`} className={linkClass}>{n.pricing}</Link></li>
            <li><Link href={`${home}/docs`} className={linkClass}>{n.docs}</Link></li>
            <li>
              <a href={links.console} className={linkClass}>{n.startFree}</a>
            </li>
          </ul>
        </nav>

        <nav aria-label={f.legal} className="md:col-span-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">{f.legal}</h2>
          <ul className="mt-3">
            <li><Link href={`${home}/terms`} className={linkClass}>{f.terms}</Link></li>
            <li><Link href={`${home}/privacy`} className={linkClass}>{f.privacy}</Link></li>
            <li><Link href={`${home}/acceptable-use`} className={linkClass}>{f.aup}</Link></li>
            <li><Link href={`${home}/cookies`} className={linkClass}>{f.cookies}</Link></li>
            <li><Link href={`${home}/dpa`} className={linkClass}>{f.dpa}</Link></li>
            <li>
              <CookieSettingsButton label={f.cookieSettings} className={`${linkClass} cursor-pointer text-start`} />
            </li>
          </ul>
        </nav>

        <div className="md:col-span-4 lg:col-span-3">
          <h2 className="text-sm font-semibold text-foreground">{f.resources}</h2>
          <ul className="mt-3">
            <li>
              <a href={links.github} rel="noopener" className={linkClass}>
                {n.github}
                <ArrowUpRightIcon aria-hidden className="size-3.5 rtl:-scale-x-100" />
              </a>
            </li>
            {discord ? (
              <li>
                <a href={discord} rel="noopener" className={linkClass}>
                  {f.discord}
                  <ArrowUpRightIcon aria-hidden className="size-3.5 rtl:-scale-x-100" />
                </a>
              </li>
            ) : null}
            <li>
              <a href={links.status} rel="noopener" className={linkClass}>
                {n.status}
                <ArrowUpRightIcon aria-hidden className="size-3.5 rtl:-scale-x-100" />
              </a>
            </li>
            <li>
              <a href={`mailto:${dict.links.support}`} className={`ltr-fragment ${linkClass}`}>
                {dict.links.support}
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
          © <span className="ltr-fragment">{year}</span> Fixio. {f.fixio} {f.rights}
        </p>
      </div>
    </footer>
  )
}
