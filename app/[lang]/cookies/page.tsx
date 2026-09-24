import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LegalPage } from "@/components/legal/legal-page"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { cookies } from "@/lib/legal/cookies"
import { legalUi } from "@/lib/legal/ui"
import { pageMetadata } from "@/lib/site"

export async function generateMetadata({ params }: PageProps<"/[lang]/cookies">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const doc = cookies[lang]
  return pageMetadata({
    locale: lang,
    path: "/cookies",
    title: `${doc.title} | Manar`,
    description: doc.description,
    siteName: getDictionary(lang).meta.siteName,
  })
}

export default async function Page({ params }: PageProps<"/[lang]/cookies">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return <LegalPage locale={lang} dict={getDictionary(lang)} doc={cookies[lang]} ui={legalUi[lang]} />
}
