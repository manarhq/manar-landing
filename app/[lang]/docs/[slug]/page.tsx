import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocsShell } from "@/components/docs/docs-shell"
import { CoverageTable } from "@/components/home/coverage-table"
import { getContent } from "@/lib/content/load"
import { isLocale, locales, type Locale } from "@/lib/i18n/config"
import { docSlugs, launchCopy, type DocSlug } from "@/lib/launch/copy"
import { pageMetadata, type SitePath } from "@/lib/site"

export const dynamicParams = false

const isSlug = (v: string): v is DocSlug => (docSlugs as readonly string[]).includes(v)

export function generateStaticParams() {
  return locales.flatMap((lang) => docSlugs.map((slug) => ({ lang, slug })))
}

/** Explicit imports: the bundler sees every file, and a missing translation fails the build. */
const load = (lang: Locale, slug: DocSlug) => import(`@/content/docs/${lang}/${slug}.mdx`)

export async function generateMetadata({ params }: PageProps<"/[lang]/docs/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLocale(lang) || !isSlug(slug)) return {}
  const page = launchCopy[lang].docs.pages[slug]
  const content = await getContent(lang)
  return pageMetadata({
    locale: lang,
    path: `/docs/${slug}` as SitePath,
    title: `${page.title} | ${content.meta.siteName}`,
    description: page.description,
    siteName: content.meta.siteName,
    image: content.images.og,
  })
}

export default async function DocPage({ params }: PageProps<"/[lang]/docs/[slug]">) {
  const { lang, slug } = await params
  if (!isLocale(lang) || !isSlug(slug)) notFound()
  const dict = await getContent(lang)
  const { default: Doc } = await load(lang, slug)
  return (
    <DocsShell locale={lang} dict={dict} current={slug} title={launchCopy[lang].docs.pages[slug].title}>
      <Doc components={{ CoverageTable: () => <CoverageTable locale={lang} /> }} />
    </DocsShell>
  )
}
