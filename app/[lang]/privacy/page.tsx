import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LegalPage } from "@/components/legal/legal-page"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { privacy } from "@/lib/legal/privacy"
import { legalUi } from "@/lib/legal/ui"
import { pageMetadata } from "@/lib/site"

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const doc = privacy[lang]
  return pageMetadata({
    locale: lang,
    path: "/privacy",
    title: `${doc.title} | Manar`,
    description: doc.description,
    siteName: getDictionary(lang).meta.siteName,
  })
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return <LegalPage locale={lang} dict={getDictionary(lang)} doc={privacy[lang]} ui={legalUi[lang]} />
}
