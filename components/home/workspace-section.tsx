import type { Dictionary } from "@/lib/i18n/dictionaries"

import { WorkspacePreview } from "./workspace/workspace-preview"

/** Full-bleed product moment: a working, interactive preview rather than a screenshot. */
export function WorkspaceSection({ dict }: { dict: Dictionary }) {
  const w = dict.workspace

  return (
    <section id="workspace" aria-labelledby="workspace-title" className="relative isolate overflow-x-clip pb-24 sm:pb-28 lg:pb-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow absolute top-24 left-1/2 h-[36rem] w-[min(70rem,120vw)] -translate-x-1/2 opacity-70" />
      </div>
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="workspace-title" className="headline">
            {w.title}
          </h2>
          <p className="lede mx-auto mt-5 max-w-[48ch]">{w.body}</p>
        </div>

        <div className="tilt-in mt-14 lg:mt-20">
          <WorkspacePreview w={w} brandName={dict.common.brandName} />
        </div>
        <p className="mt-5 text-center text-sm text-muted-foreground">{w.note}</p>
      </div>
    </section>
  )
}
