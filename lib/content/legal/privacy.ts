import type { Locale } from "@/lib/i18n/config"

import type { LegalDoc } from "../schema.ts"

const ENTITY_EN = "[Registered entity name and address to be confirmed]"
const ENTITY_AR = "[اسم الجهة المسجلة وعنوانها قيد التأكيد]"
const RETENTION_EN = "[Retention period for demo request emails to be confirmed]"
const RETENTION_AR = "[مدة الاحتفاظ برسائل طلبات العرض التوضيحي قيد التأكيد]"
const LOGS_EN = "[Retention period for server access logs to be confirmed]"
const LOGS_AR = "[مدة الاحتفاظ بسجلات الوصول إلى الخادم قيد التأكيد]"
const LAW_EN = "[Applicable data protection law and supervisory authority to be confirmed]"
const LAW_AR = "[قانون حماية البيانات المطبق والجهة الرقابية المختصة قيد التأكيد]"

export const privacy: Record<Locale, LegalDoc> = {
  en: {
    title: "Privacy notice",
    description:
      "How VAX handles personal data on the Manar website: demo requests, server logs, optional analytics, and your choices.",
    updated: "2026-09-25",
    placeholders: [ENTITY_EN, RETENTION_EN, LOGS_EN, LAW_EN],
    sections: [
      {
        id: "who-we-are",
        heading: "Who we are",
        blocks: [
          "This website presents Manar, a VAX product. VAX is responsible for the personal data collected through this website.",
          `Controller: VAX, ${ENTITY_EN}. Website: https://vax.sh. Contact: nofal@vax.sh.`,
          "This notice covers the public website at manar.vax.sh only. It does not cover the Manar product itself, which is governed by the agreement with each customer.",
        ],
      },
      {
        id: "what-we-collect",
        heading: "What we collect",
        blocks: [
          "We collect only what the website needs to work and what you choose to send us.",
          {
            list: [
              "Demo request form: your full name, work email, organization, and optionally your role, deployment interest, and a message.",
              "Campaign details: if you accepted analytics, the campaign tags from the link you arrived by (utm_source, utm_medium, utm_campaign, utm_term, utm_content) are attached to a demo request you submit in the same browser tab.",
              "Technical data: your IP address, the page requested, the time, and your browser's user agent, as recorded by our web servers and our network provider.",
              "Optional analytics: page views and page performance timings, only if you accept analytics.",
              "Preferences stored in your browser: your theme and your cookie choice. These stay on your device and are not sent to us.",
            ],
          },
          "Please do not include sensitive personal data in the message field.",
        ],
      },
      {
        id: "how-we-use",
        heading: "How we use it",
        blocks: [
          {
            list: [
              "To respond to your demo request and arrange a session. Basis: steps you asked us to take before a possible agreement, and our legitimate interest in answering business enquiries.",
              "To keep the website secure and available, including limiting repeated form submissions (at most 5 requests per 10 minutes from one IP address). Basis: our legitimate interest in protecting the service.",
              "To understand how the website is used, only with your consent. You can withdraw consent at any time.",
            ],
          },
          "We do not sell personal data, use it for advertising, or make automated decisions about you based on it.",
        ],
      },
      {
        id: "who-we-share-with",
        heading: "Who we share it with",
        blocks: [
          "We use a small number of service providers who process data on our behalf:",
          {
            table: {
              head: ["Provider", "Purpose", "Data"],
              rows: [
                ["Resend", "Delivers demo request emails to our team", "Form fields and campaign details you submit"],
                ["Cloudflare", "Network delivery, security, and, with consent, Web Analytics", "IP address, request details, analytics events"],
                ["VAX infrastructure", "Hosts the website on servers operated by VAX", "Server and access logs"],
              ],
            },
          },
          "We may also disclose data where the law requires it. Some providers may process data outside your country. Where that happens, we rely on the safeguards the provider offers.",
        ],
      },
      {
        id: "retention",
        heading: "How long we keep it",
        blocks: [
          {
            list: [
              `Demo request emails: ${RETENTION_EN}. We delete requests that do not lead to further contact once they are no longer needed.`,
              `Server access logs: ${LOGS_EN}.`,
              "Rate limiting counters are held in server memory for 10 minutes and are lost when the server restarts.",
              "Campaign details in your browser are cleared when you close the tab.",
            ],
          },
        ],
      },
      {
        id: "analytics-and-storage",
        heading: "Analytics and browser storage",
        blocks: [
          "The website itself sets no cookies. Analytics are off until you accept them, and the analytics script is not loaded before that. You can change your choice at any time with Cookie settings in the footer.",
          "Our cookie and storage policy lists every item we store in your browser, why, and for how long.",
        ],
      },
      {
        id: "your-rights",
        heading: "Your rights",
        blocks: [
          "Depending on the law that applies to you, you may ask to access, correct, or delete your personal data, object to or restrict its use, or receive a copy of it. You can withdraw consent to analytics at any time without affecting earlier processing.",
          "To make a request, email nofal@vax.sh. We may need to confirm your identity before acting on it.",
          `If you are unhappy with how we handled your data, you may complain to a data protection authority. ${LAW_EN}`,
        ],
      },
      {
        id: "changes",
        heading: "Changes to this notice",
        blocks: [
          "We update this notice when our data handling changes. The date at the top shows the last real change.",
        ],
      },
    ],
  },
  ar: {
    title: "إشعار الخصوصية",
    description:
      "كيف تتعامل VAX مع البيانات الشخصية على موقع منار: طلبات العرض التوضيحي وسجلات الخادم والتحليلات الاختيارية وخياراتك.",
    updated: "2026-09-25",
    placeholders: [ENTITY_AR, RETENTION_AR, LOGS_AR, LAW_AR],
    sections: [
      {
        id: "who-we-are",
        heading: "من نحن",
        blocks: [
          "يعرض هذا الموقع منصة منار، وهي أحد منتجات VAX. وتتولى VAX مسؤولية البيانات الشخصية التي تُجمع عبر هذا الموقع.",
          `الجهة المسؤولة: VAX، ${ENTITY_AR}. الموقع الإلكتروني: https://vax.sh. للتواصل: nofal@vax.sh.`,
          "يقتصر هذا الإشعار على الموقع العام manar.vax.sh، ولا يشمل منصة منار نفسها التي تحكمها الاتفاقية المبرمة مع كل عميل.",
        ],
      },
      {
        id: "what-we-collect",
        heading: "البيانات التي نجمعها",
        blocks: [
          "لا نجمع إلا ما يحتاجه الموقع ليعمل، وما تختار أن ترسله إلينا.",
          {
            list: [
              "نموذج طلب العرض التوضيحي: اسمك الكامل وبريدك الإلكتروني المهني والجهة التي تعمل بها، واختياريًا دورك ونوع النشر الذي يهمك ورسالة منك.",
              "بيانات الحملات: إذا وافقت على التحليلات، تُرفق وسوم الحملة الواردة في الرابط الذي وصلت منه (utm_source وutm_medium وutm_campaign وutm_term وutm_content) بطلب العرض الذي ترسله من علامة التبويب نفسها.",
              "البيانات التقنية: عنوان IP والصفحة المطلوبة والوقت ونوع المتصفح، كما تسجلها خوادمنا ومزود الشبكة.",
              "التحليلات الاختيارية: مشاهدات الصفحات وقياسات أداء التحميل، ولا تُجمع إلا بموافقتك.",
              "تفضيلات محفوظة في متصفحك: المظهر الذي اخترته وخيارك بشأن ملفات تعريف الارتباط. تبقى هذه على جهازك ولا تُرسل إلينا.",
            ],
          },
          "نرجو ألا تضمّن حقل الرسالة أي بيانات شخصية حساسة.",
        ],
      },
      {
        id: "how-we-use",
        heading: "كيف نستخدمها",
        blocks: [
          {
            list: [
              "للرد على طلب العرض التوضيحي وترتيب الجلسة. الأساس: خطوات طلبتها منا قبل أي اتفاق محتمل، ومصلحتنا المشروعة في الرد على الاستفسارات التجارية.",
              "لحماية الموقع وضمان توفره، بما في ذلك الحد من تكرار إرسال النموذج (5 طلبات كحد أقصى كل 10 دقائق من عنوان IP واحد). الأساس: مصلحتنا المشروعة في حماية الخدمة.",
              "لفهم طريقة استخدام الموقع، وذلك بموافقتك فقط. ويمكنك سحب موافقتك في أي وقت.",
            ],
          },
          "لا نبيع البيانات الشخصية، ولا نستخدمها لأغراض إعلانية، ولا نتخذ بشأنك قرارات آلية بناءً عليها.",
        ],
      },
      {
        id: "who-we-share-with",
        heading: "مع من نشاركها",
        blocks: [
          "نستعين بعدد محدود من مزودي الخدمات الذين يعالجون البيانات نيابة عنا:",
          {
            table: {
              head: ["المزود", "الغرض", "البيانات"],
              rows: [
                ["Resend", "إيصال رسائل طلبات العرض التوضيحي إلى فريقنا", "حقول النموذج وبيانات الحملة التي ترسلها"],
                ["Cloudflare", "توصيل المحتوى عبر الشبكة والحماية، والتحليلات عند موافقتك", "عنوان IP وتفاصيل الطلب وأحداث التحليلات"],
                ["البنية التحتية لـ VAX", "استضافة الموقع على خوادم تشغّلها VAX", "سجلات الخادم وسجلات الوصول"],
              ],
            },
          },
          "وقد نفصح عن البيانات إذا ألزمنا القانون بذلك. وقد يعالج بعض المزودين البيانات خارج بلدك، وفي هذه الحالة نعتمد على الضمانات التي يقدمها المزود.",
        ],
      },
      {
        id: "retention",
        heading: "مدة الاحتفاظ",
        blocks: [
          {
            list: [
              `رسائل طلبات العرض التوضيحي: ${RETENTION_AR}. ونحذف الطلبات التي لا يتبعها تواصل إضافي متى انتفت الحاجة إليها.`,
              `سجلات الوصول إلى الخادم: ${LOGS_AR}.`,
              "تُحفظ عدادات الحد من الطلبات في ذاكرة الخادم لمدة 10 دقائق، وتُفقد عند إعادة تشغيله.",
              "تُحذف بيانات الحملة من متصفحك عند إغلاق علامة التبويب.",
            ],
          },
        ],
      },
      {
        id: "analytics-and-storage",
        heading: "التحليلات والتخزين في المتصفح",
        blocks: [
          "لا يضع الموقع نفسه أي ملفات تعريف ارتباط. وتبقى التحليلات معطلة حتى توافق عليها، ولا يُحمَّل برنامجها قبل ذلك. ويمكنك تغيير خيارك في أي وقت من خلال إعدادات ملفات تعريف الارتباط في أسفل الصفحة.",
          "تسرد سياسة ملفات تعريف الارتباط والتخزين كل عنصر نحفظه في متصفحك، والغرض منه، ومدة بقائه.",
        ],
      },
      {
        id: "your-rights",
        heading: "حقوقك",
        blocks: [
          "بحسب القانون الذي ينطبق عليك، يحق لك أن تطلب الاطلاع على بياناتك الشخصية أو تصحيحها أو حذفها، أو الاعتراض على استخدامها أو تقييده، أو الحصول على نسخة منها. كما يمكنك سحب موافقتك على التحليلات في أي وقت دون أن يؤثر ذلك في المعالجة التي سبقت السحب.",
          "لتقديم طلب، راسلنا على nofal@vax.sh. وقد نحتاج إلى التحقق من هويتك قبل تنفيذه.",
          `وإذا لم تكن راضيًا عن طريقة تعاملنا مع بياناتك، فيمكنك تقديم شكوى إلى جهة حماية البيانات المختصة. ${LAW_AR}`,
        ],
      },
      {
        id: "changes",
        heading: "التعديلات على هذا الإشعار",
        blocks: ["نحدّث هذا الإشعار عندما تتغير طريقة تعاملنا مع البيانات. ويبيّن التاريخ في أعلى الصفحة آخر تعديل فعلي."],
      },
    ],
  },
}
