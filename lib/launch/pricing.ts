/**
 * Plans and prices: pay-as-you-go hybrid (founder decision 4 Nov 2026, workspace spec
 * docs/superpowers/specs/2026-11-04-payg-pricing-design.md). Charged in USD; AED is shown at the
 * fixed peg; UAE VAT of 5% is added at checkout. The examples are computed from the same numbers.
 */
import type { Locale } from "../i18n/config.ts"

export type PlanId = "free" | "pro" | "company" | "enterprise"
export type PlanCta = "start" | "trial" | "talk"

export const planOrder: PlanId[] = ["free", "pro", "company", "enterprise"]

/** The numbers every string and example below comes from. */
export const PRICE = {
  proMonthly: 5,
  proYearly: 50,
  proIncludedDevices: 2,
  extraDevice: 2,
  seat: 15,
  seatYearly: 150,
  minSeats: 3,
  pack: 5,
  packCredits: 1000,
  aiFree: 20,
  aiIncluded: 300,
  minutesIncluded: 300,
  activeDays: 3,
  trialDays: 14,
  proCapUsd: 20,
} as const

/** The dirham is pegged: 1 USD = 3.6725 AED. */
export const AED_PER_USD = 3.6725
export const aed = (usd: number) => (usd * AED_PER_USD).toFixed(2)

/** Pro: $5 with 2 active devices, $2 for each further active device. */
export const proMonthly = (activeDevices: number) =>
  PRICE.proMonthly + PRICE.extraDevice * Math.max(0, activeDevices - PRICE.proIncludedDevices)
/** Company: $15 per active seat, at least 3. */
export const companyMonthly = (activeSeats: number) => PRICE.seat * Math.max(PRICE.minSeats, activeSeats)
/** Credits for AI actions beyond the allowance, rounded up to whole $5 packs. */
export const creditPacksFor = (aiActions: number, included: number) =>
  Math.ceil(Math.max(0, aiActions - included) / PRICE.packCredits)

type Plan = {
  name: string
  tagline: string
  /** Headline price; null for "Talk to us". */
  price: string | null
  unit: string
  /** AED and the yearly price. */
  alt?: string
  features: string[]
  cta: string
  ctaKind: PlanCta
  /** Shown under the card in smaller text. */
  note?: string
}

type Example = { label: string; price: string; detail: string }
type Faq = { q: string; a: string }

export type PricingText = {
  title: string
  body: string
  vat: string
  currency: string
  plans: Record<PlanId, Plan>
  examplesTitle: string
  examples: Example[]
  faqTitle: string
  faq: Faq[]
}

const usd = (n: number) => `$${n}`

export const pricingText: Record<Locale, PricingText> = {
  en: {
    title: "Pay for what you use. Safety is never metered.",
    body: "Start free. Pro is $5 a month for two active devices. Teams pay per active seat. AI extras come from prepaid credits, with a cap you control.",
    vat: "Prices are in US dollars, with AED for reference. UAE VAT of 5% is added at checkout for buyers in the UAE.",
    currency: "USD",
    plans: {
      free: {
        name: "Free",
        tagline: "For one computer.",
        price: "$0",
        unit: "forever",
        features: [
          "1 device, safety always on",
          `${PRICE.aiFree} AI actions a month`,
          "30 days of history",
          `${PRICE.trialDays}-day trial with up to 3 devices, no card`,
          "Buy $5 credit packs when you need more AI",
        ],
        cta: "Start free",
        ctaKind: "start",
      },
      pro: {
        name: "Pro",
        tagline: "For people who live in AI tools.",
        price: usd(PRICE.proMonthly),
        unit: "per month",
        alt: `About AED ${aed(PRICE.proMonthly)}. Or ${usd(PRICE.proYearly)} a year.`,
        features: [
          `${PRICE.proIncludedDevices} active devices included`,
          `${usd(PRICE.extraDevice)} a month for each extra active device`,
          `${PRICE.aiIncluded} AI actions and ${PRICE.minutesIncluded} cloud-agent minutes a month`,
          "1 year of history, TLS inspection, priority email support",
          `Spend cap of ${usd(PRICE.proCapUsd)} a month by default, yours to change`,
        ],
        cta: "Start free, upgrade any time",
        ctaKind: "start",
      },
      company: {
        name: "Company",
        tagline: "For teams that need to see every AI action.",
        price: usd(PRICE.seat),
        unit: "per active seat per month",
        alt: `About AED ${aed(PRICE.seat)}. Minimum ${PRICE.minSeats} seats. Or ${usd(PRICE.seatYearly)} per seat a year.`,
        features: [
          "Unlimited devices",
          `${PRICE.aiIncluded} AI actions and ${PRICE.minutesIncluded} cloud-agent minutes per seat, shared by the team`,
          "SSO, AD and Entra sync, roles and approvals",
          "An admin sets the monthly spend cap",
          `${PRICE.trialDays}-day trial with a card, cancel in one click`,
        ],
        cta: `Start a ${PRICE.trialDays}-day trial`,
        ctaKind: "trial",
        note: "Invoice and bank transfer are available for companies and government.",
      },
      enterprise: {
        name: "Enterprise and Government",
        tagline: "For regulated and large organisations.",
        price: null,
        unit: "Talk to us",
        features: [
          "Annual contract with a credit pool",
          "Invoices, no card needed",
          "Hub and federation",
          "Air-gapped and government installs",
          "TPM attestation and compliance packs",
        ],
        cta: "Talk to us",
        ctaKind: "talk",
      },
    },
    examplesTitle: "What it costs",
    examples: [
      {
        label: "2 laptops, normal use",
        price: `${usd(proMonthly(2))} a month`,
        detail: "Pro covers 2 active devices and 300 AI actions.",
      },
      {
        label: "4 devices, all in use",
        price: `${usd(proMonthly(4))} a month`,
        detail: `${usd(PRICE.proMonthly)} plus 2 extra active devices at ${usd(PRICE.extraDevice)}.`,
      },
      {
        label: "A heavy AI month, 1,200 AI actions",
        price: `${usd(proMonthly(2) + PRICE.pack * creditPacksFor(1200, PRICE.aiIncluded))}`,
        detail: `${usd(PRICE.proMonthly)} plus one ${usd(PRICE.pack)} credit pack for the 900 above the allowance.`,
      },
      {
        label: "A team of 5",
        price: `${usd(companyMonthly(5))} a month`,
        detail: `5 active seats at ${usd(PRICE.seat)}, with 1,500 AI actions shared.`,
      },
      {
        label: "A team of 2",
        price: `${usd(companyMonthly(2))} a month`,
        detail: `Company starts at ${PRICE.minSeats} seats.`,
      },
    ],
    faqTitle: "Questions",
    faq: [
      {
        q: "What counts as active?",
        a: `A device or a seat that is online on ${PRICE.activeDays} or more different days in a month. Only active ones are billed. A laptop you open once is not charged, and protection stays on for every device either way.`,
      },
      {
        q: "What is an AI action?",
        a: "One answer from a Manar AI feature, such as the console assistant, an incident summary or a policy suggestion. Checks that keep you safe are not AI actions and are never counted.",
      },
      {
        q: "What happens at zero credits?",
        a: "Safety keeps working. Blocks, approvals, the secret vault and the audit record never stop. Only AI answers and cloud agents above your allowance pause until you add credits or the next month starts.",
      },
      {
        q: "How do caps and alerts work?",
        a: `Pro has a ${usd(PRICE.proCapUsd)} monthly cap on credit spending by default, and you can raise or lower it. On Company an admin sets it. We email you and show a banner at 50%, 80% and 100% of your allowance and of your cap. Auto top-up is off unless you turn it on.`,
      },
      {
        q: "How long do credits last?",
        a: `${usd(PRICE.pack)} buys ${PRICE.packCredits.toLocaleString("en-US")} credits, valid for 12 months. One credit is one AI action or one cloud-agent minute.`,
      },
      {
        q: "What happens after the free trial?",
        a: "The personal trial ends after 14 days and you move to Free. Nothing is charged: you keep 1 device, safety, 20 AI actions a month and 30 days of history, and your other devices keep blocking risky actions. A Company trial needs a card and becomes a paid plan unless you cancel; we remind you on days 7, 12 and 14.",
      },
      {
        q: "What if a payment fails?",
        a: "Everything keeps working for 14 days while the payment is retried. After that the workspace moves to Free limits, with safety still on, and no data is deleted for non-payment within 90 days.",
      },
    ],
  },
  ar: {
    title: "ادفع مقابل ما تستخدمه. الحماية لا تُحتسب أبداً.",
    body: "ابدأ مجاناً. خطة Pro بسعر 5 دولارات شهرياً لجهازين نشطين. الفرق تدفع لكل مقعد نشط. إضافات الذكاء الاصطناعي من أرصدة مدفوعة مسبقاً، مع حد تتحكم فيه.",
    vat: "الأسعار بالدولار الأمريكي مع الدرهم للاسترشاد. تُضاف ضريبة القيمة المضافة 5% عند الدفع للمشترين داخل الإمارات.",
    currency: "USD",
    plans: {
      free: {
        name: "مجاني",
        tagline: "لحاسوب واحد.",
        price: "$0",
        unit: "دائماً",
        features: [
          "جهاز واحد، والحماية مفعّلة دائماً",
          `${PRICE.aiFree} إجراء ذكاء اصطناعي شهرياً`,
          "سجل لمدة 30 يوماً",
          `تجربة لمدة ${PRICE.trialDays} يوماً حتى 3 أجهزة، دون بطاقة`,
          "اشترِ حزم أرصدة بقيمة 5 دولارات عندما تحتاج المزيد",
        ],
        cta: "ابدأ مجاناً",
        ctaKind: "start",
      },
      pro: {
        name: "Pro",
        tagline: "لمن يعيش بين أدوات الذكاء الاصطناعي.",
        price: usd(PRICE.proMonthly),
        unit: "شهرياً",
        alt: `نحو ${aed(PRICE.proMonthly)} درهم. أو ${usd(PRICE.proYearly)} سنوياً.`,
        features: [
          "جهازان نشطان ضمن السعر",
          `${usd(PRICE.extraDevice)} شهرياً لكل جهاز نشط إضافي`,
          `${PRICE.aiIncluded} إجراء ذكاء اصطناعي و${PRICE.minutesIncluded} دقيقة للوكلاء السحابيين شهرياً`,
          "سجل لمدة سنة، وفحص TLS، ودعم أولوية عبر البريد",
          `حد إنفاق ${usd(PRICE.proCapUsd)} شهرياً افتراضياً، ويمكنك تغييره`,
        ],
        cta: "ابدأ مجاناً وارتقِ متى شئت",
        ctaKind: "start",
      },
      company: {
        name: "الشركات",
        tagline: "للفرق التي تريد رؤية كل إجراء للذكاء الاصطناعي.",
        price: usd(PRICE.seat),
        unit: "لكل مقعد نشط شهرياً",
        alt: `نحو ${aed(PRICE.seat)} درهم. بحد أدنى ${PRICE.minSeats} مقاعد. أو ${usd(PRICE.seatYearly)} لكل مقعد سنوياً.`,
        features: [
          "أجهزة غير محدودة",
          `${PRICE.aiIncluded} إجراء ذكاء اصطناعي و${PRICE.minutesIncluded} دقيقة للوكلاء السحابيين لكل مقعد، مشتركة بين الفريق`,
          "تسجيل دخول موحّد، ومزامنة AD وEntra، وأدوار وموافقات",
          "يحدد المسؤول حد الإنفاق الشهري",
          `تجربة لمدة ${PRICE.trialDays} يوماً ببطاقة، وإلغاء بنقرة واحدة`,
        ],
        cta: `ابدأ تجربة ${PRICE.trialDays} يوماً`,
        ctaKind: "trial",
        note: "الفاتورة والتحويل البنكي متاحان للشركات والجهات الحكومية.",
      },
      enterprise: {
        name: "المؤسسات والحكومة",
        tagline: "للجهات الخاضعة للتنظيم والمؤسسات الكبيرة.",
        price: null,
        unit: "تواصل معنا",
        features: [
          "عقد سنوي مع رصيد أرصدة مشترك",
          "فواتير دون حاجة إلى بطاقة",
          "المركز والاتحاد بين البيئات",
          "تثبيت معزول عن الشبكة وللجهات الحكومية",
          "إثبات TPM وحزم الامتثال",
        ],
        cta: "تواصل معنا",
        ctaKind: "talk",
      },
    },
    examplesTitle: "كم تكلّف",
    examples: [
      {
        label: "حاسوبان محمولان، استخدام عادي",
        price: `${usd(proMonthly(2))} شهرياً`,
        detail: "خطة Pro تشمل جهازين نشطين و300 إجراء ذكاء اصطناعي.",
      },
      {
        label: "4 أجهزة، كلها مستخدمة",
        price: `${usd(proMonthly(4))} شهرياً`,
        detail: `${usd(PRICE.proMonthly)} وجهازان نشطان إضافيان بسعر ${usd(PRICE.extraDevice)} لكل منهما.`,
      },
      {
        label: "شهر كثيف بالذكاء الاصطناعي، 1,200 إجراء",
        price: `${usd(proMonthly(2) + PRICE.pack * creditPacksFor(1200, PRICE.aiIncluded))}`,
        detail: `${usd(PRICE.proMonthly)} وحزمة أرصدة واحدة بسعر ${usd(PRICE.pack)} للإجراءات الـ900 فوق الحصة.`,
      },
      {
        label: "فريق من 5 أشخاص",
        price: `${usd(companyMonthly(5))} شهرياً`,
        detail: `5 مقاعد نشطة بسعر ${usd(PRICE.seat)}، مع 1,500 إجراء ذكاء اصطناعي مشتركة.`,
      },
      {
        label: "فريق من شخصين",
        price: `${usd(companyMonthly(2))} شهرياً`,
        detail: `خطة الشركات تبدأ من ${PRICE.minSeats} مقاعد.`,
      },
    ],
    faqTitle: "أسئلة",
    faq: [
      {
        q: "ما الذي يُعد نشطاً؟",
        a: `الجهاز أو المقعد المتصل في ${PRICE.activeDays} أيام مختلفة أو أكثر خلال الشهر. تُحتسب النشطة فقط. الحاسوب الذي تفتحه مرة واحدة لا يُحتسب، والحماية مفعّلة لكل جهاز في كل الأحوال.`,
      },
      {
        q: "ما هو إجراء الذكاء الاصطناعي؟",
        a: "إجابة واحدة من ميزة ذكاء اصطناعي في منار، مثل مساعد لوحة التحكم أو ملخص حادثة أو اقتراح سياسة. فحوصات الحماية ليست إجراءات ذكاء اصطناعي ولا تُحتسب أبداً.",
      },
      {
        q: "ماذا يحدث عندما تنفد الأرصدة؟",
        a: "تبقى الحماية تعمل. الحظر والموافقات وخزنة الأسرار وسجل التدقيق لا تتوقف أبداً. تتوقف مؤقتاً فقط إجابات الذكاء الاصطناعي والوكلاء السحابيون فوق حصتك حتى تضيف أرصدة أو يبدأ الشهر التالي.",
      },
      {
        q: "كيف تعمل الحدود والتنبيهات؟",
        a: `لخطة Pro حد شهري لإنفاق الأرصدة قدره ${usd(PRICE.proCapUsd)} افتراضياً، ويمكنك رفعه أو خفضه. في خطة الشركات يحدده المسؤول. نرسل إليك بريداً ونعرض تنبيهاً عند 50% و80% و100% من حصتك ومن حدّك. الشحن التلقائي متوقف ما لم تفعّله.`,
      },
      {
        q: "كم تدوم الأرصدة؟",
        a: `${usd(PRICE.pack)} تشتري 1,000 رصيد صالحة لمدة 12 شهراً. الرصيد الواحد يساوي إجراء ذكاء اصطناعي واحداً أو دقيقة واحدة لوكيل سحابي.`,
      },
      {
        q: "ماذا يحدث بعد التجربة المجانية؟",
        a: "تنتهي التجربة الشخصية بعد 14 يوماً وتنتقل إلى الخطة المجانية دون أي تحصيل: تحتفظ بجهاز واحد والحماية و20 إجراء ذكاء اصطناعي شهرياً وسجل لمدة 30 يوماً، وتواصل أجهزتك الأخرى حظر الإجراءات الخطرة. تجربة الشركات تحتاج إلى بطاقة وتتحول إلى خطة مدفوعة ما لم تلغِها؛ نذكّرك في الأيام 7 و12 و14.",
      },
      {
        q: "ماذا لو فشل الدفع؟",
        a: "يبقى كل شيء يعمل لمدة 14 يوماً أثناء إعادة محاولة الدفع. بعدها تنتقل مساحة العمل إلى حدود الخطة المجانية مع بقاء الحماية مفعّلة، ولا تُحذف أي بيانات بسبب عدم الدفع خلال 90 يوماً.",
      },
    ],
  },
}
