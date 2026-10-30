import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DocsShell } from "@/components/docs/docs-shell"
import { getContent } from "@/lib/content/load"
import { isLocale } from "@/lib/i18n/config"
import { docSlugs, launchCopy } from "@/lib/launch/copy"
import { pageMetadata } from "@/lib/site"

export async function generateMetadata({ params }: PageProps<"/[lang]/docs">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const d = launchCopy[lang].docs
  const content = await getContent(lang)
  return pageMetadata({ locale: lang, path: "/docs", title: `${d.title} | ${content.meta.siteName}`, description: d.body, siteName: content.meta.siteName, image: content.images.og })
}

export default async function DocsIndex({ params }: PageProps<"/[lang]/docs">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getContent(lang)
  const d = launchCopy[lang].docs
  return (
    <DocsShell locale={lang} dict={dict} current={null} title={d.title}>
      <p className="text-lg text-muted-foreground">{d.body}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {docSlugs.map((slug) => (
          <li key={slug} className="rounded-md border border-line bg-surface p-5">
            <Link href={`/${lang}/docs/${slug}`} className="font-semibold text-foreground underline-offset-4 hover:underline">
              {d.pages[slug].title}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">{d.pages[slug].description}</p>
          </li>
        ))}
      </ul>
    </DocsShell>
  )
}
