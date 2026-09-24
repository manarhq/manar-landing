import type { Locale } from "./i18n/config"
import type { Dictionary } from "./i18n/dictionaries"
import { cookies as cookiesDoc } from "./legal/cookies"
import { privacy as privacyDoc } from "./legal/privacy"
import { terms as termsDoc } from "./legal/terms"

export type SearchEntry = {
  kind: "section" | "faq" | "page"
  title: string
  text: string
  href: string
}

export function faqSlug(index: number) {
  return `faq-${index + 1}`
}

/** Everything the Cmd/Ctrl+K search can find (W03). Built on the server from real page content. */
export function buildSearchIndex(locale: Locale, dict: Dictionary): SearchEntry[] {
  const home = `/${locale}`
  return [
    { kind: "section", title: dict.nav.platform, text: `${dict.capabilities.title} ${dict.capabilities.groups.flatMap((g) => g.items.map((i) => `${i.title} ${i.body}`)).join(" ")}`, href: `${home}#platform` },
    { kind: "section", title: dict.workspace.tabs.overview, text: `${dict.workspace.title} ${dict.workspace.body}`, href: `${home}#workspace` },
    { kind: "section", title: dict.nav.howItWorks, text: `${dict.how.title} ${dict.how.steps.map((s) => `${s.title} ${s.body}`).join(" ")} ${dict.how.boundary}`, href: `${home}#how-it-works` },
    { kind: "section", title: dict.nav.deployment, text: `${dict.deployment.title} ${dict.deployment.body} ${dict.deployment.dimensions.map((d) => `${d.title} ${d.body}`).join(" ")}`, href: `${home}#deployment` },
    { kind: "section", title: dict.name.title, text: `${dict.name.word} ${dict.name.meaning} ${dict.name.body}`, href: `${home}#name` },
    ...dict.faq.items.map((item, i) => ({ kind: "faq" as const, title: item.question, text: item.answer, href: `${home}#${faqSlug(i)}` })),
    { kind: "page", title: dict.demo.form.title, text: `${dict.demo.title} ${dict.demo.body}`, href: `${home}/demo` },
    ...([
      [privacyDoc, "privacy"],
      [cookiesDoc, "cookies"],
      [termsDoc, "terms"],
    ] as const).map(([doc, path]) => ({
      kind: "page" as const,
      title: doc[locale].title,
      text: `${doc[locale].description} ${doc[locale].sections.map((s) => s.heading).join(" ")}`,
      href: `${home}/${path}`,
    })),
  ]
}

const fold = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, "")
    .replace(/[إأآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .toLowerCase()

/** Every query word must appear; title matches rank first. */
export function searchEntries(entries: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const words = fold(query).split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return entries
    .map((entry) => {
      const title = fold(entry.title)
      const body = `${title} ${fold(entry.text)}`
      if (!words.every((w) => body.includes(w))) return null
      return { entry, score: words.filter((w) => title.includes(w)).length }
    })
    .filter((hit): hit is { entry: SearchEntry; score: number } => hit !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((hit) => hit.entry)
}
