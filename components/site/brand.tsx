import Link from "next/link"

import type { Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

/** The Midnight mark: a blue square with an orange dot beside it. Decorative; the wordmark names the brand. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-3 shrink-0 rounded-[3px] bg-brand me-5 shadow-[14px_0_0_-3px_var(--orange)] rtl:shadow-[-14px_0_0_-3px_var(--orange)]", className)}
    />
  )
}

export function Brand({
  locale,
  name,
  homeLabel,
  className,
}: {
  locale: Locale
  name: string
  homeLabel: string
  className?: string
}) {
  return (
    <Link href={`/${locale}`} aria-label={homeLabel} className={cn("inline-flex items-center rounded-md", className)}>
      <BrandMark />
      <span className="text-lg leading-none font-semibold text-foreground rtl:text-xl">{name}</span>
    </Link>
  )
}
