import {
  ActivityIcon,
  ClipboardListIcon,
  FileCheckIcon,
  LayersIcon,
  ShieldCheckIcon,
  UserRoundCheckIcon,
  type LucideIcon,
} from "lucide-react"

import type { Dictionary } from "@/lib/i18n/dictionaries"

const icons: Record<string, LucideIcon> = {
  inventory: LayersIcon,
  oversight: ActivityIcon,
  policy: ShieldCheckIcon,
  approval: UserRoundCheckIcon,
  risk: ClipboardListIcon,
  evidence: FileCheckIcon,
}

export function Capabilities({ dict }: { dict: Dictionary }) {
  const c = dict.capabilities

  return (
    <section
      id="platform"
      aria-labelledby="platform-title"
      className="relative border-y border-border bg-card/35 py-20 sm:py-24 lg:py-32"
    >
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 id="platform-title" className="headline mt-5">
              {c.title}
            </h2>
          </div>
          <p className="lede lg:col-span-4 lg:col-start-9">{c.body}</p>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-xl border border-border bg-background lg:mt-16 lg:grid-cols-3">
          {c.groups.map((group, gi) => (
            <section
              key={group.name}
              aria-labelledby={`cap-group-${gi}`}
              className="border-border not-last:border-b lg:not-last:border-e lg:not-last:border-b-0"
            >
              <header className="relative border-b border-border px-6 pt-7 pb-6 sm:px-8">
                <span aria-hidden className="absolute start-0 top-0 h-full w-px bg-gradient-to-b from-primary to-transparent lg:hidden" />
                <h3 id={`cap-group-${gi}`} className="text-sm font-semibold text-link">
                  {group.name}
                </h3>
                <p className="mt-2 text-xl leading-snug font-semibold text-foreground">{group.question}</p>
              </header>
              <ul className="divide-y divide-border">
                {group.items.map((item) => {
                  const Icon = icons[item.icon]
                  return (
                    <li key={item.title} className="flex gap-4 px-6 py-6 sm:px-8 sm:py-7">
                      <span
                        aria-hidden
                        className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-primary"
                      >
                        <Icon className="size-[1.125rem]" />
                      </span>
                      <div>
                        <h4 className="text-base font-semibold text-foreground sm:text-[1.0625rem]">{item.title}</h4>
                        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted-foreground">{item.body}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-20 lg:mt-24">
          <h3 className="text-sm font-semibold text-muted-foreground">{c.audienceTitle}</h3>
          <ul className="mt-6 grid gap-10 md:grid-cols-3 md:gap-8">
            {c.audiences.map((a) => (
              <li key={a.role} className="border-t border-control/50 pt-6">
                <p className="text-sm font-semibold text-link">{a.role}</p>
                <p className="mt-2 text-xl leading-snug font-semibold text-foreground">{a.title}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
