import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { launchCopy } from "@/lib/launch/copy"
import { links } from "@/lib/launch/links"
import { cn } from "@/lib/utils"

import { Brand } from "./brand"
import { LanguageSwitch } from "./language-switch"
import { MobileNav } from "./mobile-nav"
import { navItems } from "./nav-items"
import { SearchButton } from "./search-button"
import { ThemeToggle } from "./theme-toggle"

const navLink =
  "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-[120ms] hover:bg-subtle hover:text-foreground"

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = navItems(locale)
  const n = launchCopy[locale].nav

  return (
    <header className="sticky top-0 z-(--z-header) border-b border-line bg-page">
      <div className="shell flex h-16 items-center gap-4">
        <Brand locale={locale} name={dict.common.brandName} homeLabel={dict.common.homeLink} />

        <nav aria-label={dict.common.primaryNav} className="ms-8 hidden lg:block">
          <ul className="flex items-center">
            {items.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href} className={navLink} rel="noopener">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className={navLink}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <SearchButton label={dict.site.search.open} />
          <LanguageSwitch
            locale={locale}
            label={dict.common.languageSwitch}
            accessibleLabel={dict.common.languageSwitchLabel}
          />
          <ThemeToggle labels={dict.site.theme} />
          <a href={links.console} className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
            {n.signIn}
          </a>
          <a href={links.console} className={cn(buttonVariants(), "hidden sm:inline-flex")}>
            {n.startFree}
          </a>
          <MobileNav
            locale={locale}
            startHref={links.console}
            items={[...items, { href: links.console, label: n.signIn, external: true }]}
            labels={{
              open: dict.common.openMenu,
              close: dict.common.closeMenu,
              title: dict.common.menuTitle,
              startFree: n.startFree,
              navLabel: dict.common.primaryNav,
            }}
          />
        </div>
      </div>
    </header>
  )
}
