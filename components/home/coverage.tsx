import type { Locale } from "@/lib/i18n/config"
import { coverageText } from "@/lib/launch/coverage"

import { CoverageTable } from "./coverage-table"
import { SectionHeading } from "./section-heading"

export function Coverage({ locale }: { locale: Locale }) {
  const t = coverageText[locale]
  return (
    <section id="coverage" aria-labelledby="coverage-title" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="coverage-title" title={t.title} body={t.body} />
        <div className="mt-10">
          <CoverageTable locale={locale} />
        </div>
      </div>
    </section>
  )
}
