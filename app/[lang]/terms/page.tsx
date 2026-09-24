import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LegalPage } from "@/components/legal/legal-page"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { terms } from "@/lib/legal/terms"
import { legalUi } from "@/lib/legal/ui"
import { pageMetadata } from "@/lib/site"

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const doc = terms[lang]
  return pageMetadata({
    locale: lang,
    path: "/terms",
    title: `${doc.title} | Manar`,
    description: doc.description,
    siteName: getDictionary(lang).meta.siteName,
  })
}

export default async function Page({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return <LegalPage locale={lang} dict={getDictionary(lang)} doc={terms[lang]} ui={legalUi[lang]} />
}
