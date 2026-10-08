"use client"

import { Dialog } from "@base-ui/react/dialog"
import { ArrowUpRightIcon, FileTextIcon, HashIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useDeferredValue, useEffect, useId, useState } from "react"

import type { Dictionary } from "@/lib/i18n/dictionaries"
import { format } from "@/lib/i18n/format"
import { searchEntries, type SearchEntry } from "@/lib/search-index"
import { cn } from "@/lib/utils"

import { OPEN_SEARCH_EVENT } from "./events"

const kindIcon = { section: HashIcon, page: FileTextIcon }

/** W03: Cmd+K / Ctrl+K site search over real page, section, and FAQ content. */
export function SearchDialog({ entries, labels }: { entries: SearchEntry[]; labels: Dictionary["site"]["search"] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const deferred = useDeferredValue(query)
  const results = searchEntries(entries, deferred)
  const listId = useId()

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener("keydown", onKey)
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen)
    }
  }, [])

  function go(entry: SearchEntry) {
    setOpen(false)
    const [path, hash] = entry.href.split("#")
    // Same-page anchors go through location.hash so hashchange listeners (the FAQ) react.
    if (hash && path === window.location.pathname) window.location.hash = hash
    else router.push(entry.href)
  }

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((i) => (i + step + results.length) % results.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      go(results[Math.min(active, results.length - 1)])
    }
  }

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0))

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setQuery("")
          setActive(0)
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-(--z-overlay) bg-(--scrim) transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          className="fixed inset-x-4 top-[max(1rem,10vh)] z-(--z-overlay) mx-auto flex max-h-[min(34rem,80dvh)] max-w-xl flex-col overflow-hidden rounded-md border border-line bg-popover text-popover-foreground shadow-pop transition-[opacity,translate] duration-[160ms] data-ending-style:translate-y-1 data-ending-style:opacity-0 data-starting-style:translate-y-1 data-starting-style:opacity-0"
        >
          <Dialog.Title className="sr-only">{labels.title}</Dialog.Title>
          <Dialog.Description className="sr-only">{labels.hint}</Dialog.Description>
          <div className="flex items-center gap-3 border-b border-line px-4">
            <MagnifyingGlassIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              role="combobox"
              aria-label={labels.label}
              aria-expanded={results.length > 0}
              aria-controls={listId}
              aria-activedescendant={results.length ? `${listId}-${activeIndex}` : undefined}
              aria-autocomplete="list"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={onInputKey}
              placeholder={labels.placeholder}
              className="h-14 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Dialog.Close
              aria-label={labels.close}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-[120ms] hover:bg-subtle hover:text-foreground"
            >
              <XIcon aria-hidden className="size-4" />
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {deferred.trim() && results.length === 0 ? (
              <p role="status" className="px-3 py-8 text-center text-sm text-muted-foreground">
                {format(labels.empty, { q: deferred.trim() })}
              </p>
            ) : null}
            {!deferred.trim() ? <p className="px-3 py-6 text-sm text-muted-foreground">{labels.hint}</p> : null}
            <ul id={listId} role="listbox" aria-label={labels.label} className={cn(!results.length && "hidden")}>
              {results.map((entry, i) => {
                const Icon = kindIcon[entry.kind]
                return (
                  <li
                    key={entry.href}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onPointerMove={() => setActive(i)}
                    onClick={() => go(entry)}
                    className="group flex cursor-pointer items-start gap-3 rounded-md px-3 py-3 aria-selected:bg-subtle"
                  >
                    <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground group-aria-selected:text-foreground" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-medium text-foreground">{entry.title}</span>
                      <span className="mt-0.5 block truncate text-sm text-muted-foreground">{entry.text}</span>
                    </span>
                    <span className="mt-0.5 shrink-0 text-xs text-muted-foreground">{labels.groups[entry.kind]}</span>
                    <ArrowUpRightIcon aria-hidden className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 group-aria-selected:opacity-100 rtl:-scale-x-100" />
                  </li>
                )
              })}
            </ul>
            <p aria-live="polite" className="sr-only">
              {deferred.trim() && results.length ? format(labels.results, { n: results.length }) : ""}
            </p>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
