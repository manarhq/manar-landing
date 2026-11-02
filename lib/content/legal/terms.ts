import type { Locale } from "../../i18n/config.ts"

import type { LegalDoc } from "../schema.ts"

/*
 * Launch draft (31 Oct 2026), updated 2 Nov 2026 for the founder's data collection design, written by
 * Claude, not yet reviewed by a lawyer (decision #19). Provider and contracting party: Fixio
 * Technologies LLC SPC. Never add a TRN or a trade licence number here.
 */
export const terms: Record<Locale, LegalDoc> = {
  en: {
    title: "Terms of Service",
    description: "The terms for using Manar, a product of Fixio: accounts, plans and billing, the device software, acceptable use and liability.",
    updated: "2026-11-02",
    sections: [
      {
        id: "about",
        heading: "Who we are and what these terms cover",
        blocks: [
          "Manar is a product of Fixio Technologies LLC SPC (Fixio, we, us), 1st Oud Maitha Street, Abu Dhabi, United Arab Emirates. These terms are a contract between you and Fixio. They cover the Manar website at manar.vax.sh, the Manar console at console-manar.vax.sh, the Manar device software (manar-edge) and the hosted service together (the Service).",
          "By creating an account, installing the device software or using the Service you agree to these terms. If you use Manar for a company, you confirm you may bind that company, and it is the customer.",
          "Customers on an Enterprise plan or a customer-hosted install sign a separate written agreement. If it conflicts with these terms, the written agreement wins.",
        ],
      },
      {
        id: "accounts",
        heading: "Your account",
        blocks: [
          "You sign in with Microsoft, GitHub or an email link. You must give accurate information, keep your sign-in methods secure and tell us at once if you think someone else has access.",
          "You must be at least 18 years old to use Manar. If the age of majority where you live is higher, you must have reached it. You are responsible for what happens under your account.",
          "One person may hold one free personal workspace. We may close extra free workspaces opened to get around plan limits.",
        ],
      },
      {
        id: "service",
        heading: "The Service and its plans",
        blocks: [
          "Manar watches the AI tools on the computers you enrol, can ask you before risky actions where a tool allows it, warns when a tool touches secrets, and keeps a signed record. What Manar can do for each tool is stated on the coverage page. That page, and not marketing wording, is the statement of what we provide.",
          {
            table: {
              head: ["Plan", "Price (USD)", "Limits"],
              rows: [
                ["Free", "$0", "3 devices, 10 agents, 30-day audit, 1 cloud agent"],
                ["Personal Pro", "$9 per month or $90 per year", "10 devices, unlimited agents, 1-year audit, 5 cloud agents, TLS inspection, priority email support"],
                ["Company", "$15 per user per month, plus $5 per extra device", "3 devices per user included. A billable user is anyone with an enrolled device or a console sign-in that month. 30-day trial with 25 devices and all features"],
                ["Enterprise", "By quotation", "Signed licence. Hub and federation, air-gapped installs, government deployments, TPM attestation and compliance packs"],
              ],
            },
          },
          "We may improve, change or retire features. If we remove a paid feature, we will tell you in advance and refund the unused part of what you paid for it.",
        ],
      },
      {
        id: "billing",
        heading: "Payment, tax and trials",
        blocks: [
          "Prices are in US dollars. For buyers in the UAE we add 5% VAT. Stripe, our payment processor, takes your card details; we never see or store them. Fixio is the merchant of record and appears on your receipt.",
          "Paid plans renew each month or year until you cancel in the billing portal. Cancelling stops the next renewal. You keep the paid features until the period you paid for ends. Fees already paid are not refunded, except where the law requires it or we say otherwise in writing.",
          "Company usage is counted daily and billed for the month. A company trial lasts 30 days. If it ends without payment, the workspace becomes read-only with export.",
          "If you move to a lower plan or a payment fails, devices already enrolled stay protected. New devices are refused until you are under the limit. Audit older than the new plan allows is hidden, not deleted, for 30 days and then dropped. Cloud agents over the limit are paused, not deleted.",
        ],
      },
      {
        id: "software",
        heading: "The device software",
        blocks: [
          "You may install the device software only on computers you own or are authorised to manage. If a computer belongs to your employer or someone else, get their permission first.",
          "The installer and the binaries are not code-signed yet, so Windows SmartScreen may warn you. The installer prints the SHA-256 of what it installs. You can check it against the SHA256SUMS published with each release.",
          "The software edits settings of the AI tools on your computer, always after backing up the original. The page What Manar changes on your computer lists every file. You can turn protection off for a tool, which restores its backup, or uninstall Manar, which restores all of them.",
          "The software is licensed under Apache-2.0 where it is open source. These terms govern the hosted Service.",
        ],
      },
      {
        id: "acceptable-use",
        heading: "Acceptable use",
        blocks: [
          "You must follow the Acceptable Use policy, which is part of these terms.",
        ],
      },
      {
        id: "your-data",
        heading: "Your data",
        blocks: [
          "You own your data. You give us the right to host, process and show it only to run the Service for you. The Privacy Policy explains what we collect and why.",
          "You may export your audit record at any time. You may delete your account whenever you like: the workspace is deleted after a 30-day grace period that you can cancel, and we offer an export first.",
          "A free workspace with no activity for 60 days is archived, and after the archive period it is dropped. We email you a warning before each step.",
        ],
      },
      {
        id: "product-data",
        heading: "Product improvement data and AI training",
        blocks: [
          "Manar collects product improvement data, such as console usage, device health, statistics about AI activity and a small number of redacted samples of commands and domains, to find bugs and improve the Service. It may also use that data, de-identified, to train and test Manar's own AI models. Both are on by default and each has its own off switch in Settings, and workspace managers on Company and Government plans can turn them off for the whole workspace. Using the Service does not depend on either. The Privacy Policy explains what is collected, what is never collected, how long it is kept and your rights.",
          "You give Fixio a worldwide, royalty-free, non-exclusive, perpetual licence to use, copy and analyse de-identified and aggregated data derived from your use of the Service, in a form that does not identify you or your organisation, to operate, secure and improve the Service and to develop Manar's own AI models. This licence does not cover your AI activity record, the contents of your files, your prompts or AI replies, or your secrets, and it does not let us sell that data or use it for advertising.",
        ],
      },
      {
        id: "dpa",
        heading: "Company and Government workspaces",
        blocks: [
          "For Company and Government workspaces, the Data Processing Agreement published at manar.vax.sh/en/dpa forms part of these terms. It sets out how Fixio processes workspace data on the customer's behalf.",
        ],
      },
      {
        id: "limits",
        heading: "What Manar cannot promise",
        blocks: [
          "Manar reduces risk. It does not remove it. Some tools allow Manar to approve or deny their actions, and some only let it observe, as the coverage page says. A tool can change how it works without telling us, and software on a computer can be bypassed by someone with enough access to that computer.",
          "AI tools make mistakes and act on their own. You stay responsible for what the tools you run do, and for your own decisions on approval requests.",
        ],
      },
      {
        id: "open-source",
        heading: "Open source and trademarks",
        blocks: [
          "The open core of Manar is released under the Apache-2.0 licence in the manarhq organisation on GitHub. The Manar name and mark are trademarks of Fixio. The licence does not grant rights in them.",
        ],
      },
      {
        id: "suspension",
        heading: "Suspension and ending",
        blocks: [
          "You can stop using Manar at any time. We may suspend or close an account that breaks these terms, puts the Service or other people at risk, or does not pay. Where we can, we warn you first and give you a chance to export.",
          "Sections that by their nature should survive ending, such as payment owed, liability and governing law, do.",
        ],
      },
      {
        id: "liability",
        heading: "Warranty and liability",
        blocks: [
          "The Service is provided as is and as available. To the extent the law allows, we give no warranty that it is error free, always available or fits a particular purpose.",
          "To the extent the law allows, Fixio is not liable for indirect or consequential loss, lost profit or lost data. Our total liability for any claim is limited to the amount you paid us in the 12 months before the claim, or USD 100 for free accounts. Nothing here limits liability that the law does not allow to be limited.",
        ],
      },
      {
        id: "law",
        heading: "Governing law and changes",
        blocks: [
          "These terms are governed by the federal laws of the United Arab Emirates and the laws of the Emirate of Dubai. The onshore courts of the Emirate of Dubai have jurisdiction over any dispute about them. If you are a consumer, this choice does not take away the protection of the mandatory laws of the country where you live, including the consumer laws of the European Union and of US states, and you may also bring a claim in the courts where you live if that law allows it.",
          "We may change these terms. For a material change we email account owners at least 14 days before it takes effect. Using the Service after that means you accept the change.",
          "Questions: support@fixio.ae. Privacy questions: privacy@fixio.ae.",
        ],
      },
    ],
  },
  ar: {
    title: "شروط الخدمة",
    description: "شروط استخدام منار، وهو منتج من Fixio: الحسابات والخطط والفوترة وبرنامج الجهاز والاستخدام المقبول والمسؤولية.",
    updated: "2026-11-02",
    sections: [
      {
        id: "about",
        heading: "من نحن وما الذي تغطيه هذه الشروط",
        blocks: [
          "منار منتج من \u2068Fixio Technologies LLC SPC\u2069 (ويُشار إليها بـ Fixio أو نحن)، وعنوانها \u20681st Oud Maitha Street, Abu Dhabi, United Arab Emirates\u2069 (شارع عود ميثاء الأول، أبوظبي، الإمارات العربية المتحدة). هذه الشروط عقد بينك وبين Fixio. وهي تغطي موقع منار على manar.vax.sh ولوحة تحكم منار على console-manar.vax.sh وبرنامج جهاز منار (manar-edge) والخدمة المستضافة معاً (الخدمة).",
          "بإنشاء حساب أو تثبيت برنامج الجهاز أو استخدام الخدمة فإنك توافق على هذه الشروط. وإذا استخدمت منار باسم شركة فإنك تؤكد أن لك صلاحية إلزامها، وتكون هي العميل.",
          "العملاء على خطة المؤسسات أو على تثبيت مستضاف لدى العميل يوقّعون اتفاقية مكتوبة منفصلة. وإذا تعارضت معها هذه الشروط فالاتفاقية المكتوبة هي المعتمدة.",
        ],
      },
      {
        id: "accounts",
        heading: "حسابك",
        blocks: [
          "تسجّل الدخول عبر Microsoft أو GitHub أو رابط بريد إلكتروني. عليك تقديم معلومات صحيحة وحماية طرق تسجيل الدخول وإبلاغنا فوراً إذا ظننت أن أحداً آخر وصل إلى حسابك.",
          "يجب ألا يقل عمرك عن 18 عاماً لاستخدام منار، وإذا كان سن الرشد في بلد إقامتك أعلى من ذلك فيجب أن تكون قد بلغته. وأنت مسؤول عما يحدث عبر حسابك.",
          "يجوز للشخص الواحد امتلاك مساحة عمل شخصية مجانية واحدة. ويجوز لنا إغلاق مساحات العمل المجانية الإضافية التي فُتحت للالتفاف على حدود الخطة.",
        ],
      },
      {
        id: "service",
        heading: "الخدمة وخططها",
        blocks: [
          "يراقب منار أدوات الذكاء الاصطناعي على الحواسيب التي تسجّلها، ويستطيع سؤالك قبل الإجراءات الخطرة حيثما تسمح الأداة بذلك، وينبّهك عندما تلمس أداة ما أسراراً، ويحتفظ بسجل موقّع. ما يستطيع منار فعله لكل أداة مبيّن في صفحة التغطية، وتلك الصفحة، لا العبارات التسويقية، هي البيان المعتمد لما نقدمه.",
          {
            table: {
              head: ["الخطة", "السعر (بالدولار الأمريكي)", "الحدود"],
              rows: [
                ["مجاني", "$0", "3 أجهزة و10 وكلاء وسجل تدقيق 30 يوماً ووكيل سحابي واحد"],
                ["Personal Pro", "$9 شهرياً أو $90 سنوياً", "10 أجهزة ووكلاء غير محدودين وسجل تدقيق سنة و5 وكلاء سحابيين وفحص TLS ودعم أولوية عبر البريد"],
                ["الشركات", "$15 لكل مستخدم شهرياً، و$5 لكل جهاز إضافي", "3 أجهزة لكل مستخدم ضمن السعر. المستخدم المحتسب هو كل من لديه جهاز مسجّل أو دخل إلى لوحة التحكم في ذلك الشهر. تجربة 30 يوماً بحد 25 جهازاً وجميع الميزات"],
                ["المؤسسات", "بعرض سعر", "ترخيص موقّع. المركز والاتحاد بين البيئات وتثبيت معزول عن الشبكة ونشر للجهات الحكومية وإثبات TPM وحزم الامتثال"],
              ],
            },
          },
          "يجوز لنا تحسين الميزات أو تغييرها أو إيقافها. وإذا أزلنا ميزة مدفوعة فسنبلغك مسبقاً ونردّ لك الجزء غير المستخدم مما دفعته مقابلها.",
        ],
      },
      {
        id: "billing",
        heading: "الدفع والضريبة والتجارب",
        blocks: [
          "الأسعار بالدولار الأمريكي. وللمشترين داخل الإمارات نضيف ضريبة قيمة مضافة بنسبة 5%. تتولى Stripe، معالج الدفع لدينا، بيانات بطاقتك، ولا نراها ولا نخزّنها. وFixio هي البائع المسجّل وتظهر في إيصالك.",
          "تتجدد الخطط المدفوعة شهرياً أو سنوياً حتى تلغيها من بوابة الفوترة. الإلغاء يوقف التجديد التالي، وتحتفظ بالميزات المدفوعة حتى نهاية المدة التي دفعت عنها. الرسوم المدفوعة لا تُسترد إلا إذا أوجب القانون ذلك أو ذكرنا خلاف ذلك كتابةً.",
          "يُحتسب استخدام الشركات يومياً ويُفوتر عن الشهر. تجربة الشركات مدتها 30 يوماً، وإذا انتهت دون دفع تصبح مساحة العمل للقراءة فقط مع إمكانية التصدير.",
          "إذا انتقلت إلى خطة أدنى أو تعذّر الدفع فإن الأجهزة المسجّلة سابقاً تبقى محمية، ويُرفض تسجيل أجهزة جديدة حتى تصبح ضمن الحد. أما التدقيق الأقدم مما تسمح به الخطة الجديدة فيُخفى ولا يُحذف لمدة 30 يوماً ثم يُسقط. والوكلاء السحابيون الزائدون عن الحد يُوقفون مؤقتاً ولا يُحذفون.",
        ],
      },
      {
        id: "software",
        heading: "برنامج الجهاز",
        blocks: [
          "يجوز لك تثبيت برنامج الجهاز فقط على الحواسيب التي تملكها أو المخوّل لك إدارتها. وإذا كان الحاسوب لجهة عملك أو لشخص آخر فاحصل على إذنه أولاً.",
          "المثبّت والملفات التنفيذية غير موقّعة رقمياً حالياً، لذلك قد يحذّرك Windows SmartScreen. يعرض المثبّت قيمة SHA-256 لما يثبّته، ويمكنك مقارنتها بملف SHA256SUMS المنشور مع كل إصدار.",
          "يعدّل البرنامج إعدادات أدوات الذكاء الاصطناعي على حاسوبك، وذلك دائماً بعد نسخ الأصل احتياطياً. وتسرد صفحة ما الذي يغيّره منار في حاسوبك كل ملف. ويمكنك إيقاف الحماية لأداة ما فتُستعاد نسختها الاحتياطية، أو إزالة منار فتُستعاد جميعها.",
          "يُرخَّص البرنامج بموجب Apache-2.0 حيثما كان مفتوح المصدر. وتحكم هذه الشروط الخدمة المستضافة.",
        ],
      },
      {
        id: "acceptable-use",
        heading: "الاستخدام المقبول",
        blocks: ["عليك الالتزام بسياسة الاستخدام المقبول، وهي جزء من هذه الشروط."],
      },
      {
        id: "your-data",
        heading: "بياناتك",
        blocks: [
          "بياناتك ملك لك. وأنت تمنحنا حق استضافتها ومعالجتها وعرضها فقط لتشغيل الخدمة لك. وتشرح سياسة الخصوصية ما نجمعه ولماذا.",
          "يمكنك تصدير سجل التدقيق في أي وقت. ويمكنك حذف حسابك متى شئت: تُحذف مساحة العمل بعد مهلة مدتها 30 يوماً يمكنك إلغاؤها، ونعرض عليك التصدير أولاً.",
          "مساحة العمل المجانية التي لا نشاط فيها لمدة 60 يوماً تُؤرشف، وبعد مدة الأرشفة تُسقط. ونرسل إليك بريداً تحذيرياً قبل كل خطوة.",
        ],
      },
      {
        id: "product-data",
        heading: "بيانات تحسين المنتج وتدريب الذكاء الاصطناعي",
        blocks: [
          "يجمع منار بيانات تحسين المنتج، مثل استخدام لوحة التحكم وسلامة الأجهزة وإحصاءات نشاط الذكاء الاصطناعي وعدد قليل من العيّنات المنقّحة للأوامر والنطاقات، لاكتشاف الأعطال وتحسين الخدمة. وقد يستخدم هذه البيانات أيضاً، بعد إزالة ما يحدد الهوية، لتدريب نماذج الذكاء الاصطناعي الخاصة بمنار واختبارها. والأمران مفعّلان افتراضياً ولكل منهما مفتاح إيقاف مستقل في الإعدادات، ويستطيع مديرو مساحات العمل في خطتي الشركات والجهات الحكومية إيقافهما لمساحة العمل كلها. ولا يتوقف استخدام الخدمة على أي منهما. وتشرح سياسة الخصوصية ما نجمعه وما لا نجمعه أبداً ومدة الاحتفاظ به وحقوقك.",
          "تمنح Fixio ترخيصاً عالمياً غير حصري ودائماً ودون مقابل لاستخدام البيانات المجمّعة والبيانات التي أزيل منها ما يحدد الهوية، المستمدة من استخدامك للخدمة، ونسخها وتحليلها، بصورة لا تحدد هويتك ولا هوية مؤسستك، وذلك لتشغيل الخدمة وحمايتها وتحسينها ولتطوير نماذج الذكاء الاصطناعي الخاصة بمنار. ولا يشمل هذا الترخيص سجل نشاط الذكاء الاصطناعي لديك ولا محتوى ملفاتك ولا رسائلك أو ردود الذكاء الاصطناعي ولا أسرارك، ولا يجيز لنا بيع تلك البيانات أو استخدامها للإعلان.",
        ],
      },
      {
        id: "dpa",
        heading: "مساحات عمل الشركات والجهات الحكومية",
        blocks: [
          "في مساحات عمل الشركات والجهات الحكومية، تُعدّ اتفاقية معالجة البيانات المنشورة على manar.vax.sh/ar/dpa جزءاً من هذه الشروط، وهي تبيّن كيف تعالج Fixio بيانات مساحة العمل لصالح العميل.",
        ],
      },
      {
        id: "limits",
        heading: "ما لا يستطيع منار الوعد به",
        blocks: [
          "يقلّل منار المخاطر ولا يزيلها. بعض الأدوات تتيح لمنار الموافقة على إجراءاتها أو رفضها، وبعضها لا يتيح إلا المراقبة، كما تبيّن صفحة التغطية. وقد تغيّر الأداة طريقة عملها دون إبلاغنا، ويمكن لمن يملك صلاحيات كافية على الحاسوب تجاوز أي برنامج عليه.",
          "تخطئ أدوات الذكاء الاصطناعي وتتصرف من تلقاء نفسها. وتبقى مسؤولاً عمّا تفعله الأدوات التي تشغّلها وعن قراراتك في طلبات الموافقة.",
        ],
      },
      {
        id: "open-source",
        heading: "المصدر المفتوح والعلامات التجارية",
        blocks: [
          "النواة المفتوحة لمنار منشورة بترخيص Apache-2.0 في منظمة manarhq على GitHub. واسم منار وشعاره علامتان تجاريتان لـ Fixio، ولا يمنح الترخيص أي حقوق فيهما.",
        ],
      },
      {
        id: "suspension",
        heading: "التعليق والإنهاء",
        blocks: [
          "يمكنك التوقف عن استخدام منار في أي وقت. ويجوز لنا تعليق أو إغلاق حساب يخالف هذه الشروط أو يعرّض الخدمة أو الآخرين للخطر أو لا يسدد المستحقات. وحيثما أمكن ننبّهك أولاً ونتيح لك التصدير.",
          "البنود التي تقتضي طبيعتها استمرارها بعد الإنهاء، مثل المبالغ المستحقة والمسؤولية والقانون الواجب التطبيق، تظل سارية.",
        ],
      },
      {
        id: "liability",
        heading: "الضمان والمسؤولية",
        blocks: [
          "تُقدَّم الخدمة كما هي وحسب توافرها. وفي حدود ما يسمح به القانون لا نضمن خلوها من الأخطاء أو توافرها دائماً أو ملاءمتها لغرض معيّن.",
          "وفي حدود ما يسمح به القانون لا تتحمل Fixio أي خسارة غير مباشرة أو تبعية أو فوات ربح أو فقدان بيانات. ويقتصر إجمالي مسؤوليتنا عن أي مطالبة على المبلغ الذي دفعته لنا خلال الاثني عشر شهراً السابقة للمطالبة، أو 100 دولار أمريكي للحسابات المجانية. ولا يحدّ شيء هنا من مسؤولية لا يجيز القانون تحديدها.",
        ],
      },
      {
        id: "law",
        heading: "القانون الواجب التطبيق والتعديلات",
        blocks: [
          "تخضع هذه الشروط للقوانين الاتحادية لدولة الإمارات العربية المتحدة ولقوانين إمارة دبي، وتختص محاكم إمارة دبي المحلية (غير محاكم مركز دبي المالي العالمي) بالنظر في أي نزاع بشأنها. وإذا كنت مستهلكاً فإن هذا الاختيار لا يحرمك من حماية القوانين الآمرة في بلد إقامتك، بما فيها قوانين حماية المستهلك في الاتحاد الأوروبي والولايات الأمريكية، ويمكنك أيضاً رفع دعوى أمام محاكم بلد إقامتك إذا أجاز لك قانونه ذلك.",
          "يجوز لنا تعديل هذه الشروط. وعند أي تعديل جوهري نرسل بريداً إلى مالكي الحسابات قبل 14 يوماً على الأقل من سريانه. واستمرارك في استخدام الخدمة بعد ذلك يعني قبولك للتعديل.",
          "للاستفسار: support@fixio.ae. ولأسئلة الخصوصية: privacy@fixio.ae.",
        ],
      },
    ],
  },
}
