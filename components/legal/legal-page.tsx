import { ArrowLeftIcon, CaretDownIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { LegalBlock, LegalDoc } from "@/lib/legal/types"
import type { LegalUi } from "@/lib/legal/ui"

import { PrintButton } from "./print-button"

const dateLocale: Record<Locale, string> = { en: "en-GB", ar: "ar-AE" }

export function LegalPage({ locale, dict, doc, ui }: { locale: Locale; dict: Dictionary; doc: LegalDoc; ui: LegalUi }) {
  // Parse as UTC so the stored calendar date never shifts with the server time zone.
  const updated = new Intl.DateTimeFormat(dateLocale[locale], { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${doc.updated}T00:00:00Z`)
  )

  const toc = (
    <ol className="space-y-1 text-[0.9375rem]">
      {doc.sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="inline-flex min-h-9 items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            {s.heading}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main id="main" tabIndex={-1} className="outline-none">
        <div className="shell pt-10 pb-20 sm:pt-14 lg:pt-20 lg:pb-28">
          <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
            <Link
              href={`/${locale}`}
              className="flex min-h-10 w-fit items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftIcon aria-hidden className="size-4 rtl:-scale-x-100" />
              {ui.backHome}
            </Link>
            <PrintButton label={ui.print} />
          </div>

          <header className="mt-8 max-w-[70ch]">
            <h1 className="headline">{doc.title}</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {ui.lastUpdated}: <time dateTime={doc.updated}>{updated}</time>
            </p>
          </header>

          <div role="note" className="mt-8 max-w-[70ch] rounded-lg border border-warning/40 bg-warning/10 p-5 text-[0.9375rem]">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <WarningCircleIcon aria-hidden className="size-5 shrink-0 text-warning" />
              {ui.draftTitle}
            </p>
            <p className="mt-2 leading-relaxed text-muted-foreground">{ui.draftBody}</p>
            {doc.placeholders.length > 0 ? (
              <>
                <p className="mt-3 font-medium text-foreground">{ui.pendingDetails}</p>
                <ul className="mt-2 list-disc space-y-1 ps-5 text-foreground">
                  {doc.placeholders.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <nav aria-label={ui.onThisPage} className="lg:col-span-3 print:hidden">
              <details className="rounded-lg border border-border bg-card p-4 lg:hidden">
                <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                  {ui.onThisPage}
                  <CaretDownIcon aria-hidden className="size-4 text-muted-foreground" />
                </summary>
                <div className="mt-3">{toc}</div>
              </details>
              <div className="hidden lg:sticky lg:top-28 lg:block">
                <p className="text-sm font-semibold text-foreground">{ui.onThisPage}</p>
                <div className="mt-3">{toc}</div>
              </div>
            </nav>

            <div className="min-w-0 max-w-[70ch] lg:col-span-9">
              {doc.sections.map((s) => (
                <section key={s.id} aria-labelledby={s.id} className="border-t border-border py-8 first:border-t-0 first:pt-0">
                  <h2 id={s.id} className="group text-xl font-semibold text-foreground sm:text-2xl">
                    {s.heading}
                    <a
                      href={`#${s.id}`}
                      aria-label={`${ui.sectionLink}: ${s.heading}`}
                      className="ms-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 print:hidden"
                    >
                      #
                    </a>
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground rtl:leading-[1.9]">
                    {s.blocks.map((b, i) => (
                      <Block key={i} block={b} label={`${ui.tableLabel}: ${s.heading}`} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </>
  )
}

function Block({ block, label }: { block: LegalBlock; label: string }) {
  if (typeof block === "string") return <p>{block}</p>
  if ("list" in block) {
    return (
      <ul className="list-disc space-y-2 ps-5 marker:text-control">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  return (
    <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[36rem] border-collapse text-start text-sm">
        <thead>
          <tr className="border-b border-border">
            {block.table.head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 text-start font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row[0]} className="border-b border-border last:border-b-0">
              {row.map((cell, ci) =>
                ci === 0 ? (
                  <th key={ci} scope="row" className="px-4 py-3 text-start align-top font-medium text-foreground">
                    {cell}
                  </th>
                ) : (
                  <td key={ci} className="px-4 py-3 align-top">
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
