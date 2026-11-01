import type { Locale } from "../../i18n/config.ts"

import type { LegalDoc } from "../schema.ts"

export const cookies: Record<Locale, LegalDoc> = {
  en: {
    title: "Cookie and storage policy",
    description:
      "Every cookie and browser storage item used on the Manar website, why it is used, how long it lasts, and how to change your choice.",
    updated: "2026-10-31",
    sections: [
      {
        id: "summary",
        heading: "In short",
        blocks: [
          "The Manar website sets no cookies for visitors, and the optional analytics run without cookies. It stores a few small items in your browser to remember your choices. Analytics are optional, off by default, and only load after you accept them.",
        ],
      },
      {
        id: "what-we-store",
        heading: "What we store",
        blocks: [
          {
            table: {
              head: ["Name", "Type", "Purpose", "Duration", "Category"],
              rows: [
                ["manar-theme", "Local storage", "Remembers your light, dark, or system theme choice", "Until you change it or clear site data", "Necessary"],
                ["manar-consent", "Local storage", "Records whether you accepted analytics, and when", "12 months, then we ask again", "Necessary"],
                ["manar-utm", "Session storage", "Keeps campaign tags from the link you arrived by, so they can be attached to a demo request you submit", "Until you close the tab", "Analytics (only with consent)"],
                ["__prerender_bypass, manar-preview", "Cookies set by this website, for Fixio staff only", "Let staff preview unpublished content from the editor. Never set for other visitors", "Until the browser closes; manar-preview at most 1 hour", "Necessary"],
                ["__cf_bm", "Cookie set by Cloudflare", "Tells people apart from automated traffic when bot protection runs", "30 minutes", "Necessary"],
                ["cf_clearance", "Cookie set by Cloudflare", "Remembers that a security challenge was passed, so it is not shown again", "As set in our Cloudflare challenge settings, 30 minutes by default", "Necessary"],
              ],
            },
          },
          "Local and session storage stay in your browser. They are not sent to our servers with each request, unlike cookies. Campaign tags are limited to utm_source, utm_medium, utm_campaign, utm_term, and utm_content, each up to 100 characters, and reach us only if you submit a demo request.",
        ],
      },
      {
        id: "analytics",
        heading: "Optional analytics",
        blocks: [
          "If you accept analytics, we load PostHog, hosted in the European Union (eu.i.posthog.com). It runs in cookieless mode: it sets no cookies, writes nothing to your browser storage and keeps its identifier in memory for that page view only. It records page views and basic usage events to help us improve Manar. It does not build a profile of you across other websites. The console at console-manar.vax.sh is separate: it sets the cookies needed to keep you signed in.",
          "If you reject analytics, the script is never loaded and no campaign tags are stored. If your browser sends a Global Privacy Control or Do Not Track signal, we treat it as a rejection and do not show the banner.",
        ],
      },
      {
        id: "network-provider",
        heading: "Cookies from our network provider",
        blocks: [
          "The website is delivered through Cloudflare. When Cloudflare's bot protection is active for a request, Cloudflare may set the strictly necessary security cookies listed above to tell people apart from automated traffic. They are not used for analytics or advertising, and they are set by Cloudflare rather than by our website.",
          "On the meeting booking pages only, a Cloudflare Turnstile security check runs in a frame from challenges.cloudflare.com before a booking is sent. It is used only for that check.",
        ],
      },
      {
        id: "your-choices",
        heading: "Your choices",
        blocks: [
          {
            list: [
              "Change or withdraw your analytics choice at any time with Cookie settings in the footer. Withdrawing consent stops analytics from loading on your next page view and deletes stored campaign tags.",
              "You can also clear this website's data in your browser settings. We will then ask for your choice again.",
            ],
          },
          "Questions about this policy can be sent to support@fixio.ae.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة ملفات تعريف الارتباط والتخزين",
    description:
      "كل ملف تعريف ارتباط وكل عنصر تخزين يستخدمه موقع منار، والغرض منه، ومدة بقائه، وكيف تغيّر خيارك.",
    updated: "2026-10-31",
    sections: [
      {
        id: "summary",
        heading: "باختصار",
        blocks: [
          "لا يضع موقع منار أي ملفات تعريف ارتباط للزوار، بل يحفظ في متصفحك عناصر صغيرة قليلة ليتذكر خياراتك. أما التحليلات فهي اختيارية ومعطلة افتراضيًا، ولا تُحمَّل إلا بعد موافقتك.",
        ],
      },
      {
        id: "what-we-store",
        heading: "ما نحفظه",
        blocks: [
          {
            table: {
              head: ["الاسم", "النوع", "الغرض", "المدة", "الفئة"],
              rows: [
                ["manar-theme", "التخزين المحلي", "يتذكر اختيارك للمظهر الفاتح أو الداكن أو مظهر النظام", "حتى تغيّره أو تمسح بيانات الموقع", "ضروري"],
                ["manar-consent", "التخزين المحلي", "يسجّل ما إذا كنت قد وافقت على التحليلات، ومتى", "12 شهرًا، ثم نسألك مجددًا", "ضروري"],
                ["manar-utm", "تخزين الجلسة", "يحفظ وسوم الحملة من الرابط الذي وصلت منه لإرفاقها بطلب العرض التوضيحي إن أرسلته", "حتى تغلق علامة التبويب", "تحليلات (بموافقتك فقط)"],
                ["__prerender_bypass وmanar-preview", "ملفات تعريف ارتباط يضعها هذا الموقع لموظفي Fixio فقط", "تتيح للموظفين معاينة المحتوى غير المنشور من المحرر، ولا تُوضع لأي زائر آخر", "حتى إغلاق المتصفح، وmanar-preview لمدة ساعة كحد أقصى", "ضروري"],
                ["__cf_bm", "ملف تعريف ارتباط تضعه Cloudflare", "يميّز الزوار من الحركة الآلية عند تشغيل الحماية من برامج الروبوت", "30 دقيقة", "ضروري"],
                ["cf_clearance", "ملف تعريف ارتباط تضعه Cloudflare", "يتذكر أنك اجتزت التحقق الأمني حتى لا يُعرض عليك مجددًا", "بحسب إعدادات التحقق لدينا في Cloudflare، 30 دقيقة افتراضيًا", "ضروري"],
              ],
            },
          },
          "يبقى التخزين المحلي وتخزين الجلسة داخل متصفحك، ولا يُرسلان إلى خوادمنا مع كل طلب كما يحدث مع ملفات تعريف الارتباط. وتقتصر وسوم الحملة على utm_source وutm_medium وutm_campaign وutm_term وutm_content، بحد أقصى 100 حرف لكل منها، ولا تصل إلينا إلا إذا أرسلت طلب عرض توضيحي.",
        ],
      },
      {
        id: "analytics",
        heading: "التحليلات الاختيارية",
        blocks: [
          "إذا وافقت على التحليلات، نحمّل PostHog المستضافة في الاتحاد الأوروبي (eu.i.posthog.com). وهي تعمل بوضع بلا ملفات تعريف ارتباط: لا تضع ملفات ولا تكتب شيئاً في تخزين متصفحك وتبقي معرّفها في الذاكرة طوال مشاهدة الصفحة فقط. وتسجّل مشاهدات الصفحات وأحداث استخدام أساسية لنحسّن منار، ولا تبني ملفاً عنك عبر المواقع الأخرى. أما لوحة التحكم على console-manar.vax.sh فمنفصلة، وتضع ملفات تعريف الارتباط اللازمة لإبقائك مسجّلاً للدخول.",
          "وإذا رفضت التحليلات، فلن يُحمَّل برنامجها أبدًا ولن تُحفظ أي وسوم حملات. وإذا أرسل متصفحك إشارة التحكم العالمي في الخصوصية أو عدم التتبّع، نعدّها رفضًا ولا نعرض الشريط.",
        ],
      },
      {
        id: "network-provider",
        heading: "ملفات تعريف الارتباط من مزود الشبكة",
        blocks: [
          "يُقدَّم الموقع عبر شبكة Cloudflare. وعندما تكون الحماية من برامج الروبوت مفعّلة لطلب ما، قد تضع Cloudflare ملفات تعريف الارتباط الأمنية الضرورية المذكورة أعلاه للتمييز بين الزوار والحركة الآلية. ولا تُستخدم هذه الملفات للتحليلات أو الإعلانات، وتضعها Cloudflare لا موقعنا.",
          "وفي صفحات حجز الاجتماعات فقط، يجري تحقق أمني من Cloudflare Turnstile داخل إطار من challenges.cloudflare.com قبل إرسال الحجز، ولا يُستخدم إلا لهذا التحقق.",
        ],
      },
      {
        id: "your-choices",
        heading: "خياراتك",
        blocks: [
          {
            list: [
              "يمكنك تغيير خيارك بشأن التحليلات أو سحبه في أي وقت من خلال إعدادات ملفات تعريف الارتباط في أسفل الصفحة. ويؤدي سحب الموافقة إلى إيقاف تحميل التحليلات من الصفحة التالية وحذف وسوم الحملة المحفوظة.",
              "ويمكنك أيضًا مسح بيانات هذا الموقع من إعدادات متصفحك، وعندها سنسألك عن خيارك من جديد.",
            ],
          },
          "للاستفسار عن هذه السياسة، راسلنا على support@fixio.ae.",
        ],
      },
    ],
  },
}
