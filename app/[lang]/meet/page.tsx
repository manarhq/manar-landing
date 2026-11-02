import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { MeetFlow, MeetSkeleton } from "@/components/meet/meet-flow"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { Unavailable } from "@/components/meet/unavailable"
import { getContent, siteApiOrigin } from "@/lib/content/load"
import { isLocale } from "@/lib/i18n/config"
import { pageMetadata, requestHref } from "@/lib/site"

export async function generateMetadata({ params }: PageProps<"/[lang]/meet">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const dict = await getContent(lang)
  return pageMetadata({
    locale: lang,
    path: "/meet",
    title: dict.meet.metaTitle,
    description: dict.meet.metaDescription,
    siteName: dict.meta.siteName,
    image: dict.images.og,
  })
}

export default async function MeetPage({ params }: PageProps<"/[lang]/meet">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getContent(lang)
  const t = dict.meet

  return (
    <>
      <SiteHeader locale={lang} dict={dict} />
      <main id="main" tabIndex={-1} className="outline-none">
        <div className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground md:text-5xl">{t.title}</h1>
            <p className="mt-6 max-w-[36ch] text-lg text-muted-foreground">{t.body}</p>
            <p className="mt-8 text-sm text-muted-foreground">
              {dict.demo.altContact}{" "}
              <a href={`mailto:${dict.links.email}`} className="ltr-fragment font-medium text-foreground underline underline-offset-4">
                {dict.links.email}
              </a>
            </p>
          </div>
          <div className="lg:col-span-8">
            {/* Not configured: say so up front instead of a form that can only fail. */}
            {!siteApiOrigin() ? (
              <Unavailable t={t.unavailable} href={requestHref(lang, dict)} />
            ) : (
              /* The flow reads the address bar (?retry=1), so it renders in the browser. */
              <Suspense fallback={<MeetSkeleton t={t} />}>
                <MeetFlow t={t} locale={lang} requestHref={requestHref(lang, dict)} />
              </Suspense>
            )}
          </div>
        </div>
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  )
}
