import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Dictionary } from "@/lib/i18n/dictionaries"

import { Notice } from "./notice"

/** Booking is off or unreachable: send people to the written request form. Never invented times. */
export function Unavailable({ t, href }: { t: Dictionary["meet"]["unavailable"]; href: string }) {
  return (
    <div className="grid max-w-[60ch] gap-4">
      <Notice tone="neutral" title={t.title}>
        {t.body}
      </Notice>
      <Link href={href} className={buttonVariants({ size: "lg", className: "justify-self-start" })}>
        {t.cta}
      </Link>
    </div>
  )
}
