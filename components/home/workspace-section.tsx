import type { Dictionary } from "@/lib/i18n/dictionaries"

import { WorkspacePreview } from "./workspace/workspace-preview"

export function WorkspaceSection({ dict }: { dict: Dictionary }) {
  const w = dict.workspace

  return (
    <section
      id="workspace"
      aria-labelledby="workspace-title"
      className="relative isolate overflow-hidden border-y border-border bg-card/35 py-20 sm:py-24 lg:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow absolute -top-40 left-1/2 h-96 w-[900px] -translate-x-1/2 opacity-60" />
      </div>
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">{w.eyebrow}</p>
            <h2 id="workspace-title" className="headline mt-5">
              {w.title}
            </h2>
            <p className="lede mt-5">{w.body}</p>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground lg:text-end">{w.note}</p>
        </div>

        <div className="mt-10 lg:mt-14">
          <WorkspacePreview w={w} brandName={dict.common.brandName} />
        </div>
      </div>
    </section>
  )
}
