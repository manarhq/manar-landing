import type { Locale } from "../../i18n/config.ts"

export const legalUi = {
  en: {
    lastUpdated: "Last updated",
    onThisPage: "On this page",
    backHome: "Back to home",
    print: "Print",
    tableLabel: "Table",
    sectionLink: "Link to this section",
  },
  ar: {
    lastUpdated: "آخر تحديث",
    onThisPage: "في هذه الصفحة",
    backHome: "العودة إلى الصفحة الرئيسية",
    print: "طباعة",
    tableLabel: "جدول",
    sectionLink: "رابط إلى هذا القسم",
  },
} satisfies Record<Locale, Record<string, string>>

export type LegalUi = (typeof legalUi)["en"]
