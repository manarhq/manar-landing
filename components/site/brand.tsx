import Image from "next/image"
import Link from "next/link"

import type { Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

/**
 * The selected lighthouse mark (Concept B PNG, 160 × 168) with live wordmark text.
 * The image is decorative here because the adjacent text names the brand.
 */
export function BrandMark({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/manar-lighthouse.png"
      alt=""
      width={160}
      height={168}
      priority={priority}
      className={cn("h-9 w-auto object-contain", className)}
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
    <Link
      href={`/${locale}`}
      aria-label={homeLabel}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md outline-offset-4",
        className
      )}
    >
      <BrandMark priority />
      <span className="text-[1.1875rem] leading-none font-bold tracking-[-0.02em] text-foreground rtl:text-[1.3125rem] rtl:tracking-normal">
        {name}
      </span>
    </Link>
  )
}
