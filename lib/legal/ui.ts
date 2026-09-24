import type { Locale } from "@/lib/i18n/config"

export const legalUi = {
  en: {
    lastUpdated: "Last updated",
    onThisPage: "On this page",
    draftTitle: "Draft pending legal review",
    draftBody:
      "This is a working draft, published so you can see how we handle data today. It will be reviewed before it is finalised.",
    pendingDetails: "Still to be confirmed:",
    backHome: "Back to home",
    print: "Print",
    tableLabel: "Table",
    sectionLink: "Link to this section",
  },
  ar: {
    lastUpdated: "آخر تحديث",
    onThisPage: "في هذه الصفحة",
    draftTitle: "مسودة بانتظار المراجعة القانونية",
    draftBody:
      "هذه مسودة عمل ننشرها لتطّلع على طريقة تعاملنا مع البيانات حاليًا، وستخضع للمراجعة قبل اعتمادها.",
    pendingDetails: "تفاصيل لا تزال قيد التأكيد:",
    backHome: "العودة إلى الصفحة الرئيسية",
    print: "طباعة",
    tableLabel: "جدول",
    sectionLink: "رابط إلى هذا القسم",
  },
} satisfies Record<Locale, Record<string, string>>

export type LegalUi = (typeof legalUi)["en"]
