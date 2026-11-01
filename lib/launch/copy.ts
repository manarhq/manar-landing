/** Launch copy that is not CMS-managed: header, hero, footer, section labels. EN and AR share one shape. */
import type { Locale } from "../i18n/config.ts"

export type LaunchCopy = {
  nav: { coverage: string; pricing: string; docs: string; github: string; signIn: string; startFree: string; status: string }
  hero: {
    pill: string
    titleBefore: string
    titleEm: string
    titleAfter: string
    lede: string
    primary: string
    secondary: string
    fine: string
    feed: {
      label: string
      head: string
      sample: string
      rows: { time: string; before: string; code: string; after: string; state: "allowed" | "asks" | "blocked" }[]
      states: { allowed: string; asks: string; blocked: string }
    }
  }
  footer: {
    product: string
    legal: string
    resources: string
    terms: string
    privacy: string
    aup: string
    cookies: string
    cookieSettings: string
    contact: string
    discord: string
    tagline: string
    fixio: string
    rights: string
  }
  /** Launch offer counter. `left` has {remaining} and {total}. */
  offer: { title: string; left: string; ended: string }
  closing: { title: string; body: string; cta: string }
  docs: { title: string; body: string; menu: string; next: string; updated: string; pages: Record<DocSlug, { title: string; description: string }> }
}

export const docSlugs = ["quickstart", "install", "what-changes", "what-we-collect", "coverage", "billing", "open-source"] as const
export type DocSlug = (typeof docSlugs)[number]

export const launchCopy: Record<Locale, LaunchCopy> = {
  en: {
    nav: {
      coverage: "Coverage",
      pricing: "Pricing",
      docs: "Docs",
      github: "GitHub",
      signIn: "Sign in",
      startFree: "Start free",
      status: "Status",
    },
    hero: {
      pill: "Free for personal use · open source core",
      titleBefore: "Every AI action has an ",
      titleEm: "owner",
      titleAfter: ".",
      lede: "Manar watches the AI tools on your computer, asks you before anything risky, and keeps a signed record of everything they did.",
      primary: "Start free",
      secondary: "Try it with sample data",
      fine: "Sign in with Microsoft, GitHub or email. Windows 10/11 and Linux.",
      feed: {
        label: "Sample live activity",
        head: "Live on Work laptop",
        sample: "sample",
        states: { allowed: "allowed", asks: "asks you", blocked: "blocked" },
        rows: [
          { time: "10:42:07", before: "Claude Code ran ", code: "npm test", after: "", state: "allowed" },
          { time: "10:42:11", before: "Cursor wants to read ", code: "~/.aws/credentials", after: "", state: "asks" },
          { time: "10:41:58", before: "Codex CLI tried to send ", code: ".env", after: " to pastebin.com", state: "blocked" },
          { time: "10:41:30", before: "ChatGPT opened ", code: "github.com/acme/shop", after: "", state: "allowed" },
        ],
      },
    },
    footer: {
      product: "Product",
      legal: "Legal",
      resources: "Resources",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      aup: "Acceptable Use",
      cookies: "Cookie policy",
      cookieSettings: "Cookie settings",
      contact: "Contact",
      discord: "Community on Discord",
      tagline: "Every AI action has an owner.",
      fixio: "Manar is a product of Fixio.",
      rights: "All rights reserved.",
    },
    offer: {
      title: "Launch offer: Pro free for 3 months, no card.",
      left: "{remaining} of {total} left",
      ended: "The launch offer has ended.",
    },
    closing: {
      title: "Bring one action that worries you.",
      body: "Start free in a minute, or talk to us about your company.",
      cta: "Start free",
    },
    docs: {
      title: "Documentation",
      body: "Install Manar, see exactly what it changes on your computer, and what it collects.",
      menu: "Docs",
      next: "Next",
      updated: "Last updated 31 October 2026",
      pages: {
        quickstart: { title: "Quickstart", description: "Sign in, add your first device, and answer your first approval in about five minutes." },
        install: { title: "Install and uninstall", description: "The one-line installers for Windows and Linux, and the one-line uninstallers." },
        "what-changes": { title: "What Manar changes on your computer", description: "Every file and setting Manar edits, per tool, with backups and how to restore them." },
        "what-we-collect": { title: "What Manar collects", description: "The data Manar records, where it is kept, how long, and how to export or delete it." },
        coverage: { title: "Coverage", description: "Which AI tools Manar sees, can approve or deny, and can block from secrets." },
        billing: { title: "Billing FAQ", description: "Plans, limits, billable users, VAT, trials, and what happens when you downgrade." },
        "open-source": { title: "Open source and licence", description: "Manar is Apache-2.0 open core. What is open, what is not, and how to contribute." },
      },
    },
  },
  ar: {
    nav: {
      coverage: "التغطية",
      pricing: "الأسعار",
      docs: "الوثائق",
      github: "GitHub",
      signIn: "تسجيل الدخول",
      startFree: "ابدأ مجاناً",
      status: "الحالة",
    },
    hero: {
      pill: "مجاني للاستخدام الشخصي · نواة مفتوحة المصدر",
      titleBefore: "لكل إجراء للذكاء الاصطناعي ",
      titleEm: "مسؤول",
      titleAfter: ".",
      lede: "يراقب منار أدوات الذكاء الاصطناعي على حاسوبك، ويسألك قبل أي إجراء محفوف بالمخاطر، ويحتفظ بسجل موقّع بكل ما فعلته.",
      primary: "ابدأ مجاناً",
      secondary: "جرّبه ببيانات تجريبية",
      fine: "سجّل الدخول عبر Microsoft أو GitHub أو البريد الإلكتروني. يعمل على ويندوز 10/11 ولينكس.",
      feed: {
        label: "نشاط مباشر تجريبي",
        head: "مباشر على حاسوب العمل",
        sample: "تجريبي",
        states: { allowed: "مسموح", asks: "يسألك", blocked: "محجوب" },
        rows: [
          { time: "10:42:07", before: "شغّل Claude Code الأمر ", code: "npm test", after: "", state: "allowed" },
          { time: "10:42:11", before: "يريد Cursor قراءة ", code: "~/.aws/credentials", after: "", state: "asks" },
          { time: "10:41:58", before: "حاول Codex CLI إرسال ", code: ".env", after: " إلى pastebin.com", state: "blocked" },
          { time: "10:41:30", before: "فتح ChatGPT ", code: "github.com/acme/shop", after: "", state: "allowed" },
        ],
      },
    },
    footer: {
      product: "المنتج",
      legal: "القانونية",
      resources: "المراجع",
      terms: "شروط الخدمة",
      privacy: "سياسة الخصوصية",
      aup: "الاستخدام المقبول",
      cookies: "سياسة ملفات تعريف الارتباط",
      cookieSettings: "إعدادات ملفات تعريف الارتباط",
      contact: "التواصل",
      discord: "المجتمع على Discord",
      tagline: "لكل إجراء للذكاء الاصطناعي مسؤول.",
      fixio: "منار منتج من Fixio.",
      rights: "جميع الحقوق محفوظة.",
    },
    offer: {
      title: "عرض الإطلاق: Pro مجاناً لمدة 3 أشهر، دون بطاقة.",
      left: "متبقٍ {remaining} من {total}",
      ended: "انتهى عرض الإطلاق.",
    },
    closing: {
      title: "احضر إجراءً واحداً يقلقك.",
      body: "ابدأ مجاناً خلال دقيقة، أو تحدث معنا عن شركتك.",
      cta: "ابدأ مجاناً",
    },
    docs: {
      title: "الوثائق",
      body: "ثبّت منار، وتعرّف على ما يغيّره بالضبط في حاسوبك وما يجمعه.",
      menu: "الوثائق",
      next: "التالي",
      updated: "آخر تحديث 31 أكتوبر 2026",
      pages: {
        quickstart: { title: "البدء السريع", description: "سجّل الدخول وأضف جهازك الأول وأجب عن أول طلب موافقة خلال نحو خمس دقائق." },
        install: { title: "التثبيت والإزالة", description: "أوامر التثبيت بسطر واحد لويندوز ولينكس، وأوامر الإزالة بسطر واحد." },
        "what-changes": { title: "ما الذي يغيّره منار في حاسوبك", description: "كل ملف وإعداد يعدّله منار، لكل أداة، مع النسخ الاحتياطية وطريقة الاستعادة." },
        "what-we-collect": { title: "ما الذي يجمعه منار", description: "البيانات التي يسجّلها منار، وأين تُحفظ، ولكم من الوقت، وكيف تصدّرها أو تحذفها." },
        coverage: { title: "التغطية", description: "أي أدوات الذكاء الاصطناعي يراها منار ويمكنه الموافقة عليها أو رفضها أو حجب الأسرار عنها." },
        billing: { title: "أسئلة الفوترة الشائعة", description: "الخطط والحدود والمستخدمون المحتسبون والضريبة والتجارب وما يحدث عند خفض الخطة." },
        "open-source": { title: "المصدر المفتوح والترخيص", description: "منار نواة مفتوحة بترخيص Apache-2.0. ما هو مفتوح وما ليس كذلك وكيف تساهم." },
      },
    },
  },
}
