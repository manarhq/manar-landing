"use client"

import { MoonIcon, SunIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import type { Dictionary } from "@/lib/i18n/dictionaries"

import type { ThemeMenu } from "./theme-menu"

/**
 * Light, Dark or System. The menu (Base UI and floating-ui) loads right after hydration, so it is
 * off the first-paint path; until then the same button renders. The pre-paint script in the
 * layout has already applied the theme, so nothing changes visually.
 */
export function ThemeToggle({ labels }: { labels: Dictionary["site"]["theme"] }) {
  const [Menu, setMenu] = useState<typeof ThemeMenu | null>(null)
  useEffect(() => {
    import("./theme-menu").then((m) => setMenu(() => m.ThemeMenu))
  }, [])
  if (Menu) return <Menu labels={labels} />
  return (
    <Button variant="ghost" size="icon" aria-label={labels.label} aria-haspopup="menu">
      <SunIcon aria-hidden className="dark:hidden" />
      <MoonIcon aria-hidden className="hidden dark:block" />
    </Button>
  )
}
