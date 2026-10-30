import Link from "next/link"
import type { ReactNode } from "react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { docSlugs, launchCopy, type DocSlug } from "@/lib/launch/copy"
import { cn } from "@/lib/utils"

/** Header, a docs menu, and the page body. `current` is null on the docs index. */
export function DocsShell({
  locale,
  dict,
  current,
  title,
  children,
}: {
  locale: Locale
  dict: Dictionary
  current: DocSlug | null
  title: string
  children: ReactNode
}) {
  const d = launchCopy[locale].docs
  const i = current ? docSlugs.indexOf(current) : -1
  const next = i >= 0 ? docSlugs[i + 1] : undefined

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main id="main" tabIndex={-1} className="outline-none">
        <div className="shell grid gap-10 py-12 md:py-16 lg:grid-cols-12">
          <nav aria-label={d.menu} className="lg:col-span-3">
            <p className="text-sm font-semibold text-foreground">
              <Link href={`/${locale}/docs`}>{d.menu}</Link>
            </p>
            <ul className="mt-3 lg:sticky lg:top-24">
              {docSlugs.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${locale}/docs/${slug}`}
                    aria-current={slug === current ? "page" : undefined}
                    className={cn(
                      "flex min-h-9 items-center text-sm transition-colors duration-[120ms] hover:text-foreground",
                      slug === current ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {d.pages[slug].title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <article className="max-w-[72ch] min-w-0 lg:col-span-9">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
            <div className="mt-6">{children}</div>
            {current ? <p className="mt-12 text-sm text-muted-foreground">{d.updated}</p> : null}
            {next ? (
              <p className="mt-6 border-t border-line pt-6 text-sm">
                <Link href={`/${locale}/docs/${next}`} className="font-medium text-foreground underline underline-offset-4">
                  {d.next}: {d.pages[next].title}
                </Link>
              </p>
            ) : null}
          </article>
        </div>
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </>
  )
}
