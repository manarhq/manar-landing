import { SITE_HOST, CONSOLE_HOST } from "../../hosts.ts"
import type { Locale } from "../../i18n/config.ts"

import type { LegalDoc } from "../schema.ts"

/*
 * Draft of 2 Nov 2026, written by Claude to the founder's data collection design
 * (docs/superpowers/specs/2026-11-02-data-collection-design.md in the workspace), not yet reviewed
 * by a lawyer. Controller: Fixio Technologies LLC SPC. Covers the UAE PDPL (Federal Decree-Law
 * No. 45 of 2021), the GDPR (EU) 2016/679 and the CCPA as amended by the CPRA. No EU
 * representative is appointed. Never add a TRN or a trade licence number here.
 */
export const privacy: Record<Locale, LegalDoc> = {
  en: {
    title: "Privacy Policy",
    description: "How Fixio handles personal data in Manar: what we collect, product improvement data, AI training, retention and your rights under the PDPL, GDPR and CCPA.",
    updated: "2026-11-05",
    sections: [
      {
        id: "who-we-are",
        heading: "Who is responsible",
        blocks: [
          "Manar is a product of Fixio Technologies LLC SPC (Fixio, we, us), 1st Oud Maitha Street, Abu Dhabi, United Arab Emirates. Fixio is the controller of the personal data described here. Privacy questions and requests: privacy@fixio.ae. General support: support@fixio.ae.",
          `This policy covers the Manar website (${SITE_HOST}), the console (${CONSOLE_HOST}), the device software (manar-edge) and the hosted service. When a company or a government body uses Manar for its staff, it decides what its workspace is used for and Fixio processes the workspace data on its behalf, under our Data Processing Agreement. Fixio stays the controller of the product improvement data described below.`,
          "We apply the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL). Where they apply to you, we also apply the EU General Data Protection Regulation (EU) 2016/679 (GDPR) and the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA).",
          "We have not appointed a representative in the European Union. If you are in the EU or the European Economic Area, write to privacy@fixio.ae. You can also complain to the data protection authority where you live.",
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
                ["Product improvement data", "Console usage, device health, AI activity statistics and a small number of redacted samples. The next section describes it in full", "The console, the device software, and our own records"],
                ["Billing", "Plan, status, Stripe customer and subscription identifiers, and invoices. Card details stay with Stripe", "You and Stripe"],
                ["Technical data", "IP address, browser, pages requested and time, in our server and security logs", "Your browser"],
                ["Website forms", "Name, work email and organisation, and a message or booking details, if you send a request or book a meeting", "You"],
                ["Website analytics", `Page views and basic usage events on ${SITE_HOST}, without cookies, only if you accept analytics`, "Your browser"],
              ],
            },
          },
          "By default Manar records what an AI tool did, not the text of your prompts or the contents of your files. Where Manar checks traffic or files on your device, for example with TLS inspection (Personal Pro and above), that content stays on your device. Only the result of the check and the activity record described above reach us. For AI traffic the result is the tool, the AI provider, the model, token counts and the local user name, and, if a secret was found, its type, what Manar did and the first few characters of the secret followed by a mask, never the whole value.",
          "Please do not put sensitive personal data in free text fields.",
        ],
      },
      {
        id: "product-improvement",
        heading: "Product improvement data",
        blocks: [
          "To find bugs, make Manar work well on real computers and improve the rules that keep AI tools in check, we collect product improvement data. It is on by default on every plan (Free, Pro, Company and Government). It is not a condition of using Manar: you can turn it off at any time, as explained under Your controls.",
          {
            table: {
              head: ["Category", "What it includes", "Where it comes from"],
              rows: [
                ["Console usage", "Pages viewed, features used, onboarding steps, errors in the console, and the time it took to add your first device", "The console, sent through our servers"],
                ["Device health", "Manar version, operating system, processor type, first run, crash reports (the stack trace only, without arguments or environment), the device software's CPU and memory use, uptime, how long checks take, and counts of decisions", "The device software, once a day"],
                ["AI activity statistics", "Which AI tools are used, the types of action, how often actions are allowed, asked about or blocked, how quickly approvals are answered, and which rules fire", "Worked out on our servers from records we already hold. Nothing new leaves your device for this"],
                ["Redacted samples", "Commands and web domains that Manar asked you about or blocked, after redaction. At most 20 per device per day", "The device software"],
              ],
            },
          },
          "Redaction runs on your device first and again on our servers. It replaces your home folder with ~, and your user name, computer name, email addresses and IP addresses with placeholders. It removes query strings and fragments from web addresses. It replaces anything that looks like a secret, such as API keys, tokens, JSON web tokens, private keys, settings like KEY=value whose name looks secret, and long random looking strings of 32 characters or more. Each sample is cut to 512 characters.",
          "Console usage and device events (recorded as events named after their type, such as device_crash) are sent from our servers to PostHog in the European Union. No PostHog script runs in your browser and no cookies are used. They are linked to a pseudonymous identifier made from your user identifier with a keyed hash, never to your email address. Redacted samples are kept in our own database in Azure UAE North and are not sent to PostHog.",
        ],
      },
      {
        id: "never-collected",
        heading: "What we never collect",
        blocks: [
          "Whatever your settings, Manar does not collect:",
          {
            list: [
              "the values of your secrets, such as passwords, keys and tokens;",
              "the contents of your files;",
              "the text of your prompts or of AI replies;",
              "your keystrokes;",
              "screenshots or recordings of your screen;",
              "the contents of your clipboard;",
              "your environment variables;",
              "full web addresses with their query strings.",
            ],
          },
        ],
      },
      {
        id: "ai-training",
        heading: "Training Manar's AI models",
        blocks: [
          "We may use de-identified product improvement data, including redacted samples, to train and test Manar's own AI models, for example to suggest rules or to recognise risky actions. We do not train any model on this data yet. This section sets out the limits and the controls that will apply when we do.",
          "De-identified means redacted as described above and linked only to a pseudonymous identifier, never to your name or email address. We will not try to re-identify anyone from it. Some laws still treat de-identified data as personal data, so the rights in this policy still apply to it.",
          "This use has its own switch, Use my data to train Manar's AI models, which is on by default. It has no effect while Help improve Manar is off. When you turn it off, the samples already stored for you are marked as not usable for training, and new samples are stored that way. To delete your samples altogether, turn off Help improve Manar or write to privacy@fixio.ae.",
          "We never train on your AI activity record, your prompts or AI replies, or the contents of your files, and we do not give this data to others to train their models.",
        ],
      },
      {
        id: "your-controls",
        heading: "Your controls",
        blocks: [
          {
            list: [
              "In the console, under Settings, Privacy and data, you have two switches: Help improve Manar and Use my data to train Manar's AI models. Both are on by default.",
              "In Company and Government workspaces, workspace managers have the same two switches for the whole workspace. When a manager turns one off, it is off for every member, whatever their own setting. When a manager turns off Help improve Manar, the samples stored for the workspace are deleted. Personal Free and Pro workspaces have only your own switches.",
              "Collection happens only when both your switch and your workspace's switch are on.",
              "When you turn off Help improve Manar, console events stop at once and your devices stop sending within 24 hours, at their next settings check. Your stored samples are deleted at once, and we ask PostHog to delete the events linked to you.",
              "Deleting your account also deletes your samples, and we ask PostHog to delete the events linked to you.",
              "After your first sign in we show a one time notice about this data, with links to this policy and to your settings. It does not block anything.",
            ],
          },
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
                ["Run the Service: sign you in, show your devices and activity, ask for your approval, keep the signed record", "Account, devices, AI activity, secret alerts", "Necessary to provide the Service you asked for (the contract)"],
                ["Bill you and collect VAT", "Account, billing", "The contract, and our legal duties on tax"],
                ["Keep the Service secure and stop abuse: rate limits, bot checks, investigating incidents", "Technical data, account", "Our legitimate interest in a secure Service, and the contract"],
                ["Send service emails such as sign-in links, trial and idle warnings, billing notices", "Account", "The contract"],
                ["Find bugs and improve Manar", "Product improvement data", "Our legitimate interest, which you can object to with the Help improve Manar switch"],
                ["Train and test Manar's own AI models", "De-identified product improvement data", "Our legitimate interest, which you can object to with its own switch"],
                ["Reply to requests and arrange meetings", "Website forms", "Steps you ask us to take before a contract, and our legitimate interest in answering you"],
                ["Understand how the website is used", "Website analytics", "Your consent, which you can withdraw at any time"],
              ],
            },
          },
          "Under the GDPR these bases are Article 6(1)(b) for the contract, 6(1)(c) for legal duties, 6(1)(f) for legitimate interests and 6(1)(a) for consent.",
          "We do not sell personal information, and we do not share it for cross-context behavioural advertising. We do not use it for advertising at all. We send no marketing email unless you ask for it.",
        ],
      },
      {
        id: "legitimate-interest",
        heading: "Why we rely on legitimate interest",
        blocks: [
          "For product improvement data and AI training we weighed our interest against yours. In short:",
          {
            list: [
              "Our interest: Manar is a security product. To make it reliable we need to see crashes, slow checks and rules that misfire on real computers, and the actions it asks about or blocks.",
              "Necessity: we collect only what serves that purpose. Statistics come from records we already hold, and samples are few, short and redacted.",
              "Your expectations and the impact on you: the data is about how the product behaves, not about your work. Content, secrets and keystrokes are never collected, and nothing is used for advertising.",
              "Safeguards: redaction on the device and again on our servers, a daily cap on samples, pseudonymous identifiers, analytics hosted in the EU, limited retention, and an off switch that also deletes your samples.",
            ],
          },
          "We concluded that these uses do not override your rights and freedoms. You can object at any time with the switches, or by writing to privacy@fixio.ae.",
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
                ["Microsoft Azure", "Hosting, databases, and email delivery, including website request emails (Azure Communication Services, UAE)", "All Service data, form details, email addresses", "UAE North"],
                ["Microsoft Azure OpenAI", "AI features (risk explanations and the assistant). Microsoft does not use this data to train its models", "The content you send to AI features", "Global (any Azure region, including outside the UAE); stored in UAE North"],
                ["Cloudflare", "Network delivery, DNS, security and the bot check (Turnstile)", "IP address and request details", "Global network, including outside the UAE"],
                ["Stripe", "Card payments, invoices, tax", "Name, email, billing details, card details", "Stripe's infrastructure, including outside the UAE"],
                ["PostHog (EU)", "Product improvement data, sent from our servers without cookies, and website analytics only with your consent", "Console and device events with a pseudonymous identifier, website page views and usage events", "European Union"],
                ["Microsoft and GitHub", "Sign-in. They tell us who you are when you choose them", "Name, email, account identifier", "Their own infrastructure"],
              ],
            },
          },
          "AI features and where prompts go: when you use an AI feature of Manar, such as the assistant or a risk explanation, what you ask and the context needed to answer it are sent to Microsoft Azure OpenAI. Manar uses its Global deployment, so Microsoft may process it in any Azure region, including outside the UAE. Before sending, Manar redacts sensitive data it detects, such as secrets, keys, tokens and personal identifiers; redaction cannot catch everything. Microsoft does not use this data to train its models. You can switch AI features off: in the console, under Settings, then AI, turn off Allow external AI. Workspaces on Government plans can ask for a self-hosted or in-region option.",
          "We may also disclose data when the law requires it, or to a buyer of our business under the same protections as this policy.",
        ],
      },
      {
        id: "transfers",
        heading: "Transfers between countries",
        blocks: [
          "Our main hosting is in the United Arab Emirates. Some providers above process data in other countries. We transfer data only as the PDPL allows, relying on each provider's data processing terms, which bind it to protect the data and to use it only on our instructions.",
          "The European Commission has not found that the UAE gives an adequate level of protection. When personal data of people in the EU or EEA is transferred to us in the UAE, or from us to providers outside the EU, we rely on the Standard Contractual Clauses approved by the European Commission. You can ask for a copy at privacy@fixio.ae.",
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
              "Redacted samples: 12 months, or sooner if you turn off Help improve Manar or delete your account.",
              "Product improvement and website analytics events at PostHog: at most 13 months.",
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
        heading: "Website analytics and browser storage",
        blocks: [
          "Analytics on the website are off until you accept them. Accept and Reject are offered side by side. We use PostHog in the EU in cookieless mode: it sets no cookies and keeps no identifier on your device. If your browser sends a Global Privacy Control or Do Not Track signal, we treat it as a refusal and do not ask. You can change your choice at any time with Cookie settings in the footer. The cookie policy lists every item stored in your browser.",
        ],
      },
      {
        id: "your-rights",
        heading: "Your rights",
        blocks: [
          "Depending on where you live, you can:",
          {
            list: [
              "get information about the data we hold about you and a copy of it;",
              "have inaccurate data corrected and incomplete data completed;",
              "have your data erased when it is no longer needed, when you object or when you withdraw consent;",
              "restrict how we use your data while a question about it is resolved;",
              "object to processing based on our legitimate interest, including product improvement and AI training, and to any automated processing;",
              "receive your data in a structured, machine-readable form and have it sent to another controller;",
              "withdraw your consent at any time, without affecting processing done before you withdrew it.",
            ],
          },
          "Much of this you can do yourself in the console: export your record, turn the data switches off and delete your account. For anything else write to privacy@fixio.ae. We may need to confirm your identity first. We answer within 30 days.",
          "If you are not satisfied, you may complain to the UAE Data Office. If you are in the EU or EEA, you may complain to the data protection authority in the country where you live or work, or where you think the law was broken.",
        ],
      },
      {
        id: "california",
        heading: "Notice for California residents",
        blocks: [
          "This section is our notice at collection under the CCPA. In the last 12 months we collected these categories of personal information: identifiers (name, email address, account and device identifiers, IP address); commercial information (plan and billing records); internet and network activity (console usage, device health, AI activity statistics, redacted samples and server logs); and professional information you give us in website forms. The sources, purposes and retention periods are set out in the sections above.",
          "We do not sell personal information, and we do not share it for cross-context behavioural advertising. We treat a Global Privacy Control signal as a request to opt out of sale and sharing, and on our website it also turns off optional analytics. We do not use sensitive personal information for any purpose beyond providing and securing the Service. We do not knowingly collect personal information of anyone under 18.",
          "You have the right to know what personal information we collect, use and disclose, to have it deleted, and to have it corrected. You may use an authorised agent. We will verify requests before acting on them, and we will not discriminate against you for using these rights. Write to privacy@fixio.ae.",
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
        blocks: ["Manar is only for people aged 18 or over, and we do not knowingly collect data about anyone younger. If you think a child has given us data, write to privacy@fixio.ae and we will delete it."],
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
    description: "كيف تتعامل Fixio مع البيانات الشخصية في منار: ما نجمعه وبيانات تحسين المنتج وتدريب الذكاء الاصطناعي ومدة الحفظ وحقوقك وفق القوانين المعمول بها.",
    updated: "2026-11-05",
    sections: [
      {
        id: "who-we-are",
        heading: "من المسؤول",
        blocks: [
          "منار منتج من ⁨Fixio Technologies LLC SPC⁩ (ويُشار إليها بـ Fixio أو نحن)، وعنوانها ⁨1st Oud Maitha Street, Abu Dhabi, United Arab Emirates⁩ (شارع عود ميثاء الأول، أبوظبي، الإمارات العربية المتحدة). وFixio هي المتحكّمة في البيانات الشخصية الموصوفة هنا. للأسئلة والطلبات المتعلقة بالخصوصية: privacy@fixio.ae. وللدعم العام: support@fixio.ae.",
          `تغطي هذه السياسة موقع منار (${SITE_HOST}) ولوحة التحكم (${CONSOLE_HOST}) وبرنامج الجهاز (manar-edge) والخدمة المستضافة. وعندما تستخدم شركة أو جهة حكومية منار لموظفيها فهي التي تحدد أغراض استخدام مساحة عملها، وتعالج Fixio بيانات مساحة العمل لصالحها بموجب اتفاقية معالجة البيانات لدينا. وتبقى Fixio المتحكّمة في بيانات تحسين المنتج الموصوفة أدناه.`,
          "نطبّق المرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية في دولة الإمارات. ونطبّق أيضاً، متى انطبقت عليك، اللائحة العامة لحماية البيانات في الاتحاد الأوروبي (EU) 2016/679 (GDPR)، وقانون خصوصية المستهلك في كاليفورنيا (CCPA) بصيغته المعدّلة بقانون حقوق الخصوصية في كاليفورنيا (CPRA).",
          "لم نعيّن ممثلاً لنا في الاتحاد الأوروبي. فإذا كنت في الاتحاد الأوروبي أو المنطقة الاقتصادية الأوروبية فراسلنا على privacy@fixio.ae، ويمكنك أيضاً تقديم شكوى إلى سلطة حماية البيانات في بلد إقامتك.",
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
                ["بيانات تحسين المنتج", "استخدام لوحة التحكم وسلامة الأجهزة وإحصاءات نشاط الذكاء الاصطناعي وعدد قليل من العيّنات المنقّحة. ويصفها القسم التالي بالتفصيل", "لوحة التحكم وبرنامج الجهاز وسجلاتنا"],
                ["الفوترة", "الخطة والحالة ومعرّفات عميل Stripe واشتراكه والفواتير. وتبقى بيانات البطاقة لدى Stripe", "أنت وStripe"],
                ["بيانات تقنية", "عنوان IP والمتصفح والصفحات المطلوبة والوقت، في سجلات الخوادم والأمان لدينا", "متصفحك"],
                ["نماذج الموقع", "الاسم والبريد المهني والمؤسسة ورسالة أو تفاصيل حجز إذا أرسلت طلباً أو حجزت اجتماعاً", "أنت"],
                ["تحليلات الموقع", `مشاهدات الصفحات وأحداث استخدام أساسية على ${SITE_HOST}، دون ملفات تعريف ارتباط، فقط إذا قبلت التحليلات`, "متصفحك"],
              ],
            },
          },
          "يسجّل منار افتراضياً ما فعلته أداة الذكاء الاصطناعي، لا نص رسائلك ولا محتوى ملفاتك. وحيثما يفحص منار الحركة أو الملفات على جهازك، مثلاً بفحص TLS (في Personal Pro وما فوقها)، يبقى ذلك المحتوى على جهازك، ولا يصلنا إلا نتيجة الفحص وسجل النشاط الموصوف أعلاه. ونتيجة فحص حركة الذكاء الاصطناعي هي الأداة ومزوّد الذكاء الاصطناعي والنموذج وعدد الرموز واسم المستخدم المحلي، وإذا عُثر على سر فنوعه وما فعله منار والأحرف الأولى القليلة من السر متبوعة بإخفاء، لا قيمته كاملة أبداً.",
          "نرجو ألا تضع بيانات شخصية حساسة في حقول النص الحر.",
        ],
      },
      {
        id: "product-improvement",
        heading: "بيانات تحسين المنتج",
        blocks: [
          "لنكتشف الأعطال ونجعل منار يعمل جيداً على الحواسيب الفعلية ونحسّن القواعد التي تضبط أدوات الذكاء الاصطناعي، نجمع بيانات تحسين المنتج. وهي مفعّلة افتراضياً في كل الخطط (المجانية وPro والشركات والجهات الحكومية). وليست شرطاً لاستخدام منار، إذ يمكنك إيقافها في أي وقت كما هو موضّح في قسم أدوات التحكم لديك.",
          {
            table: {
              head: ["الفئة", "ما تتضمنه", "مصدرها"],
              rows: [
                ["استخدام لوحة التحكم", "الصفحات التي شاهدتها والميزات التي استخدمتها وخطوات البدء والأخطاء في لوحة التحكم والوقت الذي استغرقته إضافة أول جهاز", "لوحة التحكم، عبر خوادمنا"],
                ["سلامة الأجهزة", "إصدار منار ونظام التشغيل ونوع المعالج والتشغيل الأول وتقارير الأعطال (تتبّع المكدّس فقط، دون الوسائط أو متغيرات البيئة) واستهلاك برنامج الجهاز للمعالج والذاكرة ومدة التشغيل والوقت الذي تستغرقه الفحوص وأعداد القرارات", "برنامج الجهاز، مرة يومياً"],
                ["إحصاءات نشاط الذكاء الاصطناعي", "أدوات الذكاء الاصطناعي المستخدمة وأنواع الإجراءات ونسب ما سُمح به وما طُلبت عليه الموافقة وما حُجب وسرعة الرد على طلبات الموافقة والقواعد التي تنطبق", "تُحسب على خوادمنا من سجلات نحتفظ بها أصلاً، ولا يغادر جهازك شيء جديد لهذا الغرض"],
                ["العيّنات المنقّحة", "الأوامر ونطاقات الويب التي سألك منار عنها أو حجبها، بعد تنقيحها. بحد أقصى 20 عيّنة لكل جهاز يومياً", "برنامج الجهاز"],
              ],
            },
          },
          "يجري التنقيح على جهازك أولاً ثم مرة أخرى على خوادمنا. فهو يستبدل بمجلدك الرئيسي الرمز ~، ويستبدل باسم المستخدم واسم الحاسوب وعناوين البريد الإلكتروني وعناوين IP رموزاً بديلة. ويحذف سلاسل الاستعلام والأجزاء اللاحقة من عناوين الويب. ويستبدل كل ما يبدو سراً، مثل مفاتيح API والرموز المميزة ورموز JSON Web Token والمفاتيح الخاصة والإعدادات من نوع KEY=value التي يبدو اسمها سرياً والسلاسل الطويلة العشوائية المظهر التي يبلغ طولها 32 حرفاً أو أكثر. وتُقصّ كل عيّنة إلى 512 حرفاً.",
          "تُرسل أحداث استخدام لوحة التحكم والأجهزة (وتُسجَّل أحداث الأجهزة بأسماء تدل على نوعها، مثل device_crash) من خوادمنا إلى PostHog في الاتحاد الأوروبي. ولا يعمل أي برنامج من PostHog في متصفحك ولا تُستخدم ملفات تعريف الارتباط. وتُربط هذه الأحداث بمعرّف مستعار مشتق من معرّف المستخدم بدالة تجزئة بمفتاح، ولا تُربط ببريدك الإلكتروني أبداً. أما العيّنات المنقّحة فتُحفظ في قاعدة بياناتنا على Azure في UAE North ولا تُرسل إلى PostHog.",
        ],
      },
      {
        id: "never-collected",
        heading: "ما لا نجمعه أبداً",
        blocks: [
          "مهما كانت إعداداتك، لا يجمع منار:",
          {
            list: [
              "قيم أسرارك، مثل كلمات المرور والمفاتيح والرموز المميزة؛",
              "محتوى ملفاتك؛",
              "نص رسائلك إلى الذكاء الاصطناعي أو ردوده؛",
              "ضغطات لوحة المفاتيح؛",
              "لقطات الشاشة أو تسجيلاتها؛",
              "محتوى الحافظة؛",
              "متغيرات البيئة؛",
              "عناوين الويب الكاملة مع سلاسل الاستعلام.",
            ],
          },
        ],
      },
      {
        id: "ai-training",
        heading: "تدريب نماذج الذكاء الاصطناعي الخاصة بمنار",
        blocks: [
          "قد نستخدم بيانات تحسين المنتج بعد إزالة ما يحدد الهوية، بما فيها العيّنات المنقّحة، لتدريب نماذج الذكاء الاصطناعي الخاصة بمنار واختبارها، مثلاً لاقتراح القواعد أو للتعرّف على الإجراءات الخطرة. ولا ندرّب أي نموذج على هذه البيانات حتى الآن، ويبيّن هذا القسم الحدود وأدوات التحكم التي ستنطبق حين نفعل.",
          "ونعني بإزالة ما يحدد الهوية أن البيانات منقّحة كما سبق ومرتبطة بمعرّف مستعار فقط، لا باسمك ولا ببريدك الإلكتروني أبداً. ولن نحاول إعادة التعرّف على أي شخص منها. وتعدّ بعض القوانين هذه البيانات بيانات شخصية رغم ذلك، لذا تظل حقوقك الواردة في هذه السياسة سارية عليها.",
          "ولهذا الاستخدام مفتاح مستقل هو استخدام بياناتي لتدريب نماذج الذكاء الاصطناعي الخاصة بمنار، وهو مفعّل افتراضياً. ولا أثر له ما دام مفتاح المساعدة في تحسين منار متوقفاً. وعندما توقفه تُعلَّم العيّنات المحفوظة لك بأنها غير صالحة للتدريب، وتُحفظ العيّنات الجديدة على هذا النحو. ولحذف عيّناتك كلياً أوقف مفتاح المساعدة في تحسين منار أو راسلنا على privacy@fixio.ae.",
          "لا ندرّب أي نموذج على سجل نشاط الذكاء الاصطناعي لديك ولا على رسائلك أو ردود الذكاء الاصطناعي ولا على محتوى ملفاتك، ولا نعطي هذه البيانات لغيرنا لتدريب نماذجهم.",
        ],
      },
      {
        id: "your-controls",
        heading: "أدوات التحكم لديك",
        blocks: [
          {
            list: [
              "في لوحة التحكم، ضمن الإعدادات ثم الخصوصية والبيانات، تجد مفتاحين: المساعدة في تحسين منار، واستخدام بياناتي لتدريب نماذج الذكاء الاصطناعي الخاصة بمنار. وكلاهما مفعّل افتراضياً.",
              "في مساحات عمل الشركات والجهات الحكومية، يملك مديرو مساحة العمل المفتاحين نفسيهما لمساحة العمل كلها. وإذا أوقف المدير أحدهما توقف لجميع الأعضاء أياً كان إعدادهم الشخصي. وإذا أوقف المدير المساعدة في تحسين منار تُحذف العيّنات المحفوظة لمساحة العمل. أما مساحات العمل الشخصية المجانية وPro فليس فيها إلا مفاتيحك أنت.",
              "لا يجري الجمع إلا إذا كان مفتاحك ومفتاح مساحة عملك مفعّلين معاً.",
              "عندما توقف المساعدة في تحسين منار تتوقف أحداث لوحة التحكم فوراً، وتتوقف أجهزتك عن الإرسال خلال 24 ساعة عند مزامنة إعداداتها التالية. وتُحذف عيّناتك المحفوظة فوراً، ونطلب من PostHog حذف الأحداث المرتبطة بك.",
              "حذف حسابك يحذف عيّناتك أيضاً، ونطلب من PostHog حذف الأحداث المرتبطة بك.",
              "بعد أول تسجيل دخول نعرض إشعاراً لمرة واحدة عن هذه البيانات، مع روابط إلى هذه السياسة وإلى إعداداتك، ولا يمنعك من متابعة أي شيء.",
            ],
          },
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
                ["تشغيل الخدمة: تسجيل دخولك وعرض أجهزتك ونشاطك وطلب موافقتك وحفظ السجل الموقّع", "الحساب والأجهزة ونشاط الذكاء الاصطناعي وتنبيهات الأسرار", "لازمة لتقديم الخدمة التي طلبتها (العقد)"],
                ["فوترتك وتحصيل ضريبة القيمة المضافة", "الحساب والفوترة", "العقد والتزاماتنا القانونية الضريبية"],
                ["حماية الخدمة ومنع إساءة الاستخدام: حدود الطلبات وفحوص الروبوتات والتحقيق في الحوادث", "البيانات التقنية والحساب", "مصلحتنا المشروعة في خدمة آمنة، والعقد"],
                ["إرسال رسائل الخدمة مثل روابط الدخول وتحذيرات التجربة والخمول وإشعارات الفوترة", "الحساب", "العقد"],
                ["اكتشاف الأعطال وتحسين منار", "بيانات تحسين المنتج", "مصلحتنا المشروعة، ويمكنك الاعتراض عليها بمفتاح المساعدة في تحسين منار"],
                ["تدريب نماذج الذكاء الاصطناعي الخاصة بمنار واختبارها", "بيانات تحسين المنتج بعد إزالة ما يحدد الهوية", "مصلحتنا المشروعة، ويمكنك الاعتراض عليها بمفتاحها المستقل"],
                ["الرد على الطلبات وترتيب الاجتماعات", "نماذج الموقع", "خطوات تطلبها منا قبل التعاقد، ومصلحتنا المشروعة في الرد عليك"],
                ["فهم كيفية استخدام الموقع", "تحليلات الموقع", "موافقتك، ويمكنك سحبها في أي وقت"],
              ],
            },
          },
          "وفي اللائحة العامة لحماية البيانات تقابل هذه الأسس المادة 6(1)(b) للعقد، و6(1)(c) للالتزامات القانونية، و6(1)(f) للمصالح المشروعة، و6(1)(a) للموافقة.",
          "لا نبيع المعلومات الشخصية، ولا نشاركها لأغراض الإعلانات السلوكية عبر السياقات، ولا نستخدمها للإعلان إطلاقاً. ولا نرسل بريداً تسويقياً ما لم تطلبه.",
        ],
      },
      {
        id: "legitimate-interest",
        heading: "لماذا نعتمد على المصلحة المشروعة",
        blocks: [
          "وازنّا في بيانات تحسين المنتج وتدريب الذكاء الاصطناعي بين مصلحتنا ومصلحتك. وباختصار:",
          {
            list: [
              "مصلحتنا: منار منتج أمني، ولنجعله موثوقاً نحتاج إلى رؤية الأعطال والفحوص البطيئة والقواعد التي تخطئ على الحواسيب الفعلية، والإجراءات التي يسأل عنها أو يحجبها.",
              "الضرورة: لا نجمع إلا ما يخدم هذا الغرض. فالإحصاءات تأتي من سجلات نحتفظ بها أصلاً، والعيّنات قليلة وقصيرة ومنقّحة.",
              "توقعاتك والأثر عليك: البيانات تتعلق بسلوك المنتج لا بعملك. ولا نجمع المحتوى ولا الأسرار ولا ضغطات المفاتيح أبداً، ولا يُستخدم شيء منها للإعلان.",
              "الضمانات: التنقيح على الجهاز ثم على خوادمنا، وحد يومي للعيّنات، ومعرّفات مستعارة، وتحليلات مستضافة في الاتحاد الأوروبي، ومدة حفظ محدودة، ومفتاح إيقاف يحذف عيّناتك أيضاً.",
            ],
          },
          "وخلصنا إلى أن هذه الاستخدامات لا تطغى على حقوقك وحرياتك. ويمكنك الاعتراض في أي وقت بالمفاتيح أو بمراسلتنا على privacy@fixio.ae.",
        ],
      },
      {
        id: "hosting",
        heading: "أين تُستضاف بياناتك",
        blocks: [
          "تعمل الخدمة المستضافة على Microsoft Azure في منطقة UAE North. ولكل مساحة عمل شخصية قاعدة بيانات خاصة بها. وتقف Cloudflare أمام الموقع ولوحة التحكم لتوصيلهما وحمايتهما.",
          "تبقى أدوات الذكاء الاصطناعي وملفاتك على حاسوبك. وتجري فحوص منار لما يُسمح للأداة بفعله على الجهاز نفسه، ولا تمر حركة الذكاء الاصطناعي لديك عبر خوادمنا.",
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
                ["Microsoft Azure", "الاستضافة وقواعد البيانات وإرسال البريد، ومنه بريد طلبات الموقع (Azure Communication Services، الإمارات)", "كل بيانات الخدمة وتفاصيل النماذج وعناوين البريد", "UAE North"],
                ["Microsoft Azure OpenAI", "ميزات الذكاء الاصطناعي (شرح المخاطر والمساعد). لا تستخدم Microsoft هذه البيانات لتدريب نماذجها", "المحتوى الذي ترسله إلى ميزات الذكاء الاصطناعي", "عالمي (أي منطقة Azure، ومنها خارج الإمارات)، ويُخزَّن في UAE North"],
                ["Cloudflare", "توصيل الشبكة وDNS والأمان وفحص الروبوتات (Turnstile)", "عنوان IP وتفاصيل الطلب", "شبكة عالمية تشمل خارج الإمارات"],
                ["Stripe", "مدفوعات البطاقات والفواتير والضريبة", "الاسم والبريد وتفاصيل الفوترة وبيانات البطاقة", "بنية Stripe التحتية، وتشمل خارج الإمارات"],
                ["PostHog (الاتحاد الأوروبي)", "بيانات تحسين المنتج، تُرسل من خوادمنا دون ملفات تعريف ارتباط، وتحليلات الموقع بموافقتك فقط", "أحداث لوحة التحكم والأجهزة مع معرّف مستعار، ومشاهدات صفحات الموقع وأحداث الاستخدام", "الاتحاد الأوروبي"],
                ["Microsoft وGitHub", "تسجيل الدخول. يخبراننا بهويتك عندما تختارهما", "الاسم والبريد ومعرّف الحساب", "بنيتهما التحتية"],
              ],
            },
          },
          "ميزات الذكاء الاصطناعي وأين تذهب الطلبات: عند استخدامك ميزة ذكاء اصطناعي في منار، مثل المساعد أو شرح المخاطر، يُرسل ما تطلبه والسياق اللازم للإجابة إلى Microsoft Azure OpenAI. تستخدم منار نشر Global لديها، لذلك قد تعالجه Microsoft في أي منطقة Azure، ومنها خارج الإمارات. وقبل الإرسال تحجب منار البيانات الحساسة التي تكتشفها، مثل الأسرار والمفاتيح والرموز والمعرّفات الشخصية، ولا يمكن للحجب أن يلتقط كل شيء. ولا تستخدم Microsoft هذه البيانات لتدريب نماذجها. ويمكنك إيقاف ميزات الذكاء الاصطناعي: من لوحة التحكم، ضمن الإعدادات ثم الذكاء الاصطناعي، أوقف خيار السماح بالذكاء الاصطناعي الخارجي. ويمكن لمساحات العمل في خطط الحكومة طلب خيار مستضاف ذاتياً أو داخل المنطقة.",
          "وقد نفصح عن البيانات أيضاً عندما يطلب القانون ذلك، أو لمشترٍ لأعمالنا بالحماية نفسها التي تنص عليها هذه السياسة.",
        ],
      },
      {
        id: "transfers",
        heading: "النقل بين الدول",
        blocks: [
          "استضافتنا الرئيسية في دولة الإمارات العربية المتحدة، ويعالج بعض المزوّدين أعلاه البيانات في دول أخرى. ولا ننقل البيانات إلا وفق ما يسمح به قانون حماية البيانات الشخصية، معتمدين على شروط معالجة البيانات لدى كل مزوّد، وهي تلزمه بحمايتها وعدم استخدامها إلا بتعليماتنا.",
          "لم تصدر المفوضية الأوروبية قراراً بأن دولة الإمارات توفر مستوى حماية كافياً. لذلك عند نقل البيانات الشخصية لأشخاص في الاتحاد الأوروبي أو المنطقة الاقتصادية الأوروبية إلينا في الإمارات، أو منا إلى مزوّدين خارج الاتحاد الأوروبي، نعتمد على البنود التعاقدية القياسية التي اعتمدتها المفوضية الأوروبية. ويمكنك طلب نسخة منها عبر privacy@fixio.ae.",
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
              "العيّنات المنقّحة: 12 شهراً، أو أقل إذا أوقفت المساعدة في تحسين منار أو حذفت حسابك.",
              "أحداث تحسين المنتج وتحليلات الموقع لدى PostHog: 13 شهراً كحد أقصى.",
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
        heading: "تحليلات الموقع والتخزين في المتصفح",
        blocks: [
          "التحليلات في الموقع متوقفة حتى تقبلها، ويُعرض زرا القبول والرفض جنباً إلى جنب. نستخدم PostHog في الاتحاد الأوروبي بوضع بلا ملفات تعريف ارتباط: لا يضع ملفات ولا يحفظ معرّفاً على جهازك. وإذا أرسل متصفحك إشارة التحكم العالمي في الخصوصية أو إشارة عدم التتبع فإننا نعدّها رفضاً ولا نسألك. ويمكنك تغيير اختيارك في أي وقت من إعدادات ملفات تعريف الارتباط في أسفل الصفحة. وتسرد سياسة ملفات تعريف الارتباط كل عنصر يُخزَّن في متصفحك.",
        ],
      },
      {
        id: "your-rights",
        heading: "حقوقك",
        blocks: [
          "بحسب مكان إقامتك يمكنك:",
          {
            list: [
              "الحصول على معلومات عن البيانات التي نحتفظ بها عنك ونسخة منها؛",
              "تصحيح البيانات غير الدقيقة واستكمال غير المكتملة؛",
              "محو بياناتك عندما لا تعود لازمة أو عند اعتراضك أو سحب موافقتك؛",
              "تقييد استخدامنا لبياناتك ريثما يُحسم سؤال بشأنها؛",
              "الاعتراض على المعالجة القائمة على مصلحتنا المشروعة، بما فيها تحسين المنتج وتدريب الذكاء الاصطناعي، وعلى أي معالجة آلية؛",
              "تسلّم بياناتك بصيغة منظّمة مقروءة آلياً وإرسالها إلى متحكّم آخر؛",
              "سحب موافقتك في أي وقت دون التأثير على المعالجة التي تمت قبل السحب.",
            ],
          },
          "يمكنك تنفيذ كثير من ذلك بنفسك في لوحة التحكم: تصدير سجلك وإيقاف مفاتيح البيانات وحذف حسابك. ولأي أمر آخر راسل privacy@fixio.ae. وقد نحتاج إلى التحقق من هويتك أولاً. نرد خلال 30 يوماً.",
          "وإذا لم ترضَ فيمكنك الشكوى إلى مكتب الإمارات للبيانات. وإذا كنت في الاتحاد الأوروبي أو المنطقة الاقتصادية الأوروبية فيمكنك الشكوى إلى سلطة حماية البيانات في البلد الذي تقيم أو تعمل فيه، أو الذي ترى أن المخالفة وقعت فيه.",
        ],
      },
      {
        id: "california",
        heading: "إشعار للمقيمين في كاليفورنيا",
        blocks: [
          "هذا القسم هو إشعارنا عند الجمع بموجب قانون خصوصية المستهلك في كاليفورنيا. خلال الاثني عشر شهراً الماضية جمعنا الفئات التالية من المعلومات الشخصية: المعرّفات (الاسم والبريد الإلكتروني ومعرّفات الحساب والجهاز وعنوان IP)؛ والمعلومات التجارية (الخطة وسجلات الفوترة)؛ ونشاط الإنترنت والشبكة (استخدام لوحة التحكم وسلامة الأجهزة وإحصاءات نشاط الذكاء الاصطناعي والعيّنات المنقّحة وسجلات الخوادم)؛ والمعلومات المهنية التي تقدمها في نماذج الموقع. وتبيّن الأقسام السابقة مصادرها وأغراضها ومدد الاحتفاظ بها.",
          "لا نبيع المعلومات الشخصية، ولا نشاركها لأغراض الإعلانات السلوكية عبر السياقات. ونعدّ إشارة التحكم العالمي في الخصوصية طلباً بالامتناع عن البيع والمشاركة، وهي في موقعنا توقف التحليلات الاختيارية أيضاً. ولا نستخدم المعلومات الشخصية الحساسة لأي غرض يتجاوز تقديم الخدمة وحمايتها. ولا نجمع عن علم معلومات شخصية لمن هم دون 18 عاماً.",
          "لك الحق في معرفة المعلومات الشخصية التي نجمعها ونستخدمها ونفصح عنها، وفي حذفها، وفي تصحيحها. ويمكنك الاستعانة بوكيل مفوّض. وسنتحقق من الطلبات قبل تنفيذها، ولن نميّز ضدك لممارستك هذه الحقوق. راسلنا على privacy@fixio.ae.",
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
        blocks: ["منار مخصص لمن بلغوا 18 عاماً فأكثر فقط، ولا نجمع عن علم بيانات عن أي شخص أصغر سناً. وإذا ظننت أن طفلاً قدّم لنا بيانات فراسلنا على privacy@fixio.ae وسنحذفها."],
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
