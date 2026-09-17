"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useLayoutEffect, useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import { THEME_STORAGE_KEY } from "@/lib/site"

type Theme = "dark" | "light"

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

const readTheme = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light")

function readStored(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === "light" || stored === "dark" ? stored : null
  } catch {
    return null
  }
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

export function ThemeToggle({ toDark, toLight }: { toDark: string; toLight: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme)

  // React resets <html> attributes on the development Strict Mode remount; re-apply the stored choice.
  useLayoutEffect(() => {
    const stored = readStored()
    if (stored) apply(stored)
  }, [])

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark"
    apply(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage unavailable: the change still applies for this page view.
    }
  }

  const label = theme === "dark" ? toLight : toDark

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={label} title={label}>
      {theme === "dark" ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
    </Button>
  )
}
