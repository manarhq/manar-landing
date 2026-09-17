import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

import { Brand } from "./brand"
import { LanguageSwitch } from "./language-switch"
import { MobileNav } from "./mobile-nav"
import { navItems } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = navItems(locale, dict)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="shell flex h-16 items-center gap-4 lg:h-[4.5rem]">
        <Brand locale={locale} name={dict.common.brandName} homeLabel={dict.common.homeLink} />

        <nav aria-label={dict.common.primaryNav} className="ms-6 hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1 sm:gap-1.5">
          <LanguageSwitch
            locale={locale}
            label={dict.common.languageSwitch}
            accessibleLabel={dict.common.languageSwitchLabel}
          />
          <ThemeToggle toDark={dict.common.themeToDark} toLight={dict.common.themeToLight} />
          <Link
            href={`/${locale}/demo`}
            className={cn(buttonVariants(), "ms-1.5 hidden sm:inline-flex")}
          >
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
