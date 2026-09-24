import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

import { Brand } from "./brand"
import { LanguageSwitch } from "./language-switch"
import { MobileNav } from "./mobile-nav"
import { navItems } from "./nav-items"
import { SearchButton } from "./search-button"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = navItems(locale, dict)

  return (
    <header className="header-surface sticky top-0 z-(--z-header) border-b">
      <div className="shell flex h-16 items-center gap-3 lg:h-[4.25rem]">
        <Brand locale={locale} name={dict.common.brandName} homeLabel={dict.common.homeLink} />

        <nav aria-label={dict.common.primaryNav} className="ms-4 hidden lg:block xl:ms-8">
          <ul className="flex items-center">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex h-10 items-center rounded-full px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <SearchButton label={dict.site.search.open} />
          <LanguageSwitch
            locale={locale}
            label={dict.common.languageSwitch}
            accessibleLabel={dict.common.languageSwitchLabel}
          />
          <ThemeToggle labels={dict.site.theme} />
          <Link href={`/${locale}/demo`} className={cn(buttonVariants(), "ms-2 hidden sm:inline-flex")}>
            {dict.common.bookDemo}
          </Link>
          <MobileNav
            locale={locale}
            items={items}
            labels={{
              open: dict.common.openMenu,
              close: dict.common.closeMenu,
              title: dict.common.menuTitle,
              bookDemo: dict.common.bookDemo,
              endorsement: dict.common.endorsement,
              navLabel: dict.common.primaryNav,
            }}
          />
        </div>
      </div>
    </header>
  )
}
