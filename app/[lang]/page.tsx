import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Capabilities } from "@/components/home/capabilities"
import { ClosingCta } from "@/components/home/closing-cta"
import { Deployment } from "@/components/home/deployment"
import { Faq } from "@/components/home/faq"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { NameMeaning } from "@/components/home/name-meaning"
import { Problem } from "@/components/home/problem"
import { WorkspaceSection } from "@/components/home/workspace-section"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { CONTACT_EMAIL, pageMetadata, siteOrigin, VAX_URL } from "@/lib/site"
import { homeStructuredData } from "@/lib/structured-data"

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const dict = getDictionary(lang)
  return pageMetadata({
    locale: lang,
    path: "",
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    siteName: dict.meta.siteName,
  })
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = getDictionary(lang)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: homeStructuredData({
            origin: siteOrigin(),
            lang,
            description: dict.meta.homeDescription,
            faq: dict.faq.items,
            vaxUrl: VAX_URL,
            email: CONTACT_EMAIL,
          }),
        }}
      />
      <SiteHeader locale={lang} dict={dict} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero locale={lang} dict={dict} />
        <Problem dict={dict} />
        <WorkspaceSection dict={dict} />
        <HowItWorks dict={dict} />
        <Capabilities dict={dict} />
        <Deployment locale={lang} dict={dict} />
        <NameMeaning dict={dict} />
        <Faq dict={dict} />
        <ClosingCta locale={lang} dict={dict} />
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  )
}
