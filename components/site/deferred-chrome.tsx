"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

/**
 * Overlays that nobody needs for the first paint: the Ctrl+K search and the floating contact and
 * back-to-top buttons. They load after hydration, which keeps their code off the critical path.
 */
const SearchDialog = dynamic(() => import("./search-dialog").then((m) => m.SearchDialog), { ssr: false })
const FloatingControls = dynamic(() => import("./floating-controls").then((m) => m.FloatingControls), { ssr: false })

export function DeferredChrome({
  search,
  floating,
}: {
  search: ComponentProps<typeof SearchDialog>
  floating: ComponentProps<typeof FloatingControls>
}) {
  return (
    <>
      <SearchDialog {...search} />
      <FloatingControls {...floating} />
    </>
  )
}
