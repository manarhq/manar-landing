import Image from "next/image"
import Link from "next/link"

import type { Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

/**
 * The selected lighthouse mark (Concept B PNG, 160 × 168) with live wordmark text.
 * The image is decorative here because the adjacent text names the brand.
 */
export function BrandMark({ src, className, priority }: { src: string; className?: string; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt=""
      width={160}
      height={168}
      priority={priority}
      className={cn("h-8 w-auto object-contain", className)}
    />
  )
}

export function Brand({
  locale,
  name,
  homeLabel,
  logo,
  className,
}: {
  locale: Locale
  name: string
  homeLabel: string
  logo: string
  className?: string
}) {
  return (
    <Link
      href={`/${locale}`}
      aria-label={homeLabel}
      className={cn(
        "inline-flex items-center gap-2 rounded-md",
        className
      )}
    >
      <BrandMark src={logo} priority />
      <span className="text-lg leading-none font-semibold text-foreground rtl:text-xl">
        {name}
      </span>
    </Link>
  )
}
