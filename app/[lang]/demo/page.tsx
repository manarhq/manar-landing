import { ArrowLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DemoForm } from "@/components/demo/demo-form"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { CONTACT_EMAIL, pageMetadata } from "@/lib/site"

export async function generateMetadata({ params }: PageProps<"/[lang]/demo">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const dict = getDictionary(lang)
  return pageMetadata({
    locale: lang,
    path: "/demo",
    title: dict.meta.demoTitle,
    description: dict.meta.demoDescription,
    siteName: dict.meta.siteName,
  })
}

export default async function DemoPage({ params }: PageProps<"/[lang]/demo">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = getDictionary(lang)
  const d = dict.demo

  return (
    <>
      <SiteHeader locale={lang} dict={dict} />
      <main id="main" tabIndex={-1} className="relative isolate overflow-hidden outline-none">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px]">
          <div className="blueprint absolute inset-0 opacity-50" />
          <div className="beam absolute top-0 h-full w-[1300px] ltr:-translate-x-1/2 rtl:translate-x-1/2" style={{ insetInlineStart: "30%" }} />
        </div>

        <div className="shell grid gap-12 pt-10 pb-20 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-28">
          <div className="lg:col-span-5">
            <Link
              href={`/${lang}`}
              className="flex min-h-10 w-fit items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftIcon aria-hidden className="size-4 rtl:-scale-x-100" />
              {d.back}
            </Link>
            <p className="eyebrow mt-8">{d.eyebrow}</p>
            <h1 className="headline mt-5 lg:text-[3.25rem]">{d.title}</h1>
            <p className="lede mt-5">{d.body}</p>

            <h2 className="mt-12 text-sm font-semibold text-foreground">{d.expectTitle}</h2>
            <ol className="relative mt-5 grid gap-6">
              <span aria-hidden className="absolute start-[0.9375rem] top-4 bottom-4 w-px bg-border" />
              {d.expect.map((item, i) => (
                <li key={item.title} className="relative grid grid-cols-[2rem_1fr] gap-x-4">
                  <span
                    aria-hidden
                    className="ltr-fragment relative z-10 flex size-8 items-center justify-center rounded-md border border-border bg-background font-mono text-xs text-primary"
                  >
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-10 text-[0.9375rem] text-muted-foreground">
              {d.altContact}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="ltr-fragment font-semibold text-link underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:ps-6 xl:col-span-6 xl:col-start-7">
            <DemoForm locale={lang} t={d.form} />
          </div>
        </div>
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  )
}
