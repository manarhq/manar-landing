import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ManageView } from "@/components/meet/manage-view"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { getContent } from "@/lib/content/load"
import { isLocale } from "@/lib/i18n/config"

/** Reached only from an emailed link that carries a token, so it is never indexed. */
export async function generateMetadata({ params }: PageProps<"/[lang]/meet/manage">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = (await getContent(lang)).meet
  return { title: `${t.manage.heading} | ${t.title}`, robots: { index: false, follow: false }, referrer: "no-referrer" }
}

export default async function Page({ params }: PageProps<"/[lang]/meet/manage">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getContent(lang)
  const t = dict.meet

  return (
    <>
      <SiteHeader locale={lang} dict={dict} />
      <main id="main" tabIndex={-1} className="outline-none">
        <div className="shell py-16 md:py-24">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{t.manage.heading}</h1>
          <div className="mt-12">
            <Suspense fallback={<p className="text-lg text-muted-foreground">{t.manage.loading}</p>}>
              <ManageView t={t} locale={lang} meetHref={`/${lang}/meet`} />
            </Suspense>
          </div>
        </div>
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  )
}
