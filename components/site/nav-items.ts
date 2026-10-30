import { launchCopy } from "@/lib/launch/copy"
import { links } from "@/lib/launch/links"
import type { Locale } from "@/lib/i18n/config"

export type NavItem = { href: string; label: string; external?: boolean }

/** Header and footer links: Pricing and Coverage are sections on the home page, Docs is its own route. */
export function navItems(locale: Locale): NavItem[] {
  const n = launchCopy[locale].nav
  return [
    { href: `/${locale}#coverage`, label: n.coverage },
    { href: `/${locale}#pricing`, label: n.pricing },
    { href: `/${locale}/docs`, label: n.docs },
    { href: links.github, label: n.github, external: true },
  ]
}
