import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"

export type NavItem = { href: string; label: string }

/** Section anchors on the localized homepage. Absolute paths so they also work from /demo. */
export function navItems(locale: Locale, dict: Dictionary): NavItem[] {
  return [
    { href: `/${locale}#platform`, label: dict.nav.platform },
    { href: `/${locale}#how-it-works`, label: dict.nav.howItWorks },
    { href: `/${locale}#deployment`, label: dict.nav.deployment },
    { href: `/${locale}#faq`, label: dict.nav.faq },
  ]
}
