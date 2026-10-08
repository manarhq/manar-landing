/**
 * The bundled content: the documents manar-site seeds its CMS from, and the fallback the site
 * renders whenever the published content cannot be fetched. Relative imports only.
 */
import type { Locale } from "../i18n/config.ts"
import ar from "./ar.ts"
import en from "./en.ts"
import { cookies } from "./legal/cookies.ts"
import { privacy } from "./legal/privacy.ts"
import { terms } from "./legal/terms.ts"
import { legalUi } from "./legal/ui.ts"
import type { SiteContent } from "./schema.ts"

export const bundledContent: Record<Locale, SiteContent> = {
  en: { ...en, legal: { ui: legalUi.en, privacy: privacy.en, cookies: cookies.en, terms: terms.en } },
  ar: { ...ar, legal: { ui: legalUi.ar, privacy: privacy.ar, cookies: cookies.ar, terms: terms.ar } },
}

export type { LegalBlock, LegalDoc, SiteContent } from "./schema.ts"
export { legalDocSchema, publishedContentSchema, siteContentSchema } from "./schema.ts"
