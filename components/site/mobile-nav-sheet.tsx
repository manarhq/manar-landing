"use client"

import { ListIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

import type { NavItem } from "./nav-items"

export function MobileNavSheet({
  locale,
  items,
  labels,
  startHref,
}: {
  locale: Locale
  items: NavItem[]
  labels: { open: string; close: string; title: string; startFree: string; navLabel: string }
  startHref: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [lastPath, setLastPath] = useState(pathname)

  // W05: close on route change (render-time reset, no effect needed).
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label={labels.open} className="lg:hidden" />}>
        <ListIcon aria-hidden />
      </SheetTrigger>
      <SheetContent
        side={locale === "ar" ? "left" : "right"}
        closeLabel={labels.close}
        className="w-[min(88vw,22rem)] gap-0 border-line bg-page p-0"
      >
        <div className="border-b border-line px-4 pt-4 pb-4">
          <SheetTitle className="text-base font-semibold">{labels.title}</SheetTitle>
          <SheetDescription className="sr-only">{labels.navLabel}</SheetDescription>
        </div>
        <nav aria-label={labels.navLabel} className="flex flex-col p-2">
          {items.map((item) => {
            const className =
              "flex min-h-11 items-center rounded-md px-3 text-lg font-medium text-foreground transition-colors duration-[120ms] hover:bg-subtle"
            return item.external ? (
              <a key={item.href} href={item.href} rel="noopener" className={className}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={className}>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-line p-4">
          <a href={startHref} className={cn(buttonVariants({ size: "lg" }), "w-full")}>
            {labels.startFree}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
