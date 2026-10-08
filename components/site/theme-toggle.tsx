"use client"

import { Menu } from "@base-ui/react/menu"
import { CheckIcon, DesktopIcon, MoonIcon, SunIcon } from "@phosphor-icons/react"
import { useEffect, useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { THEME_STORAGE_KEY } from "@/lib/site"

type Preference = "system" | "light" | "dark"

const EVENT = "manar:theme"
const media = () => window.matchMedia("(prefers-color-scheme: dark)")

function readPreference(): Preference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === "light" || stored === "dark" ? stored : "system"
  } catch {
    return "system"
  }
}

function apply(preference: Preference) {
  const dark = preference === "dark" || (preference === "system" && media().matches)
  document.documentElement.classList.toggle("dark", dark)
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

/** W01: Light, Dark, or System (the default). The pre-paint script in the layout prevents a flash. */
export function ThemeToggle({ labels }: { labels: Dictionary["site"]["theme"] }) {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as Preference)

  // Re-apply on mount (React resets <html> attributes on remount) and follow the OS while on System.
  useEffect(() => {
    apply(preference)
    if (preference !== "system") return
    const query = media()
    const onChange = () => apply("system")
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [preference])

  function choose(next: Preference) {
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY)
      else localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage unavailable: the change still applies to this page view.
    }
    apply(next)
    window.dispatchEvent(new Event(EVENT))
  }

  const options = [
    { value: "system", label: labels.system, Icon: DesktopIcon },
    { value: "light", label: labels.light, Icon: SunIcon },
    { value: "dark", label: labels.dark, Icon: MoonIcon },
  ] as const

  return (
    <Menu.Root>
      <Menu.Trigger
        render={<Button variant="ghost" size="icon" />}
        aria-label={`${labels.label}: ${options.find((o) => o.value === preference)!.label}`}
      >
        <SunIcon aria-hidden className="dark:hidden" />
        <MoonIcon aria-hidden className="hidden dark:block" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-(--z-overlay)">
          <Menu.Popup className="min-w-40 origin-(--transform-origin) rounded-md border border-line bg-popover p-1 text-popover-foreground shadow-pop transition-[opacity,translate] duration-[160ms] outline-none data-ending-style:translate-y-1 data-ending-style:opacity-0 data-starting-style:translate-y-1 data-starting-style:opacity-0">
            <Menu.RadioGroup value={preference} onValueChange={(value) => choose(value as Preference)} aria-label={labels.label}>
              {options.map(({ value, label, Icon }) => (
                <Menu.RadioItem
                  key={value}
                  value={value}
                  closeOnClick
                  className="flex min-h-9 cursor-default items-center gap-2 rounded-sm px-2 text-sm text-foreground outline-none select-none data-highlighted:bg-subtle"
                >
                  <Icon aria-hidden className="size-4 text-muted-foreground" />
                  <span className="flex-1">{label}</span>
                  <Menu.RadioItemIndicator>
                    <CheckIcon aria-hidden className="size-4 text-foreground" />
                  </Menu.RadioItemIndicator>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
