import { CheckCircleIcon, CircleHalfIcon, HourglassMediumIcon, MinusIcon } from "@phosphor-icons/react/ssr"

import type { Locale } from "@/lib/i18n/config"
import {
  cellLabel,
  coverageColumns,
  coverageRows,
  coverageText,
  rowName,
  type Cell,
  type CellId,
} from "@/lib/launch/coverage"
import { cn } from "@/lib/utils"

const full: CellId[] = ["yes", "yes_hook", "yes_mcp_gateway"]
const none: CellId[] = ["na"]

/** Icon and word, never colour alone. Blue means covered; everything partial stays neutral. */
function CellView({ locale, cell }: { locale: Locale; cell: Cell }) {
  const { text, floor } = cellLabel(locale, cell)
  const Icon = full.includes(cell.id) ? CheckCircleIcon : none.includes(cell.id) ? MinusIcon : cell.id === "verifying" ? HourglassMediumIcon : CircleHalfIcon
  return (
    <div>
      <span className={cn("inline-flex items-start gap-1.5", full.includes(cell.id) ? "text-allow" : "text-foreground")}>
        <Icon aria-hidden weight={full.includes(cell.id) ? "fill" : "regular"} className="mt-0.5 size-4 shrink-0" />
        <span>{text}</span>
      </span>
      {floor ? <p className="mt-1 ps-5.5 text-xs text-muted-foreground">{floor}</p> : null}
    </div>
  )
}

/** The one coverage table (lib/launch/coverage.ts). Used on the home page and in /docs. */
export function CoverageTable({ locale }: { locale: Locale }) {
  const t = coverageText[locale]
  return (
    <div className="not-prose">
      <div role="region" aria-label={t.caption} tabIndex={0} className="overflow-x-auto rounded-md border border-line bg-surface">
        <table className="w-full min-w-[46rem] border-collapse text-start text-sm">
          <caption className="sr-only">{t.caption}</caption>
          <thead>
            <tr className="border-b border-line-strong">
              <th scope="col" className="px-4 py-3 text-start font-semibold text-foreground">
                {t.tool}
              </th>
              {coverageColumns.map((c) => (
                <th key={c} scope="col" className="px-4 py-3 text-start font-semibold text-foreground">
                  {t.columns[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coverageRows.map((row) => (
              <tr key={row.id} className="border-b border-line align-top last:border-b-0">
                <th scope="row" className="px-4 py-3 text-start font-medium text-foreground">
                  {rowName(locale, row)}
                </th>
                {coverageColumns.map((c) => (
                  <td key={c} className="px-4 py-3 text-foreground">
                    <CellView locale={locale} cell={row[c]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-[75ch] text-sm text-muted-foreground">{t.vaultNote}</p>
      <p className="mt-2 max-w-[75ch] text-sm text-muted-foreground">{t.honesty}</p>
    </div>
  )
}
