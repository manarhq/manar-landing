import {
  ClipboardTextIcon,
  FileMagnifyingGlassIcon,
  PulseIcon,
  ShieldCheckIcon,
  StackIcon,
  UserCheckIcon,
} from "@phosphor-icons/react/ssr"
import type { Icon } from "@phosphor-icons/react"

import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

import { Audiences } from "./audiences"
import { StatusPill, riskTone } from "./workspace/status"

const icons: Record<string, Icon> = {
  inventory: StackIcon,
  oversight: PulseIcon,
  policy: ShieldCheckIcon,
  approval: UserCheckIcon,
  risk: ClipboardTextIcon,
  evidence: FileMagnifyingGlassIcon,
}

// Bento placement per capability: sizes vary so the grid has rhythm, not a row of equal cards.
const layout: Record<string, string> = {
  inventory: "lg:col-span-7 lg:row-span-2",
  oversight: "lg:col-span-5",
  policy: "lg:col-span-5",
  approval: "lg:col-span-4",
  risk: "lg:col-span-3",
  evidence: "lg:col-span-5",
}

export function Capabilities({ dict }: { dict: Dictionary }) {
  const c = dict.capabilities
  const cells = c.groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.name })))
  const systems = dict.workspace.inventory.systems
  const events = [0, 2, 4].map((i) => dict.workspace.evidence.events[i])

  return (
    <section id="platform" aria-labelledby="platform-title" className="relative overflow-x-clip py-24 sm:py-28 lg:py-40">
      <div className="shell">
        <div className="max-w-3xl">
          <h2 id="platform-title" className="headline">
            {c.title}
          </h2>
          <p className="lede mt-5 max-w-[48ch]">{c.body}</p>
        </div>

        <ul className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          {cells.map((cell) => {
            const Glyph = icons[cell.icon]
            return (
              <li
                key={cell.icon}
                className={cn(
                  "reveal relative isolate flex flex-col overflow-hidden rounded-lg border border-border p-6 sm:p-8",
                  layout[cell.icon],
                  cell.icon === "approval" ? "border-primary/40 bg-primary/10" : "bg-card"
                )}
              >
                {cell.icon === "inventory" ? (
                  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                    <div className="beam absolute -top-10 start-[70%] h-[140%] w-[60rem] -translate-x-1/2 opacity-80 rtl:translate-x-1/2" />
                  </div>
                ) : null}
                {cell.icon === "oversight" ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(var(--divider)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to_top,black,transparent_75%)]"
                  />
                ) : null}

                <div className="flex items-center gap-3">
                  <Glyph aria-hidden className="size-6 text-link" />
                  <span className="text-sm text-muted-foreground">{cell.group}</span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-foreground rtl:tracking-normal">{cell.title}</h3>
                <p className="mt-2 max-w-[40ch] text-base leading-relaxed text-muted-foreground">{cell.body}</p>

                {cell.icon === "inventory" ? (
                  <ul aria-label={dict.workspace.tabs.inventory} className="mt-auto grid gap-2 pt-10 sm:grid-cols-2">
                    {systems.map((system) => (
                      <li
                        key={system.id}
                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/70 px-4 py-3 backdrop-blur-sm"
                      >
                        <span className="truncate text-sm font-medium text-foreground">{system.name}</span>
                        <StatusPill tone={riskTone[system.risk]}>{dict.workspace.risk[system.risk as keyof typeof dict.workspace.risk]}</StatusPill>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {cell.icon === "evidence" ? (
                  <ol aria-label={dict.workspace.evidence.timelineLabel} className="mt-auto flex gap-4 overflow-hidden pt-8">
                    {events.map((event) => (
                      <li key={event.title} className="min-w-0 flex-1 border-t-2 border-primary/60 pt-2">
                        <span className="ltr-fragment block font-mono text-xs text-muted-foreground">{event.time}</span>
                        <span className="mt-0.5 block truncate text-xs font-medium text-foreground">{event.title}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </li>
            )
          })}
        </ul>

        <Audiences title={c.audienceTitle} audiences={c.audiences} />
      </div>
    </section>
  )
}
