import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LegalPage } from "@/components/legal/legal-page"
import { getContent } from "@/lib/content/load"
import { isLocale } from "@/lib/i18n/config"
import { legalDoc, legalPaths, type LegalPath } from "@/lib/launch/legal"
import { pageMetadata, type SitePath } from "@/lib/site"

const isLegal = (v: string): v is LegalPath => (legalPaths as readonly string[]).includes(v)

export const dynamicParams = false

export function generateStaticParams() {
  return (["en", "ar"] as const).flatMap((lang) => legalPaths.map((legal) => ({ lang, legal })))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[legal]">): Promise<Metadata> {
  const { lang, legal } = await params
  if (!isLocale(lang) || !isLegal(legal)) return {}
  const content = await getContent(lang)
  const doc = legalDoc(lang, legal)
  return pageMetadata({
    locale: lang,
    path: `/${legal}` as SitePath,
    title: `${doc.title} | ${content.meta.siteName}`,
    description: doc.description,
    siteName: content.meta.siteName,
    image: content.images.og,
  })
}

export default async function Page({ params }: PageProps<"/[lang]/[legal]">) {
  const { lang, legal } = await params
  if (!isLocale(lang) || !isLegal(legal)) notFound()
  const content = await getContent(lang)
  return <LegalPage locale={lang} dict={content} doc={legalDoc(lang, legal)} ui={content.legal.ui} />
}
