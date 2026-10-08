"use client"

import { ListIcon } from "@phosphor-icons/react"
import { useEffect, useState, type ComponentProps } from "react"

import { Button } from "@/components/ui/button"

import type { MobileNavSheet } from "./mobile-nav-sheet"

type Props = ComponentProps<typeof MobileNavSheet>

/** The menu sheet loads right after hydration; until then the same trigger button renders. */
export function MobileNav(props: Props) {
  const [Sheet, setSheet] = useState<typeof MobileNavSheet | null>(null)
  useEffect(() => {
    import("./mobile-nav-sheet").then((m) => setSheet(() => m.MobileNavSheet))
  }, [])
  if (Sheet) return <Sheet {...props} />
  return (
    <Button variant="ghost" size="icon" aria-label={props.labels.open} className="lg:hidden">
      <ListIcon aria-hidden />
    </Button>
  )
}
