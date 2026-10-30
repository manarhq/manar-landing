import type { Locale } from "./i18n/config"
import type { Dictionary } from "./i18n/dictionaries"
import { docSlugs, launchCopy } from "./launch/copy"
import { coverageRows, coverageText, rowName } from "./launch/coverage"
import { legalDoc, legalPaths } from "./launch/legal"
import { planOrder, pricingText } from "./launch/pricing"
import { bookingHref } from "./site"

export type SearchEntry = {
  kind: "section" | "page"
  title: string
  text: string
  href: string
}

/** Everything the Cmd/Ctrl+K search can find (W03). Built on the server from real page content. */
export function buildSearchIndex(locale: Locale, dict: Dictionary): SearchEntry[] {
  const home = `/${locale}`
  const l = launchCopy[locale]
  const cov = coverageText[locale]
  const pr = pricingText[locale]
  return [
    { kind: "section", title: dict.nav.howItWorks, text: `${dict.how.title} ${dict.how.body} ${dict.how.steps.map((s) => `${s.title} ${s.fact}`).join(" ")}`, href: `${home}#how-it-works` },
    { kind: "section", title: l.nav.coverage, text: `${cov.title} ${cov.body} ${coverageRows.map((r) => rowName(locale, r)).join(" ")}`, href: `${home}#coverage` },
    { kind: "section", title: l.nav.pricing, text: `${pr.title} ${pr.body} ${planOrder.map((id) => `${pr.plans[id].name} ${pr.plans[id].price ?? ""} ${pr.plans[id].features.join(" ")}`).join(" ")}`, href: `${home}#pricing` },
    ...docSlugs.map((slug) => ({
      kind: "page" as const,
      title: l.docs.pages[slug].title,
      text: l.docs.pages[slug].description,
      href: `${home}/docs/${slug}`,
    })),
    { kind: "page", title: dict.meet.title, text: `${dict.meet.body} ${dict.demo.title} ${dict.demo.body}`, href: bookingHref(locale, dict) },
    ...legalPaths.map((path) => {
      const doc = legalDoc(locale, path)
      return {
        kind: "page" as const,
        title: doc.title,
        text: `${doc.description} ${doc.sections.map((s) => s.heading).join(" ")}`,
        href: `${home}/${path}`,
      }
    }),
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
