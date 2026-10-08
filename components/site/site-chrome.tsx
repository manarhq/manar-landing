import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { buildSearchIndex } from "@/lib/search-index"

import { Consent } from "./consent"
import { DeferredChrome } from "./deferred-chrome"

/** Site-wide overlays, rendered once per page from the root layout. */
export function SiteChrome({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <DeferredChrome
        search={{ entries: buildSearchIndex(locale, dict), labels: dict.site.search }}
        floating={{ locale, dict: { site: dict.site, common: dict.common, links: dict.links } }}
      />
      <Consent locale={locale} labels={dict.site.consent} />
    </>
  )
}
