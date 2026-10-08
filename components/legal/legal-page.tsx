import { ArrowLeftIcon, CaretDownIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { LegalBlock, LegalDoc, SiteContent } from "@/lib/content/schema"

import { PrintButton } from "./print-button"

const dateLocale: Record<Locale, string> = { en: "en-GB", ar: "ar-AE" }

export function LegalPage({ locale, dict, doc, ui }: { locale: Locale; dict: Dictionary; doc: LegalDoc; ui: SiteContent["legal"]["ui"] }) {
  // Parse as UTC so the stored calendar date never shifts with the server time zone.
  const updated = new Intl.DateTimeFormat(dateLocale[locale], { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${doc.updated}T00:00:00Z`)
  )

  const toc = (
    <ol className="text-sm">
      {doc.sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="inline-flex min-h-9 items-center text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
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
        <div className="shell py-16 md:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
            <Link
              href={`/${locale}`}
              className="inline-flex min-h-9 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
            >
              <ArrowLeftIcon aria-hidden className="size-4 rtl:-scale-x-100" />
              {ui.backHome}
            </Link>
            <PrintButton label={ui.print} />
          </div>

          <header className="mt-8 max-w-[65ch]">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{doc.title}</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {ui.lastUpdated}: <time dateTime={doc.updated}>{updated}</time>
            </p>
          </header>

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <nav aria-label={ui.onThisPage} className="lg:col-span-3 print:hidden">
              <details className="rounded-md border border-line bg-surface p-4 lg:hidden">
                <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                  {ui.onThisPage}
                  <CaretDownIcon aria-hidden className="size-4 text-muted-foreground" />
                </summary>
                <div className="mt-3">{toc}</div>
              </details>
              <div className="hidden lg:sticky lg:top-24 lg:block">
                <p className="text-sm font-semibold text-foreground">{ui.onThisPage}</p>
                <div className="mt-3">{toc}</div>
              </div>
            </nav>

            <div className="max-w-[65ch] min-w-0 lg:col-span-9">
              {doc.sections.map((s) => (
                <section key={s.id} aria-labelledby={s.id} className="border-t border-line py-8 first:border-t-0 first:pt-0">
                  <h2 id={s.id} className="group scroll-mt-24 text-2xl font-semibold text-foreground">
                    {s.heading}
                    <a
                      href={`#${s.id}`}
                      aria-label={`${ui.sectionLink}: ${s.heading}`}
                      className="ms-2 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100 print:hidden"
                    >
                      #
                    </a>
                  </h2>
                  <div className="mt-4 space-y-4 text-base text-muted-foreground">
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
      <ul className="list-disc space-y-2 ps-6 marker:text-line-strong">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  return (
    <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto rounded-md border border-line bg-surface">
      <table className="w-full min-w-[36rem] border-collapse text-start text-sm">
        <thead>
          <tr className="border-b border-line-strong">
            {block.table.head.map((h) => (
              <th key={h} scope="col" className="px-3 py-2 text-start font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row[0]} className="border-b border-line last:border-b-0">
              {row.map((cell, ci) =>
                ci === 0 ? (
                  <th key={ci} scope="row" className="px-3 py-2 text-start align-top font-medium text-foreground">
                    {cell}
                  </th>
                ) : (
                  <td key={ci} className="px-3 py-2 align-top">
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
