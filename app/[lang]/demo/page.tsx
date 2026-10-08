import { ArrowLeftIcon } from "@phosphor-icons/react/ssr"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DemoForm } from "@/components/demo/demo-form"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { isLocale } from "@/lib/i18n/config"
import { getContent } from "@/lib/content/load"
import { pageMetadata } from "@/lib/site"

export async function generateMetadata({ params }: PageProps<"/[lang]/demo">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const dict = await getContent(lang)
  return pageMetadata({
    locale: lang,
    path: "/demo",
    title: dict.meta.demoTitle,
    description: dict.meta.demoDescription,
    siteName: dict.meta.siteName,
    image: dict.images.og,
  })
}

export default async function DemoPage({ params }: PageProps<"/[lang]/demo">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getContent(lang)
  const d = dict.demo

  return (
    <>
      <SiteHeader locale={lang} dict={dict} />
      <main id="main" tabIndex={-1} className="outline-none">
        <div className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Link
              href={`/${lang}`}
              className="inline-flex min-h-9 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
            >
              <ArrowLeftIcon aria-hidden className="size-4 rtl:-scale-x-100" />
              {d.back}
            </Link>
            <h1 className="mt-8 max-w-[16ch] text-4xl font-semibold tracking-tight text-balance text-foreground md:text-5xl">
              {d.title}
            </h1>
            <p className="mt-6 max-w-[44ch] text-lg text-muted-foreground">{d.body}</p>
            <p className="mt-8 text-sm text-muted-foreground">
              {d.altContact}{" "}
              <a
                href={`mailto:${dict.links.email}`}
                className="ltr-fragment font-medium text-foreground underline underline-offset-4"
              >
                {dict.links.email}
              </a>
            </p>
          </div>

          <div className="lg:col-span-7">
            <DemoForm locale={lang} t={d.form} email={dict.links.email} />
          </div>
        </div>
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  )
}
