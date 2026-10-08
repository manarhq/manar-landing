import type { Locale } from "@/lib/i18n/config"

import type { LegalDoc } from "../schema.ts"

/*
 * Structured for the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data
 * (PDPL). Draft for review by counsel before go-live. The bracketed constants are values the
 * founder is confirming; they are listed in the page's draft notice and replaced, never invented.
 */
const ENTITY_EN = "[Registered address, licence number and issuing authority to be confirmed]"
const ENTITY_AR = "[العنوان المسجل ورقم الرخصة وجهة الإصدار قيد التأكيد]"
const RETENTION_EN = "[Retention period for demo requests and meeting bookings to be confirmed]"
const RETENTION_AR = "[مدة الاحتفاظ بطلبات العرض التوضيحي وحجوزات الاجتماعات قيد التأكيد]"
const LOGS_EN = "[Retention period for server access logs to be confirmed]"
const LOGS_AR = "[مدة الاحتفاظ بسجلات الوصول إلى الخادم قيد التأكيد]"
const LAW_EN = "[Confirm that the PDPL, and not a free-zone data protection law, applies]"
const LAW_AR = "[تأكيد أن المرسوم بقانون الاتحادي لحماية البيانات الشخصية هو المطبق، وليس قانونًا لمنطقة حرة]"

export const privacy: Record<Locale, LegalDoc> = {
  en: {
    title: "Privacy notice",
    description:
      "How VAX handles personal data on the Manar website under the UAE PDPL: demo requests, meeting bookings, logs, optional analytics and your rights.",
    updated: "2026-10-09",
    placeholders: [ENTITY_EN, RETENTION_EN, LOGS_EN, LAW_EN],
    sections: [
      {
        id: "who-we-are",
        heading: "Who is responsible",
        blocks: [
          "This website presents Manar, a product of VAX. VAX is the controller of the personal data collected through this website.",
          `Controller: VAX Labs Cloud Computing Services L.L.C S.P.C, Abu Dhabi, United Arab Emirates. ${ENTITY_EN}. Contact for privacy questions and requests: nofal@vax.sh.`,
          "This notice covers the public website at manar.vax.sh, including demo requests and meeting bookings. It does not cover the Manar product, which is governed by the agreement with each customer.",
          "We apply the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL).",
        ],
      },
      {
        id: "what-we-collect",
        heading: "What we collect",
        blocks: [
          "We collect only what the website needs to work and what you choose to send us.",
          {
            list: [
              "Demo request form: your full name, work email and organisation, and optionally your role, where Manar would run, and a message.",
              "Meeting booking (/meet): your full name, work email, organisation and role, an optional note, the person you chose and the time you picked, and the result of a security check.",
              "Campaign tags: only if you accepted analytics, the tags in the link you arrived by (utm_source, utm_medium, utm_campaign, utm_term, utm_content) are attached to a demo request you send from the same browser tab.",
              "Technical data: your IP address, the page requested, the time and your browser's user agent, recorded by our servers and our network provider.",
              "Optional analytics: page views and loading times, only if you accept analytics.",
              "Choices stored in your browser: your theme and your privacy choice. They stay on your device and are not sent to us.",
            ],
          },
          "Please do not put sensitive personal data in the message or note fields.",
        ],
      },
      {
        id: "how-we-use",
        heading: "Why we use it and on what basis",
        blocks: [
          {
            table: {
              head: ["Purpose", "Data", "Basis"],
              rows: [
                [
                  "Reply to your demo request",
                  "Demo request form, campaign tags",
                  "Your consent, given when you send the form, and steps you ask us to take before a possible agreement",
                ],
                [
                  "Arrange, confirm and hold your meeting, and send the confirmation, invitation and change emails",
                  "Meeting booking details",
                  "Your consent, given when you book, and steps you ask us to take before a possible agreement",
                ],
                [
                  "Keep the website secure: block automated submissions and limit repeated requests (at most 5 demo requests per 10 minutes from one IP address)",
                  "Technical data, security check result",
                  "Necessary to provide the website and the service you asked for securely",
                ],
                ["Understand how the website is used", "Page views and loading times", "Your consent, which you can withdraw at any time"],
              ],
            },
          },
          "We do not send marketing emails, sell personal data, use it for advertising, or make automated decisions about you based on it.",
        ],
      },
      {
        id: "who-we-share-with",
        heading: "Who receives it",
        blocks: [
          "We use a small number of service providers who process data on our behalf, under written terms:",
          {
            table: {
              head: ["Provider", "Purpose", "Data", "Where"],
              rows: [
                ["Cloudflare", "Network delivery and security, the booking security check (Turnstile), and Web Analytics with your consent", "IP address, request details, security check, analytics events", "Cloudflare's global network, including outside the UAE"],
                ["Resend", "Delivers demo request emails to our team and booking emails to you", "Form and booking details, your email address", "United States"],
                ["Microsoft 365", "Calendar invitations for booked meetings, from the calendar of the person you book with", "Your name, email, organisation and the meeting time", "Microsoft data centres for the calendar's tenant"],
                ["VAX infrastructure", "Hosts the website and the booking service on servers operated by VAX", "Server and access logs, booking records", "Servers operated by VAX"],
              ],
            },
          },
          "We may also disclose data when the law requires it.",
        ],
      },
      {
        id: "transfers",
        heading: "Transfers outside the UAE",
        blocks: [
          "Cloudflare and Resend, and Microsoft where its data centres are outside the UAE, may process personal data outside the United Arab Emirates. We transfer data only as the PDPL allows: we rely on each provider's data processing terms, which bind it to protect the data and use it only on our instructions, and for analytics also on your consent.",
          "You can ask us for more detail about these safeguards at nofal@vax.sh.",
        ],
      },
      {
        id: "retention",
        heading: "How long we keep it",
        blocks: [
          {
            list: [
              `Demo requests and meeting bookings: ${RETENTION_EN}. We delete requests that lead to no further contact once they are no longer needed.`,
              "An unconfirmed booking is released when its hold runs out.",
              `Server access logs: ${LOGS_EN}.`,
              "Rate limit counters are held in server memory for 10 minutes and are lost when the server restarts.",
              "Campaign tags in your browser are cleared when you close the tab.",
            ],
          },
        ],
      },
      {
        id: "analytics-and-storage",
        heading: "Analytics and browser storage",
        blocks: [
          "The website itself sets no cookies. Analytics are off until you accept them, and the analytics script is not loaded before that. If your browser sends a Global Privacy Control or Do Not Track signal, we treat it as a refusal and do not ask. You can change your choice at any time with Cookie settings in the footer.",
          "Our cookie and storage policy lists every item stored in your browser, why, and for how long.",
        ],
      },
      {
        id: "your-rights",
        heading: "Your rights",
        blocks: [
          "Under the PDPL you can:",
          {
            list: [
              "get information about the data we hold about you and a copy of it;",
              "have inaccurate data corrected and incomplete data completed;",
              "have your data erased when it is no longer needed or when you withdraw consent;",
              "restrict how we use your data while a question about it is resolved;",
              "object to processing, including any automated processing;",
              "receive your data in a structured, machine-readable form and have it sent to another controller;",
              "withdraw your consent at any time, without affecting processing done before you withdrew it.",
            ],
          },
          "To use any of these rights, email nofal@vax.sh. We may need to confirm who you are before we act, and we answer within the time the law sets.",
          "If you are unhappy with how we handled your data, you can complain to the UAE Data Office.",
        ],
      },
      {
        id: "changes",
        heading: "Changes to this notice",
        blocks: ["We update this notice when our data handling changes. The date at the top shows the last real change."],
      },
    ],
  },
  ar: {
    title: "إشعار الخصوصية",
    description:
      "كيف تتعامل VAX مع البيانات الشخصية على موقع منار وفق القانون الإماراتي لحماية البيانات الشخصية: الطلبات والحجوزات والسجلات والتحليلات وحقوقك.",
    updated: "2026-10-09",
    placeholders: [ENTITY_AR, RETENTION_AR, LOGS_AR, LAW_AR],
    sections: [
      {
        id: "who-we-are",
        heading: "الجهة المسؤولة",
        blocks: [
          "يعرض هذا الموقع منار، وهي أحد منتجات VAX. وVAX هي المتحكم في البيانات الشخصية التي تُجمع عبر هذا الموقع.",
          `المتحكم: VAX Labs Cloud Computing Services L.L.C S.P.C، أبوظبي، الإمارات العربية المتحدة. ${ENTITY_AR}. للاستفسارات والطلبات المتعلقة بالخصوصية: nofal@vax.sh.`,
          "يشمل هذا الإشعار الموقع العام manar.vax.sh، بما في ذلك طلبات العرض التوضيحي وحجوزات الاجتماعات، ولا يشمل منتج منار الذي تحكمه الاتفاقية المبرمة مع كل عميل.",
          "نطبّق المرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية.",
        ],
      },
      {
        id: "what-we-collect",
        heading: "البيانات التي نجمعها",
        blocks: [
          "لا نجمع إلا ما يحتاجه الموقع ليعمل، وما تختار أن ترسله إلينا.",
          {
            list: [
              "نموذج طلب العرض التوضيحي: اسمك الكامل وبريدك الإلكتروني للعمل وجهتك، واختياريًا منصبك ومكان تشغيل منار ورسالة منك.",
              "حجز اجتماع (/meet): اسمك الكامل وبريدك الإلكتروني للعمل وجهتك ومنصبك، وملاحظة اختيارية، والشخص الذي اخترته والوقت الذي حددته، ونتيجة التحقق الأمني.",
              "وسوم الحملات: إذا وافقت على التحليلات فقط، تُرفق الوسوم الموجودة في الرابط الذي وصلت منه (utm_source وutm_medium وutm_campaign وutm_term وutm_content) بطلب العرض الذي ترسله من علامة التبويب نفسها.",
              "البيانات التقنية: عنوان IP والصفحة المطلوبة والوقت ونوع المتصفح، كما تسجلها خوادمنا ومزود الشبكة.",
              "التحليلات الاختيارية: مشاهدات الصفحات وأوقات التحميل، ولا تُجمع إلا بموافقتك.",
              "خيارات محفوظة في متصفحك: المظهر الذي اخترته وخيار الخصوصية. تبقى على جهازك ولا تُرسل إلينا.",
            ],
          },
          "نرجو ألا تضع أي بيانات شخصية حساسة في حقل الرسالة أو الملاحظة.",
        ],
      },
      {
        id: "how-we-use",
        heading: "لماذا نستخدمها وعلى أي أساس",
        blocks: [
          {
            table: {
              head: ["الغرض", "البيانات", "الأساس"],
              rows: [
                ["الرد على طلب العرض التوضيحي", "نموذج الطلب ووسوم الحملات", "موافقتك التي تمنحها عند إرسال النموذج، وخطوات تطلبها منا قبل أي اتفاق محتمل"],
                ["ترتيب اجتماعك وتأكيده وحجز موعده، وإرسال رسائل التأكيد والدعوة والتغيير", "بيانات حجز الاجتماع", "موافقتك التي تمنحها عند الحجز، وخطوات تطلبها منا قبل أي اتفاق محتمل"],
                ["حماية الموقع: منع الإرسال الآلي والحد من تكرار الطلبات (5 طلبات عرض كحد أقصى كل 10 دقائق من عنوان IP واحد)", "البيانات التقنية ونتيجة التحقق الأمني", "ضرورية لتقديم الموقع والخدمة التي طلبتها بأمان"],
                ["فهم طريقة استخدام الموقع", "مشاهدات الصفحات وأوقات التحميل", "موافقتك، ويمكنك سحبها في أي وقت"],
              ],
            },
          },
          "لا نرسل رسائل تسويقية، ولا نبيع البيانات الشخصية، ولا نستخدمها لأغراض إعلانية، ولا نتخذ بشأنك قرارات آلية بناءً عليها.",
        ],
      },
      {
        id: "who-we-share-with",
        heading: "من يتلقى البيانات",
        blocks: [
          "نستعين بعدد محدود من مزودي الخدمات الذين يعالجون البيانات نيابة عنا بموجب شروط مكتوبة:",
          {
            table: {
              head: ["المزود", "الغرض", "البيانات", "المكان"],
              rows: [
                ["Cloudflare", "توصيل المحتوى عبر الشبكة والحماية، والتحقق الأمني عند الحجز (Turnstile)، والتحليلات عند موافقتك", "عنوان IP وتفاصيل الطلب والتحقق الأمني وأحداث التحليلات", "شبكة Cloudflare العالمية، بما فيها خارج الإمارات"],
                ["Resend", "إيصال رسائل طلبات العرض إلى فريقنا ورسائل الحجز إليك", "بيانات النموذج والحجز وبريدك الإلكتروني", "الولايات المتحدة"],
                ["Microsoft 365", "دعوات التقويم للاجتماعات المحجوزة، من تقويم الشخص الذي حجزت معه", "اسمك وبريدك الإلكتروني وجهتك وموعد الاجتماع", "مراكز بيانات Microsoft الخاصة بمستأجر التقويم"],
                ["البنية التحتية لـ VAX", "استضافة الموقع وخدمة الحجز على خوادم تشغّلها VAX", "سجلات الخادم والوصول وسجلات الحجز", "خوادم تشغّلها VAX"],
              ],
            },
          },
          "وقد نفصح عن البيانات إذا ألزمنا القانون بذلك.",
        ],
      },
      {
        id: "transfers",
        heading: "نقل البيانات خارج الإمارات",
        blocks: [
          "قد تعالج Cloudflare وResend، وMicrosoft عندما تكون مراكز بياناتها خارج الدولة، بيانات شخصية خارج الإمارات العربية المتحدة. ولا ننقل البيانات إلا بما يسمح به القانون: نعتمد على شروط معالجة البيانات لدى كل مزود، التي تلزمه بحماية البيانات وعدم استخدامها إلا بتعليماتنا، ونعتمد أيضًا على موافقتك في ما يخص التحليلات.",
          "يمكنك أن تطلب منا مزيدًا من التفاصيل عن هذه الضمانات على nofal@vax.sh.",
        ],
      },
      {
        id: "retention",
        heading: "مدة الاحتفاظ",
        blocks: [
          {
            list: [
              `طلبات العرض التوضيحي وحجوزات الاجتماعات: ${RETENTION_AR}. ونحذف الطلبات التي لا يتبعها تواصل إضافي متى انتفت الحاجة إليها.`,
              "يُلغى الحجز غير المؤكد عند انتهاء مدة حجز الموعد.",
              `سجلات الوصول إلى الخادم: ${LOGS_AR}.`,
              "تُحفظ عدادات الحد من الطلبات في ذاكرة الخادم لمدة 10 دقائق، وتُفقد عند إعادة تشغيله.",
              "تُحذف وسوم الحملات من متصفحك عند إغلاق علامة التبويب.",
            ],
          },
        ],
      },
      {
        id: "analytics-and-storage",
        heading: "التحليلات والتخزين في المتصفح",
        blocks: [
          "لا يضع الموقع نفسه أي ملفات تعريف ارتباط. وتبقى التحليلات معطلة حتى توافق عليها، ولا يُحمَّل برنامجها قبل ذلك. وإذا أرسل متصفحك إشارة التحكم العالمي في الخصوصية أو عدم التتبّع، نعدّها رفضًا ولا نسألك. ويمكنك تغيير خيارك في أي وقت من إعدادات ملفات تعريف الارتباط أسفل الصفحة.",
          "تسرد سياسة ملفات تعريف الارتباط والتخزين كل عنصر يُحفظ في متصفحك، والغرض منه، ومدة بقائه.",
        ],
      },
      {
        id: "your-rights",
        heading: "حقوقك",
        blocks: [
          "يحق لك بموجب القانون:",
          {
            list: [
              "الحصول على معلومات عن البيانات التي نحتفظ بها عنك وعلى نسخة منها؛",
              "تصحيح البيانات غير الدقيقة واستكمال الناقصة منها؛",
              "حذف بياناتك متى انتفت الحاجة إليها أو عند سحب موافقتك؛",
              "تقييد استخدامنا لبياناتك ريثما يُحسم أي اعتراض بشأنها؛",
              "الاعتراض على المعالجة، بما في ذلك أي معالجة آلية؛",
              "الحصول على بياناتك بصيغة منظمة يمكن للأجهزة قراءتها ونقلها إلى متحكم آخر؛",
              "سحب موافقتك في أي وقت، دون أن يؤثر ذلك في المعالجة التي سبقت السحب.",
            ],
          },
          "لممارسة أي من هذه الحقوق، راسلنا على nofal@vax.sh. وقد نحتاج إلى التحقق من هويتك قبل التنفيذ، ونرد خلال المدة التي يحددها القانون.",
          "وإذا لم تكن راضيًا عن طريقة تعاملنا مع بياناتك، فيمكنك تقديم شكوى إلى مكتب الإمارات للبيانات.",
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
