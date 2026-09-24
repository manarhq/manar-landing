import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { buildSearchIndex } from "@/lib/search-index"

import { Consent } from "./consent"
import { FloatingControls } from "./floating-controls"
import { SearchDialog } from "./search-dialog"

/** Site-wide overlays, rendered once per page from the root layout. */
export function SiteChrome({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <SearchDialog entries={buildSearchIndex(locale, dict)} labels={dict.site.search} />
      <FloatingControls locale={locale} dict={dict} />
      <Consent locale={locale} labels={dict.site.consent} />
    </>
  )
}
