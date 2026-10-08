import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LegalPage } from "@/components/legal/legal-page"
import { getContent } from "@/lib/content/load"
import { isLocale } from "@/lib/i18n/config"
import { pageMetadata } from "@/lib/site"

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const content = await getContent(lang)
  const doc = content.legal.privacy
  return pageMetadata({
    locale: lang,
    path: "/privacy",
    title: `${doc.title} | ${content.meta.siteName}`,
    description: doc.description,
    siteName: content.meta.siteName,
    image: content.images.og,
  })
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const content = await getContent(lang)
  return <LegalPage locale={lang} dict={content} doc={content.legal.privacy} ui={content.legal.ui} />
}
