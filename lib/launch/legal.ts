import { aup } from "../content/legal/aup.ts"
import { cookies } from "../content/legal/cookies.ts"
import { dpa } from "../content/legal/dpa.ts"
import { privacy } from "../content/legal/privacy.ts"
import { terms } from "../content/legal/terms.ts"
import type { LegalDoc } from "../content/schema.ts"
import type { Locale } from "../i18n/config.ts"

/**
 * The legal pages. They come from the bundled launch drafts, not from the CMS document: the
 * drafts name Fixio as provider, and a stale published copy must never override them at launch.
 */
export const legalPaths = ["terms", "privacy", "acceptable-use", "cookies", "dpa"] as const
export type LegalPath = (typeof legalPaths)[number]

const docs: Record<LegalPath, Record<Locale, LegalDoc>> = {
  terms,
  privacy,
  "acceptable-use": aup,
  cookies,
  dpa,
}

export function legalDoc(locale: Locale, path: LegalPath): LegalDoc {
  return docs[path][locale]
}
