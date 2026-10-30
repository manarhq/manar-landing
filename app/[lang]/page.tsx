import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Closing } from "@/components/home/closing"
import { Coverage } from "@/components/home/coverage"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { Pricing } from "@/components/home/pricing"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { isLocale } from "@/lib/i18n/config"
import { getContent } from "@/lib/content/load"
import { pageMetadata, siteOrigin } from "@/lib/site"
import { homeStructuredData } from "@/lib/structured-data"

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const dict = await getContent(lang)
  return pageMetadata({
    locale: lang,
    path: "",
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    siteName: dict.meta.siteName,
    image: dict.images.og,
  })
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getContent(lang)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: homeStructuredData({
            origin: siteOrigin(),
            lang,
            description: dict.meta.homeDescription,
            vaxUrl: dict.links.vax,
            email: dict.links.email,
            logo: dict.images.logo.src,
          }),
        }}
      />
      <SiteHeader locale={lang} dict={dict} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero locale={lang} />
        <HowItWorks dict={dict} />
        <Coverage locale={lang} />
        <Pricing locale={lang} dict={dict} />
        <Closing locale={lang} dict={dict} />
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  )
}
