"use client"

import { TranslateIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { localeTag, otherLocale, type Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

/** Links to the same page in the other language. Theme persists via storage. */
export function LanguageSwitch({
  locale,
  label,
  accessibleLabel,
  className,
}: {
  locale: Locale
  label: string
  accessibleLabel: string
  className?: string
}) {
  const pathname = usePathname()
  const target = otherLocale(locale)
  const rest = pathname.replace(/^\/(en|ar)(?=\/|$)/, "")
  const href = `/${target}${rest}`

  return (
    <Link
      href={href}
      hrefLang={localeTag[target]}
      lang={localeTag[target]}
      aria-label={accessibleLabel}
      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 px-3", className)}
    >
      <TranslateIcon aria-hidden className="text-muted-foreground" />
      <span className={target === "ar" ? "font-[family-name:var(--font-plex-arabic)]" : ""}>
        {label}
      </span>
    </Link>
  )
}
