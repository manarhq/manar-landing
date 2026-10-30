/** Plans and prices (public launch spec 2 item 8, decisions #81, #83-85, #87). USD; UAE VAT is added at checkout. */
import type { Locale } from "../i18n/config.ts"

export type PlanId = "free" | "pro" | "company" | "enterprise"
export type PlanCta = "start" | "trial" | "talk"

export const planOrder: PlanId[] = ["free", "pro", "company", "enterprise"]

type Plan = {
  name: string
  tagline: string
  /** Headline price; null for "Talk to us". */
  price: string | null
  unit: string
  /** A second way to pay, such as the yearly price. */
  alt?: string
  features: string[]
  cta: string
  ctaKind: PlanCta
  /** Shown under the card in smaller text. */
  note?: string
}

export type PricingText = {
  title: string
  body: string
  vat: string
  currency: string
  plans: Record<PlanId, Plan>
}

export const pricingText: Record<Locale, PricingText> = {
  en: {
    title: "Free for one person. Simple when you grow.",
    body: "Start free with your own computer. Upgrade for more devices and a longer record, or bring your whole company.",
    vat: "Prices are in US dollars. UAE VAT of 5% is added for buyers in the UAE.",
    currency: "USD",
    plans: {
      free: {
        name: "Free",
        tagline: "For your own computer.",
        price: "$0",
        unit: "forever",
        features: ["3 devices", "10 agents", "30-day audit", "1 cloud agent"],
        cta: "Start free",
        ctaKind: "start",
      },
      pro: {
        name: "Personal Pro",
        tagline: "For people who live in AI tools.",
        price: "$9",
        unit: "per month",
        alt: "or $90 per year",
        features: [
          "10 devices",
          "Unlimited agents",
          "1-year audit",
          "5 cloud agents",
          "TLS inspection",
          "Priority email support",
        ],
        cta: "Start free, upgrade any time",
        ctaKind: "start",
      },
      company: {
        name: "Company",
        tagline: "For teams that need to see every AI action.",
        price: "$15",
        unit: "per user per month",
        features: [
          "3 devices per user included, $5 per extra device",
          "30-day free trial with 25 devices",
          "All features during the trial",
        ],
        cta: "Start a 30-day trial",
        ctaKind: "trial",
        note: "A billable user is anyone with an enrolled device or a console sign-in that month.",
      },
      enterprise: {
        name: "Enterprise",
        tagline: "For regulated and large organisations.",
        price: null,
        unit: "Talk to us",
        features: [
          "Hub and federation",
          "Air-gapped installs",
          "Government deployments",
          "TPM attestation",
          "Compliance packs",
          "Signed licence",
        ],
        cta: "Talk to us",
        ctaKind: "talk",
      },
    },
  },
  ar: {
    title: "مجاني للفرد. وبسيط حين تكبر.",
    body: "ابدأ مجاناً بحاسوبك الشخصي. ارتقِ للحصول على أجهزة أكثر وسجل أطول، أو أحضر شركتك كلها.",
    vat: "الأسعار بالدولار الأمريكي. تُضاف ضريبة القيمة المضافة في الإمارات بنسبة 5% للمشترين داخل الإمارات.",
    currency: "USD",
    plans: {
      free: {
        name: "مجاني",
        tagline: "لحاسوبك الشخصي.",
        price: "$0",
        unit: "دائماً",
        features: ["3 أجهزة", "10 وكلاء", "سجل تدقيق لمدة 30 يوماً", "وكيل سحابي واحد"],
        cta: "ابدأ مجاناً",
        ctaKind: "start",
      },
      pro: {
        name: "Personal Pro",
        tagline: "لمن يعيش بين أدوات الذكاء الاصطناعي.",
        price: "$9",
        unit: "شهرياً",
        alt: "أو $90 سنوياً",
        features: [
          "10 أجهزة",
          "وكلاء غير محدودين",
          "سجل تدقيق لمدة سنة",
          "5 وكلاء سحابيين",
          "فحص TLS",
          "دعم أولوية عبر البريد الإلكتروني",
        ],
        cta: "ابدأ مجاناً وارتقِ متى شئت",
        ctaKind: "start",
      },
      company: {
        name: "الشركات",
        tagline: "للفرق التي تريد رؤية كل إجراء للذكاء الاصطناعي.",
        price: "$15",
        unit: "لكل مستخدم شهرياً",
        features: [
          "3 أجهزة لكل مستخدم ضمن السعر، و$5 لكل جهاز إضافي",
          "تجربة مجانية لمدة 30 يوماً بحد 25 جهازاً",
          "جميع الميزات خلال التجربة",
        ],
        cta: "ابدأ تجربة 30 يوماً",
        ctaKind: "trial",
        note: "المستخدم المحتسب هو كل من لديه جهاز مسجّل أو دخل إلى لوحة التحكم خلال ذلك الشهر.",
      },
      enterprise: {
        name: "المؤسسات",
        tagline: "للجهات الخاضعة للتنظيم والمؤسسات الكبيرة.",
        price: null,
        unit: "تواصل معنا",
        features: [
          "المركز والاتحاد بين البيئات",
          "تثبيت معزول عن الشبكة",
          "نشر للجهات الحكومية",
          "إثبات TPM",
          "حزم الامتثال",
          "ترخيص موقّع",
        ],
        cta: "تواصل معنا",
        ctaKind: "talk",
      },
    },
  },
}
