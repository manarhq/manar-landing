import { EyeIcon } from "@phosphor-icons/react/ssr"

import type { Locale } from "@/lib/i18n/config"

/*
 * Staff-only, so these strings are not in the content model: adding a required field there
 * would make every document manar-site serves today fail validation.
 */
const text = {
  en: { label: "Preview", body: "You are seeing the unpublished draft. Visitors still see the live site.", exit: "Leave preview" },
  ar: { label: "معاينة", body: "تعرض هذه الصفحة المسودة غير المنشورة. ما زال الزوار يرون الموقع المنشور.", exit: "الخروج من المعاينة" },
}

/** Shown on every page while this browser is in preview. Not a link to anything public. */
export function PreviewBar({ locale }: { locale: Locale }) {
  const t = text[locale]
  return (
    <div role="status" data-print="hide" className="bg-ink text-ink-text">
      <div className="shell flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-sm">
        <p className="flex items-center gap-2">
          <EyeIcon aria-hidden className="size-4 shrink-0" />
          <span className="font-semibold">{t.label}</span>
          <span>{t.body}</span>
        </p>
        <a
          href={`/api/preview/exit?path=/${locale}`}
          className="inline-flex min-h-9 items-center font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink-text"
        >
          {t.exit}
        </a>
      </div>
    </div>
  )
}
