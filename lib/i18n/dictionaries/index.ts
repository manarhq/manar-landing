import { bundledContent } from "@/lib/content"
import type { SiteContent } from "@/lib/content/schema"

import type { Locale } from "../config"

/** Components still call the content document a dictionary. It is the content model. */
export type Dictionary = SiteContent

/** The bundled document, for places that cannot fetch (the global 404). Pages use getContent(). */
export function getDictionary(locale: Locale): Dictionary {
  return bundledContent[locale]
}

export { format } from "../format"
