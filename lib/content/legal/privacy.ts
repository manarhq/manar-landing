import type { Locale } from "../../i18n/config.ts"

import type { LegalDoc } from "../schema.ts"

/*
 * Launch draft (31 Oct 2026), written by Claude and approved by the founder to launch with, with no
 * lawyer review (decision #19). Structured for the UAE Federal Decree-Law No. 45 of 2021 on the
 * Protection of Personal Data (PDPL); the supervisory authority is the UAE Data Office. Controller:
 * Fixio. Bracketed values are placeholders for the founder (listed in the PR).
 */
export const privacy: Record<Locale, LegalDoc> = {
  en: {
    title: "Privacy Policy",
    description: "How Fixio handles personal data in Manar under the UAE PDPL: what we collect, where it is hosted, how long we keep it, and your rights.",
    updated: "2026-10-31",
    sections: [
      {
        id: "who-we-are",
        heading: "Who is responsible",
        blocks: [
          "Manar is a product of Fixio. Fixio is the controller of the personal data described here: Fixio, [Fixio registered address], tax registration number [TRN]. Privacy questions and requests: support@fixio.ae.",
          "This policy covers the Manar website (manar.vax.sh), the console (console-manar.vax.sh), the device software and the hosted service. When a company uses Manar for its staff, that company decides what its workspace is used for and Fixio acts for it as a processor. A separate agreement with that company says so.",
          "We apply the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL).",
        ],
      },
      {
        id: "what-we-collect",
        heading: "What we collect",
        blocks: [
          {
            table: {
              head: ["Data", "What it includes", "Where it comes from"],
              rows: [
                ["Account", "Your name, email address, the sign-in provider (Microsoft, GitHub or email) and its account identifier, and your workspace", "You, and your sign-in provider"],
                ["Devices", "Computer name, operating system, a machine identifier, the Manar version, and the AI tools found on it with their versions", "The device software"],
                ["AI activity record", "What an AI tool did: the tool, the action, its target such as a command or file path with your home folder masked, our decision, your approval answer and the time. It is signed so changes can be detected", "The device software"],
                ["Secret alerts", "That a tool touched a secret file: the tool, the process, the type of file, a masked path and the time. Never the contents of the file", "The device software"],
                ["Secret vault", "Secrets you choose to move into the vault stay in your computer's own key store. They are not sent to us", "You"],
                ["Billing", "Plan, status, Stripe customer and subscription identifiers, and invoices. Card details stay with Stripe", "You and Stripe"],
                ["Technical data", "IP address, browser, pages requested and time, in our server and security logs", "Your browser"],
                ["Website forms", "Name, work email and organisation, and a message or booking details, if you send a request or book a meeting", "You"],
                ["Analytics", "Page views and basic usage events, without cookies, only if you accept analytics", "Your browser"],
              ],
            },
          },
          "By default Manar records what an AI tool did, not the text of your prompts or the contents of your files. If you turn on TLS inspection (Personal Pro and above), traffic is inspected on your device for data loss checks. [Founder to confirm what inspection stores before launch.]",
          "Please do not put sensitive personal data in free text fields.",
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
                ["Run the Service: sign you in, show your devices and activity, ask for your approval, keep the signed record", "Account, devices, AI activity, secret alerts", "Necessary to provide the Service you asked for, and your consent when you add a device"],
                ["Bill you and collect VAT", "Account, billing", "Necessary for the contract, and legal duties on tax"],
                ["Keep the Service secure and stop abuse: rate limits, bot checks, investigating incidents", "Technical data, account", "Necessary to provide the Service securely"],
                ["Send service emails such as sign-in links, trial and idle warnings, billing notices", "Account", "Necessary for the contract"],
                ["Reply to requests and arrange meetings", "Website forms", "Your consent, and steps you ask us to take before a contract"],
                ["Understand how the product is used and improve it", "Analytics", "Your consent, which you can withdraw at any time"],
              ],
            },
          },
          "We do not sell personal data, use it for advertising, or train AI models on your activity record. We send no marketing email unless you ask for it.",
        ],
      },
      {
        id: "hosting",
        heading: "Where your data is hosted",
        blocks: [
          "The hosted Service runs on Microsoft Azure in the UAE North region. Each personal workspace has its own database. Cloudflare sits in front of the website and console to deliver and protect them.",
          "Your AI tools and files stay on your computer. Manar's checks on what a tool is allowed to do run on the device itself, and your AI traffic does not pass through our servers.",
        ],
      },
      {
        id: "who-we-share-with",
        heading: "Who receives it",
        blocks: [
          "We use a small number of service providers who process data for us under written terms:",
          {
            table: {
              head: ["Provider", "Purpose", "Data", "Where"],
              rows: [
                ["Microsoft Azure", "Hosting, databases, and email delivery (Azure Communication Services)", "All Service data, email addresses", "UAE North"],
                ["Cloudflare", "Network delivery, DNS, security and the bot check (Turnstile)", "IP address and request details", "Global network, including outside the UAE"],
                ["Stripe", "Card payments, invoices, tax", "Name, email, billing details, card details", "Stripe's infrastructure, including outside the UAE"],
                ["PostHog (EU)", "Product analytics, only with your consent, without cookies", "Page views and usage events", "European Union"],
                ["Resend", "Delivers website request and booking emails", "Form details, email address", "United States"],
                ["Microsoft and GitHub", "Sign-in. They tell us who you are when you choose them", "Name, email, account identifier", "Their own infrastructure"],
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
          "Some providers above process data outside the United Arab Emirates. We transfer data only as the PDPL allows: we rely on each provider's data processing terms, which bind it to protect the data and use it only on our instructions, and for analytics also on your consent. Ask us at support@fixio.ae for more detail about these safeguards.",
        ],
      },
      {
        id: "retention",
        heading: "How long we keep it",
        blocks: [
          {
            list: [
              "AI activity record: for the audit period of your plan, which is 30 days on Free and 1 year on Personal Pro. Company workspaces follow the period set for the workspace. Older records are hidden for 30 days, then dropped. You can export your record at any time.",
              "Account and devices: while your account is open.",
              "Account deletion: you can delete your account at any time. We first offer an export. The workspace, including its signed record, is dropped after a 30-day grace period that you can cancel.",
              "Idle free workspaces: a free workspace with no activity for 60 days is archived and then dropped. We email you a warning before each step.",
              "Billing records: as long as tax law requires.",
              "Server logs: 30 days.",
              "Backups: encrypted backups roll off on their normal cycle, no later than 7 days after deletion.",
              "Website requests and bookings: 12 months after our last contact with you.",
            ],
          },
        ],
      },
      {
        id: "analytics-and-storage",
        heading: "Analytics and browser storage",
        blocks: [
          "Analytics are off until you accept them. We use PostHog in the EU in cookieless mode: it sets no cookies and keeps no identifier on your device. If your browser sends a Global Privacy Control or Do Not Track signal, we treat it as a refusal and do not ask. You can change your choice at any time with Cookie settings in the footer. The cookie policy lists every item stored in your browser.",
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
          "Most of this you can do yourself in the console: export your record and delete your account. For anything else write to support@fixio.ae. We answer within 30 days. If you are not satisfied you may complain to the UAE Data Office.",
        ],
      },
      {
        id: "security",
        heading: "How we protect it",
        blocks: [
          "Each workspace has its own database. Devices talk to the Service over mutually authenticated TLS. Access is limited by role, secrets are held in a managed secret store, and the activity record is signed so changes can be detected. No system is perfectly secure, and we will tell you and the authorities about a breach as the law requires.",
        ],
      },
      {
        id: "children",
        heading: "Children",
        blocks: ["Manar is not for people under 18, and we do not knowingly collect their data."],
      },
      {
        id: "changes",
        heading: "Changes",
        blocks: [
          "We may update this policy. For a material change we email account owners at least 14 days before it takes effect, and the date above changes.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    description: "كيف تتعامل Fixio مع البيانات الشخصية في منار وفق قانون حماية البيانات الشخصية الإماراتي: ما نجمعه وأين يُستضاف ومدة حفظه وحقوقك.",
    updated: "2026-10-31",
    sections: [
      {
        id: "who-we-are",
        heading: "من المسؤول",
        blocks: [
          "منار منتج من Fixio. وFixio هي المتحكّمة في البيانات الشخصية الموصوفة هنا: Fixio، [عنوان Fixio المسجّل]، رقم التسجيل الضريبي [TRN]. للأسئلة والطلبات المتعلقة بالخصوصية: support@fixio.ae.",
          "تغطي هذه السياسة موقع منار (manar.vax.sh) ولوحة التحكم (console-manar.vax.sh) وبرنامج الجهاز والخدمة المستضافة. وعندما تستخدم شركة ما منار لموظفيها فهي التي تحدد أغراض استخدام مساحة عملها، وتعمل Fixio لصالحها بصفة معالِج، وتنص على ذلك اتفاقية منفصلة معها.",
          "نطبّق المرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية في دولة الإمارات.",
        ],
      },
      {
        id: "what-we-collect",
        heading: "ما الذي نجمعه",
        blocks: [
          {
            table: {
              head: ["البيانات", "ما تتضمنه", "مصدرها"],
              rows: [
                ["الحساب", "اسمك وبريدك الإلكتروني ومزوّد تسجيل الدخول (Microsoft أو GitHub أو البريد) ومعرّف حسابك لديه ومساحة عملك", "أنت ومزوّد تسجيل الدخول"],
                ["الأجهزة", "اسم الحاسوب ونظام التشغيل ومعرّف الجهاز وإصدار منار وأدوات الذكاء الاصطناعي الموجودة عليه مع إصداراتها", "برنامج الجهاز"],
                ["سجل نشاط الذكاء الاصطناعي", "ما فعلته أداة ذكاء اصطناعي: الأداة والإجراء وهدفه مثل أمر أو مسار ملف مع إخفاء مجلدك الرئيسي وقرارنا وإجابتك على طلب الموافقة والوقت. السجل موقّع لكشف أي تغيير", "برنامج الجهاز"],
                ["تنبيهات الأسرار", "أن أداة لمست ملف أسرار: الأداة والعملية ونوع الملف ومساراً مخفياً جزئياً والوقت. لا نأخذ محتوى الملف أبداً", "برنامج الجهاز"],
                ["خزنة الأسرار", "الأسرار التي تختار نقلها إلى الخزنة تبقى في مخزن المفاتيح الخاص بحاسوبك ولا تُرسل إلينا", "أنت"],
                ["الفوترة", "الخطة والحالة ومعرّفات عميل Stripe واشتراكه والفواتير. وتبقى بيانات البطاقة لدى Stripe", "أنت وStripe"],
                ["بيانات تقنية", "عنوان IP والمتصفح والصفحات المطلوبة والوقت، في سجلات الخوادم والأمان لدينا", "متصفحك"],
                ["نماذج الموقع", "الاسم والبريد المهني والمؤسسة ورسالة أو تفاصيل حجز إذا أرسلت طلباً أو حجزت اجتماعاً", "أنت"],
                ["التحليلات", "مشاهدات الصفحات وأحداث استخدام أساسية، دون ملفات تعريف ارتباط، فقط إذا قبلت التحليلات", "متصفحك"],
              ],
            },
          },
          "يسجّل منار افتراضياً ما فعلته أداة الذكاء الاصطناعي، لا نص رسائلك ولا محتوى ملفاتك. وإذا فعّلت فحص TLS (في Personal Pro وما فوقها) يُفحص الحركة على جهازك للتحقق من تسرّب البيانات. [على المؤسس تأكيد ما يخزّنه الفحص قبل الإطلاق.]",
          "نرجو ألا تضع بيانات شخصية حساسة في حقول النص الحر.",
        ],
      },
      {
        id: "how-we-use",
        heading: "لماذا نستخدمها وما الأساس",
        blocks: [
          {
            table: {
              head: ["الغرض", "البيانات", "الأساس"],
              rows: [
                ["تشغيل الخدمة: تسجيل دخولك وعرض أجهزتك ونشاطك وطلب موافقتك وحفظ السجل الموقّع", "الحساب والأجهزة ونشاط الذكاء الاصطناعي وتنبيهات الأسرار", "لازمة لتقديم الخدمة التي طلبتها، وموافقتك عند إضافة جهاز"],
                ["فوترتك وتحصيل ضريبة القيمة المضافة", "الحساب والفوترة", "لازمة للعقد وللالتزامات القانونية الضريبية"],
                ["حماية الخدمة ومنع إساءة الاستخدام: حدود الطلبات وفحوص الروبوتات والتحقيق في الحوادث", "البيانات التقنية والحساب", "لازمة لتقديم الخدمة بأمان"],
                ["إرسال رسائل الخدمة مثل روابط الدخول وتحذيرات التجربة والخمول وإشعارات الفوترة", "الحساب", "لازمة للعقد"],
                ["الرد على الطلبات وترتيب الاجتماعات", "نماذج الموقع", "موافقتك، وخطوات تطلبها منا قبل التعاقد"],
                ["فهم كيفية استخدام المنتج وتحسينه", "التحليلات", "موافقتك، ويمكنك سحبها في أي وقت"],
              ],
            },
          },
          "لا نبيع البيانات الشخصية ولا نستخدمها للإعلان ولا ندرّب نماذج ذكاء اصطناعي على سجل نشاطك. ولا نرسل بريداً تسويقياً ما لم تطلبه.",
        ],
      },
      {
        id: "hosting",
        heading: "أين تُستضاف بياناتك",
        blocks: [
          "تعمل الخدمة المستضافة على Microsoft Azure في منطقة UAE North. ولكل مساحة عمل شخصية قاعدة بيانات خاصة بها. وتقف Cloudflare أمام الموقع ولوحة التحكم لتوصيلهما وحمايتهما.",
          "تبقى أدوات الذكاء الاصطناعي وملفاتك على حاسوبك. وتجري فحوص منار لما تُسمح به الأداة على الجهاز نفسه، ولا تمر حركة الذكاء الاصطناعي لديك عبر خوادمنا.",
        ],
      },
      {
        id: "who-we-share-with",
        heading: "من يستلمها",
        blocks: [
          "نستعين بعدد قليل من مزوّدي الخدمة الذين يعالجون البيانات لحسابنا بموجب شروط مكتوبة:",
          {
            table: {
              head: ["المزوّد", "الغرض", "البيانات", "الموقع"],
              rows: [
                ["Microsoft Azure", "الاستضافة وقواعد البيانات وإرسال البريد (Azure Communication Services)", "كل بيانات الخدمة وعناوين البريد", "UAE North"],
                ["Cloudflare", "توصيل الشبكة وDNS والأمان وفحص الروبوتات (Turnstile)", "عنوان IP وتفاصيل الطلب", "شبكة عالمية تشمل خارج الإمارات"],
                ["Stripe", "مدفوعات البطاقات والفواتير والضريبة", "الاسم والبريد وتفاصيل الفوترة وبيانات البطاقة", "بنية Stripe التحتية، وتشمل خارج الإمارات"],
                ["PostHog (الاتحاد الأوروبي)", "تحليلات المنتج، بموافقتك فقط ودون ملفات تعريف ارتباط", "مشاهدات الصفحات وأحداث الاستخدام", "الاتحاد الأوروبي"],
                ["Resend", "إرسال بريد طلبات الموقع والحجوزات", "تفاصيل النموذج والبريد الإلكتروني", "الولايات المتحدة"],
                ["Microsoft وGitHub", "تسجيل الدخول. يخبراننا بهويتك عندما تختارهما", "الاسم والبريد ومعرّف الحساب", "بنيتهما التحتية"],
              ],
            },
          },
          "وقد نفصح عن البيانات أيضاً عندما يطلب القانون ذلك.",
        ],
      },
      {
        id: "transfers",
        heading: "النقل خارج الدولة",
        blocks: [
          "يعالج بعض المزوّدين أعلاه البيانات خارج دولة الإمارات العربية المتحدة. ولا ننقل البيانات إلا وفق ما يسمح به القانون: نعتمد على شروط معالجة البيانات لدى كل مزوّد، وهي تلزمه بحمايتها واستخدامها بتعليماتنا فقط، وفي التحليلات نعتمد أيضاً على موافقتك. اطلب منا تفاصيل أكثر عن هذه الضمانات عبر support@fixio.ae.",
        ],
      },
      {
        id: "retention",
        heading: "مدة الاحتفاظ",
        blocks: [
          {
            list: [
              "سجل نشاط الذكاء الاصطناعي: طوال مدة التدقيق في خطتك، وهي 30 يوماً في المجانية وسنة في Personal Pro. وتتبع مساحات عمل الشركات المدة المحددة لمساحة العمل. وتُخفى السجلات الأقدم 30 يوماً ثم تُسقط. ويمكنك تصدير سجلك في أي وقت.",
              "الحساب والأجهزة: ما دام حسابك مفتوحاً.",
              "حذف الحساب: يمكنك حذف حسابك في أي وقت. ونعرض عليك التصدير أولاً. وتُسقط مساحة العمل، بما فيها سجلها الموقّع، بعد مهلة 30 يوماً يمكنك إلغاؤها.",
              "مساحات العمل المجانية الخاملة: تُؤرشف مساحة العمل المجانية التي لا نشاط فيها لمدة 60 يوماً ثم تُسقط. ونرسل إليك بريداً تحذيرياً قبل كل خطوة.",
              "سجلات الفوترة: بالقدر الذي يوجبه قانون الضرائب.",
              "سجلات الخوادم: 30 يوماً.",
              "النسخ الاحتياطية: تُحذف النسخ الاحتياطية المشفرة وفق دورتها المعتادة، وفي موعد لا يتجاوز 7 أيام بعد الحذف.",
              "طلبات الموقع والحجوزات: 12 شهراً بعد آخر تواصل معك.",
            ],
          },
        ],
      },
      {
        id: "analytics-and-storage",
        heading: "التحليلات والتخزين في المتصفح",
        blocks: [
          "التحليلات متوقفة حتى تقبلها. نستخدم PostHog في الاتحاد الأوروبي بوضع بلا ملفات تعريف ارتباط: لا يضع ملفات ولا يحفظ معرّفاً على جهازك. وإذا أرسل متصفحك إشارة التحكم العالمي بالخصوصية أو إشارة عدم التتبع فإننا نعدّها رفضاً ولا نسألك. ويمكنك تغيير اختيارك في أي وقت من إعدادات ملفات تعريف الارتباط في أسفل الصفحة. وتسرد سياسة ملفات تعريف الارتباط كل عنصر يُخزَّن في متصفحك.",
        ],
      },
      {
        id: "your-rights",
        heading: "حقوقك",
        blocks: [
          "بموجب قانون حماية البيانات الشخصية يمكنك:",
          {
            list: [
              "الحصول على معلومات عن البيانات التي نحتفظ بها عنك ونسخة منها؛",
              "تصحيح البيانات غير الدقيقة واستكمال غير المكتملة؛",
              "محو بياناتك عندما لا تعود لازمة أو عند سحب موافقتك؛",
              "تقييد استخدامنا لبياناتك ريثما يُحسم سؤال بشأنها؛",
              "الاعتراض على المعالجة، بما فيها أي معالجة آلية؛",
              "تسلّم بياناتك بصيغة منظّمة مقروءة آلياً وإرسالها إلى متحكّم آخر؛",
              "سحب موافقتك في أي وقت دون التأثير على المعالجة التي تمت قبل السحب.",
            ],
          },
          "يمكنك تنفيذ معظم ذلك بنفسك في لوحة التحكم: تصدير سجلك وحذف حسابك. ولأي أمر آخر راسل support@fixio.ae. نرد خلال 30 يوماً. وإذا لم ترضَ فيمكنك الشكوى إلى مكتب بيانات دولة الإمارات.",
        ],
      },
      {
        id: "security",
        heading: "كيف نحميها",
        blocks: [
          "لكل مساحة عمل قاعدة بيانات خاصة بها. وتتصل الأجهزة بالخدمة عبر TLS بمصادقة متبادلة. والوصول محدود بحسب الدور، والأسرار محفوظة في مخزن أسرار مُدار، وسجل النشاط موقّع لكشف أي تغيير. ولا يوجد نظام آمن تماماً، وسنبلغك والجهات المختصة بأي اختراق وفق ما يوجبه القانون.",
        ],
      },
      {
        id: "children",
        heading: "الأطفال",
        blocks: ["منار ليس لمن هم دون 18 عاماً، ولا نجمع بياناتهم عن علم."],
      },
      {
        id: "changes",
        heading: "التعديلات",
        blocks: [
          "قد نحدّث هذه السياسة. وعند أي تعديل جوهري نرسل بريداً إلى مالكي الحسابات قبل 14 يوماً على الأقل من سريانه، ويتغير التاريخ أعلاه.",
        ],
      },
    ],
  },
}
