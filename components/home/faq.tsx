"use client"

import { LinkSimpleIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react"
import { useEffect, useId, useState } from "react"

import { copyText } from "@/components/site/floating-controls"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format, type Dictionary } from "@/lib/i18n/dictionaries"
import { faqSlug, searchEntries } from "@/lib/search-index"

/** W19: filterable FAQ with deep links (#faq-N opens and scrolls to the question). */
export function Faq({ dict }: { dict: Dictionary }) {
  const f = dict.faq
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const inputId = useId()

  const items = f.items.map((item, i) => ({ ...item, slug: faqSlug(i) }))
  const matches = query.trim()
    ? new Set(
        searchEntries(
          items.map((item) => ({ kind: "faq" as const, title: item.question, text: item.answer, href: item.slug })),
          query,
          items.length
        ).map((hit) => hit.href)
      )
    : null
  const visible = matches ? items.filter((item) => matches.has(item.slug)) : items

  useEffect(() => {
    function openFromHash() {
      const slug = decodeURIComponent(window.location.hash.slice(1))
      if (!/^faq-\d+$/.test(slug)) return
      setQuery("")
      setOpen((current) => (current.includes(slug) ? current : [...current, slug]))
      requestAnimationFrame(() => {
        const item = document.getElementById(slug)
        item?.scrollIntoView({ block: "start" })
        item?.querySelector<HTMLElement>("[data-slot=accordion-trigger]")?.focus({ preventScroll: true })
      })
    }
    openFromHash()
    window.addEventListener("hashchange", openFromHash)
    return () => window.removeEventListener("hashchange", openFromHash)
  }, [])

  async function copyLink(slug: string) {
    const url = new URL(window.location.href)
    url.hash = slug
    setCopied((await copyText(url.href)) ? slug : null)
  }

  return (
    <section id="faq" aria-labelledby="faq-title" className="py-24 sm:py-28 lg:py-40">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="faq-title" className="headline">
              {f.title}
            </h2>
            <div className="mt-8 grid gap-2">
              <label htmlFor={inputId} className="text-sm font-medium text-foreground">
                {f.searchLabel}
              </label>
              <div className="relative">
                <MagnifyingGlassIcon aria-hidden className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id={inputId}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={f.searchPlaceholder}
                  className="h-12 w-full rounded-md border border-control/70 bg-card ps-11 pe-11 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label={f.reset}
                    className="absolute end-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-elevated hover:text-foreground"
                  >
                    <XIcon aria-hidden className="size-4" />
                  </button>
                ) : null}
              </div>
              <p role="status" className="text-sm text-muted-foreground">
                {format(f.count, { n: visible.length, total: items.length })}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {visible.length === 0 ? (
            <div className="rounded-lg border border-dashed border-control/60 px-6 py-12 text-center">
              <p className="text-base text-foreground">{format(f.empty, { q: query.trim() })}</p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 text-sm font-semibold text-link underline underline-offset-4"
              >
                {f.reset}
              </button>
            </div>
          ) : (
            <Accordion multiple keepMounted value={open} onValueChange={(value) => setOpen(value as string[])} className="border-t border-border">
              {items.map((item) => (
                <AccordionItem
                  key={item.slug}
                  id={item.slug}
                  value={item.slug}
                  hidden={!visible.includes(item)}
                  className="group/faq scroll-mt-28 border-b border-border"
                >
                  <AccordionTrigger className="gap-6 rounded-none py-7 text-lg leading-snug font-semibold text-foreground hover:text-link focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-xl **:data-[slot=accordion-trigger-icon]:mt-1 **:data-[slot=accordion-trigger-icon]:size-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-8">
                    <p className="max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem] rtl:leading-[1.9]">
                      {item.answer}
                    </p>
                    <button
                      type="button"
                      onClick={() => copyLink(item.slug)}
                      className="mt-4 inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-muted-foreground no-underline! transition-colors hover:text-foreground"
                    >
                      <LinkSimpleIcon aria-hidden className="size-4" />
                      {copied === item.slug ? f.linkCopied : f.copyLink}
                    </button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          <p role="status" className="sr-only">
            {copied ? f.linkCopied : ""}
          </p>
        </div>
      </div>
    </section>
  )
}
