import type { Locale } from "../../i18n/config.ts"

import type { LegalDoc } from "../schema.ts"

/*
 * Draft of 2 Nov 2026, written by Claude to the founder's data collection design, not yet reviewed
 * by a lawyer. Applies to Company and Government workspaces and forms part of the Terms for them.
 * GDPR Art. 28 terms, SCCs (Decision (EU) 2021/914, modules 2 and 3) by reference. No TRN or
 * trade licence number here.
 */
export const dpa: Record<Locale, LegalDoc> = {
  en: {
    title: "Data Processing Agreement",
    description: "The data processing terms for Manar Company and Government workspaces: Fixio's duties as processor, subprocessors, transfers, breach notice and deletion.",
    updated: "2026-11-02",
    sections: [
      {
        id: "scope",
        heading: "Who this applies to",
        blocks: [
          "This Data Processing Agreement (DPA) applies only to Company and Government workspaces. For those plans it forms part of the Terms of Service between the customer and Fixio Technologies LLC SPC, 1st Oud Maitha Street, Abu Dhabi, United Arab Emirates (Fixio). The customer accepts it when it accepts the Terms for such a workspace. It does not apply to personal Free and Pro workspaces.",
          "If the customer has signed a written agreement with Fixio that contains its own data processing terms, those terms apply instead of this page.",
          "In this DPA, workspace data means the personal data the customer and its users put into or generate in the workspace through the Service: accounts, devices, the AI activity record and secret alerts. Words such as controller, processor, personal data and personal data breach have the meaning given in the GDPR (EU) 2016/679 and, for the UAE, in Federal Decree-Law No. 45 of 2021 (PDPL).",
        ],
      },
      {
        id: "roles",
        heading: "Roles",
        blocks: [
          {
            list: [
              "Workspace data: the customer is the controller and Fixio is the processor. Fixio processes it only to provide the Service.",
              "Product improvement data, as described in the Privacy Policy: Fixio is the controller. Workspace managers can turn product improvement data and its use for AI training off for every member of the workspace in the workspace settings. Fixio then stops collecting it for that workspace and deletes the samples already stored for it.",
              "Account and billing data Fixio needs to run the customer relationship, such as invoices and tax records: Fixio is the controller.",
            ],
          },
        ],
      },
      {
        id: "processing-details",
        heading: "Details of the processing",
        blocks: [
          {
            table: {
              head: ["Item", "Details"],
              rows: [
                ["Subject matter and purpose", "Providing the Service: signing users in, showing devices and AI activity, asking for and recording approvals, keeping the signed activity record, alerting on secrets, support and security"],
                ["Duration", "The term of the customer's subscription, then deletion as set out below"],
                ["Nature", "Collection from the device software and the console, storage, display, export and deletion"],
                ["Data subjects", "The customer's users and staff whose computers are enrolled, and people named in records the customer chooses to keep"],
                ["Categories of data", "Name, email address, sign-in identifiers, device and machine identifiers, computer names, IP addresses, and records of AI tool actions such as commands and masked file paths"],
                ["Special categories", "None intended. The customer should not put special category data into the Service"],
              ],
            },
          },
        ],
      },
      {
        id: "fixio-duties",
        heading: "Fixio's duties as processor",
        blocks: [
          "As required by Article 28 of the GDPR, Fixio will:",
          {
            list: [
              "process workspace data only on the customer's documented instructions, which are these terms, the customer's use and settings of the Service, and any other written instruction the customer gives, unless the law requires otherwise, in which case Fixio will tell the customer first where the law allows;",
              "tell the customer if it believes an instruction breaks data protection law;",
              "make sure the people who process workspace data are bound to confidentiality;",
              "keep appropriate technical and organisational security measures in place, as described below;",
              "use subprocessors only as set out below;",
              "help the customer answer requests from data subjects, taking into account the nature of the processing, and pass on to the customer any such request it receives directly;",
              "help the customer with security, breach notification, data protection impact assessments and prior consultation with authorities, as far as these concern the Service;",
              "delete or return workspace data at the end of the Service, as set out below;",
              "make available the information needed to show it meets these duties, and allow audits as set out below.",
            ],
          },
        ],
      },
      {
        id: "security",
        heading: "Security measures",
        blocks: [
          {
            list: [
              "Each workspace has its own database, hosted on Microsoft Azure in UAE North.",
              "Devices talk to the Service over mutually authenticated TLS, and all traffic is encrypted in transit. Data at rest is encrypted by the hosting platform, and backups are encrypted.",
              "Access is limited by role and to staff who need it. Secrets are held in a managed secret store.",
              "The activity record is signed so changes can be detected.",
              "Logs and telemetry carry no secrets, tokens or prompt content.",
            ],
          },
          "No system is perfectly secure. Fixio reviews these measures and may change them, but never in a way that lowers the overall protection of workspace data.",
        ],
      },
      {
        id: "subprocessors",
        heading: "Subprocessors",
        blocks: [
          "The customer gives Fixio general authorisation to use the following subprocessors for workspace data:",
          {
            table: {
              head: ["Subprocessor", "Purpose", "Where"],
              rows: [
                ["Microsoft Azure", "Hosting, databases and email delivery", "UAE North"],
                ["Cloudflare", "Network delivery, DNS and security", "Global network, including outside the UAE"],
                ["Microsoft and GitHub", "Sign-in, when a user chooses them", "Their own infrastructure"],
                ["Stripe", "Payments and invoices for the workspace", "Stripe's infrastructure, including outside the UAE"],
              ],
            },
          },
          "PostHog (EU) receives only data for which Fixio is the controller, as the Privacy Policy explains, and is not a subprocessor for workspace data.",
          "Fixio binds each subprocessor by written terms that protect the data at least as well as this DPA, and stays responsible for its subprocessors. Fixio will give at least 30 days' notice by email to workspace owners before adding or replacing a subprocessor. The customer may object on reasonable data protection grounds within that time. If the parties cannot resolve the objection, the customer may end the affected subscription and receive a refund of fees paid for the unused period.",
        ],
      },
      {
        id: "breach",
        heading: "Personal data breaches",
        blocks: [
          "Fixio will notify the customer without undue delay, and in any case within 72 hours, after becoming aware of a personal data breach affecting workspace data. The notice will describe, as far as then known, what happened, the categories and approximate number of people and records concerned, the likely consequences, and the measures taken or proposed. Fixio will add information as it learns more, and will take reasonable steps to contain the breach and limit its effects.",
        ],
      },
      {
        id: "transfers",
        heading: "International transfers",
        blocks: [
          "Workspace data is hosted in the United Arab Emirates. The UAE does not have an adequacy decision from the European Commission. Where the GDPR applies to a transfer of workspace data to Fixio or onward to a subprocessor, the Standard Contractual Clauses adopted by Commission Implementing Decision (EU) 2021/914 are incorporated into this DPA by reference: Module 2 (controller to processor) where the customer is a controller, and Module 3 (processor to processor) where the customer is itself a processor. The customer is the data exporter and Fixio is the data importer.",
          {
            list: [
              "Clause 7 (docking clause) does not apply.",
              "Clause 9: option 2, general written authorisation, with the 30 days' notice set out above.",
              "Clause 11: the optional redress wording does not apply.",
              "Clause 13: the supervisory authority is the one competent for the customer as data exporter.",
              "Clauses 17 and 18: the law and the courts of the EU Member State in which the customer is established, or Ireland if the customer is not established in the EU.",
              "Annex I is the section Details of the processing, Annex II is the section Security measures, and Annex III is the section Subprocessors.",
            ],
          },
          "For transfers from the United Kingdom, the UK International Data Transfer Addendum to the Standard Contractual Clauses applies, and for transfers from Switzerland, the adaptations of the Standard Contractual Clauses recognised by the Swiss Federal Data Protection and Information Commissioner (FDPIC) apply. If the Standard Contractual Clauses conflict with this DPA, the Clauses win. Transfers under the PDPL rely on the safeguards the PDPL allows, including these terms.",
        ],
      },
      {
        id: "audits",
        heading: "Audits",
        blocks: [
          "Fixio will show that it meets this DPA mainly through documentation: written answers to reasonable security questionnaires, descriptions of its measures, and any reports or certifications it holds. Where documentation is not enough to show compliance, or a supervisory authority requires it, the customer may carry out an audit itself or through an independent auditor bound to confidentiality, once a year, with at least 30 days' notice, during business hours, without disturbing other customers, and at its own cost.",
        ],
      },
      {
        id: "deletion",
        heading: "Return and deletion",
        blocks: [
          "The customer can export its AI activity record at any time while the workspace is active. When the subscription ends, the workspace becomes read-only with export for 30 days. After that, Fixio deletes the workspace data, including its signed record. Encrypted backups roll off on their normal cycle, no later than 7 days after deletion. Fixio keeps workspace data longer only where the law requires it, and then keeps protecting it under this DPA. On request, Fixio will confirm the deletion in writing.",
        ],
      },
      {
        id: "us-laws",
        heading: "US state privacy laws",
        blocks: [
          "Where the CCPA as amended by the CPRA or a similar US state law applies, Fixio acts as the customer's service provider for workspace data. Fixio will not sell or share it, will not keep, use or disclose it outside the direct business relationship with the customer or for any purpose other than providing the Service, will not combine it with personal information from other sources except as those laws allow, and will tell the customer if it can no longer meet these duties.",
        ],
      },
      {
        id: "general",
        heading: "General",
        blocks: [
          "This DPA lasts as long as Fixio processes workspace data. Liability under it is subject to the limits in the Terms of Service, except where the law does not allow such a limit. If this DPA conflicts with the Terms on data protection, this DPA wins. Questions: privacy@fixio.ae.",
        ],
      },
    ],
  },
  ar: {
    title: "اتفاقية معالجة البيانات",
    description: "شروط معالجة البيانات لمساحات عمل الشركات والجهات الحكومية في منار: التزامات Fixio بصفتها معالِجاً والمعالِجون الفرعيون والنقل والإبلاغ عن الاختراق والحذف.",
    updated: "2026-11-02",
    sections: [
      {
        id: "scope",
        heading: "على من تنطبق",
        blocks: [
          "تنطبق اتفاقية معالجة البيانات هذه على مساحات عمل الشركات والجهات الحكومية فقط. وهي في هاتين الخطتين جزء من شروط الخدمة بين العميل و⁨Fixio Technologies LLC SPC, 1st Oud Maitha Street, Abu Dhabi, United Arab Emirates⁩ (شارع عود ميثاء الأول، أبوظبي، الإمارات العربية المتحدة) (ويُشار إليها بـ Fixio). ويقبلها العميل حين يقبل الشروط لمساحة عمل من هذا النوع. ولا تنطبق على مساحات العمل الشخصية المجانية وPro.",
          "إذا وقّع العميل مع Fixio اتفاقية مكتوبة تتضمن شروطاً خاصة بها لمعالجة البيانات، فتلك الشروط هي التي تنطبق بدلاً من هذه الصفحة.",
          "يُقصد ببيانات مساحة العمل في هذه الاتفاقية البيانات الشخصية التي يُدخلها العميل ومستخدموه في مساحة العمل أو تنشأ فيها عبر الخدمة: الحسابات والأجهزة وسجل نشاط الذكاء الاصطناعي وتنبيهات الأسرار. ولمصطلحات مثل المتحكّم والمعالِج والبيانات الشخصية واختراق البيانات الشخصية المعنى الوارد في اللائحة العامة لحماية البيانات (EU) 2016/679 (GDPR)، وفي دولة الإمارات المعنى الوارد في المرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية.",
        ],
      },
      {
        id: "roles",
        heading: "الأدوار",
        blocks: [
          {
            list: [
              "بيانات مساحة العمل: العميل هو المتحكّم وFixio هي المعالِج، ولا تعالجها Fixio إلا لتقديم الخدمة.",
              "بيانات تحسين المنتج كما تصفها سياسة الخصوصية: Fixio هي المتحكّمة. ويستطيع مديرو مساحة العمل إيقاف بيانات تحسين المنتج واستخدامها في تدريب الذكاء الاصطناعي لجميع أعضاء مساحة العمل من إعداداتها، فتتوقف Fixio عن جمعها لتلك المساحة وتحذف العيّنات المحفوظة لها.",
              "بيانات الحساب والفوترة التي تحتاجها Fixio لإدارة علاقتها بالعميل، مثل الفواتير والسجلات الضريبية: Fixio هي المتحكّمة.",
            ],
          },
        ],
      },
      {
        id: "processing-details",
        heading: "تفاصيل المعالجة",
        blocks: [
          {
            table: {
              head: ["البند", "التفاصيل"],
              rows: [
                ["الموضوع والغرض", "تقديم الخدمة: تسجيل دخول المستخدمين وعرض الأجهزة ونشاط الذكاء الاصطناعي وطلب الموافقات وتسجيلها وحفظ سجل النشاط الموقّع والتنبيه بشأن الأسرار والدعم والأمان"],
                ["المدة", "مدة اشتراك العميل، ثم الحذف كما هو مبيّن أدناه"],
                ["طبيعة المعالجة", "الجمع من برنامج الجهاز ولوحة التحكم، والتخزين والعرض والتصدير والحذف"],
                ["أصحاب البيانات", "مستخدمو العميل وموظفوه الذين سُجّلت حواسيبهم، والأشخاص المذكورون في السجلات التي يختار العميل حفظها"],
                ["فئات البيانات", "الاسم والبريد الإلكتروني ومعرّفات تسجيل الدخول ومعرّفات الأجهزة وأسماء الحواسيب وعناوين IP وسجلات إجراءات أدوات الذكاء الاصطناعي مثل الأوامر ومسارات الملفات المخفية جزئياً"],
                ["الفئات الخاصة", "لا يُقصد معالجة أي منها. وعلى العميل ألا يُدخل بيانات من الفئات الخاصة في الخدمة"],
              ],
            },
          },
        ],
      },
      {
        id: "fixio-duties",
        heading: "التزامات Fixio بصفتها معالِجاً",
        blocks: [
          "وفق ما تقتضيه المادة 28 من اللائحة العامة لحماية البيانات، تلتزم Fixio بما يلي:",
          {
            list: [
              "ألا تعالج بيانات مساحة العمل إلا بتعليمات العميل الموثّقة، وهي هذه الشروط واستخدام العميل للخدمة وإعداداته فيها وأي تعليمات مكتوبة أخرى يقدمها، ما لم يوجب القانون غير ذلك، وعندها تبلغ العميل مسبقاً متى أجاز القانون ذلك؛",
              "أن تبلغ العميل إذا رأت أن تعليمات ما تخالف قانون حماية البيانات؛",
              "أن تضمن التزام من يعالجون بيانات مساحة العمل بالسرية؛",
              "أن تحافظ على تدابير أمنية تقنية وتنظيمية مناسبة، كما هو موصوف أدناه؛",
              "ألا تستعين بمعالِجين فرعيين إلا وفق ما هو مبيّن أدناه؛",
              "أن تساعد العميل في الرد على طلبات أصحاب البيانات، مع مراعاة طبيعة المعالجة، وأن تحيل إليه أي طلب من هذا النوع يصلها مباشرة؛",
              "أن تساعد العميل في الأمان والإبلاغ عن الاختراقات وتقييمات الأثر على حماية البيانات والتشاور المسبق مع الجهات المختصة، بقدر ما يتعلق ذلك بالخدمة؛",
              "أن تحذف بيانات مساحة العمل أو تعيدها عند انتهاء الخدمة، كما هو مبيّن أدناه؛",
              "أن توفر المعلومات اللازمة لإثبات وفائها بهذه الالتزامات، وأن تتيح التدقيق كما هو مبيّن أدناه.",
            ],
          },
        ],
      },
      {
        id: "security",
        heading: "التدابير الأمنية",
        blocks: [
          {
            list: [
              "لكل مساحة عمل قاعدة بيانات خاصة بها، مستضافة على Microsoft Azure في UAE North.",
              "تتصل الأجهزة بالخدمة عبر TLS بمصادقة متبادلة، وكل الحركة مشفّرة أثناء النقل. وتُشفَّر البيانات المخزّنة بواسطة منصة الاستضافة، والنسخ الاحتياطية مشفّرة.",
              "الوصول محدود بحسب الدور وبالموظفين الذين يحتاجونه. والأسرار محفوظة في مخزن أسرار مُدار.",
              "سجل النشاط موقّع لكشف أي تغيير.",
              "لا تحمل السجلات وبيانات القياس أي أسرار أو رموز مميزة أو محتوى رسائل.",
            ],
          },
          "لا يوجد نظام آمن تماماً. وتراجع Fixio هذه التدابير وقد تغيّرها، ولكن ليس بطريقة تخفض المستوى العام لحماية بيانات مساحة العمل.",
        ],
      },
      {
        id: "subprocessors",
        heading: "المعالِجون الفرعيون",
        blocks: [
          "يمنح العميل Fixio تفويضاً عاماً بالاستعانة بالمعالِجين الفرعيين التالين لبيانات مساحة العمل:",
          {
            table: {
              head: ["المعالِج الفرعي", "الغرض", "الموقع"],
              rows: [
                ["Microsoft Azure", "الاستضافة وقواعد البيانات وإرسال البريد", "UAE North"],
                ["Cloudflare", "توصيل الشبكة وDNS والأمان", "شبكة عالمية تشمل خارج الإمارات"],
                ["Microsoft وGitHub", "تسجيل الدخول، عندما يختارهما المستخدم", "بنيتهما التحتية"],
                ["Stripe", "مدفوعات مساحة العمل وفواتيرها", "بنية Stripe التحتية، وتشمل خارج الإمارات"],
              ],
            },
          },
          "لا يتلقى PostHog (الاتحاد الأوروبي) إلا بيانات تكون Fixio المتحكّمة فيها، كما توضّح سياسة الخصوصية، وليس معالِجاً فرعياً لبيانات مساحة العمل.",
          "تُلزم Fixio كل معالِج فرعي بشروط مكتوبة تحمي البيانات بقدر لا يقل عن هذه الاتفاقية، وتبقى مسؤولة عن معالِجيها الفرعيين. وتبلغ Fixio مالكي مساحة العمل بالبريد قبل 30 يوماً على الأقل من إضافة معالِج فرعي أو استبداله. ويجوز للعميل الاعتراض لأسباب معقولة تتعلق بحماية البيانات خلال تلك المدة. وإذا تعذّر على الطرفين حل الاعتراض، يجوز للعميل إنهاء الاشتراك المتأثر واسترداد الرسوم المدفوعة عن المدة غير المستخدمة.",
        ],
      },
      {
        id: "breach",
        heading: "اختراقات البيانات الشخصية",
        blocks: [
          "تبلغ Fixio العميل دون تأخير غير مبرر، وفي كل الأحوال خلال 72 ساعة، من علمها باختراق للبيانات الشخصية يمس بيانات مساحة العمل. ويصف الإبلاغ، بقدر ما هو معروف حينها، ما حدث وفئات الأشخاص والسجلات المعنية وعددها التقريبي والعواقب المحتملة والتدابير المتخذة أو المقترحة. وتضيف Fixio المعلومات كلما عرفت المزيد، وتتخذ خطوات معقولة لاحتواء الاختراق والحد من آثاره.",
        ],
      },
      {
        id: "transfers",
        heading: "النقل الدولي",
        blocks: [
          "تُستضاف بيانات مساحة العمل في دولة الإمارات العربية المتحدة، ولم يصدر للإمارات قرار كفاية من المفوضية الأوروبية. وحيثما تنطبق اللائحة العامة لحماية البيانات على نقل بيانات مساحة العمل إلى Fixio أو منها إلى معالِج فرعي، تُعدّ البنود التعاقدية القياسية المعتمدة بقرار المفوضية التنفيذي (EU) 2021/914 جزءاً من هذه الاتفاقية بالإحالة: الوحدة 2 (من متحكّم إلى معالِج) عندما يكون العميل متحكّماً، والوحدة 3 (من معالِج إلى معالِج) عندما يكون العميل نفسه معالِجاً. والعميل هو مُصدّر البيانات وFixio هي مستوردتها.",
          {
            list: [
              "لا ينطبق البند 7 (بند الانضمام).",
              "البند 9: الخيار 2، التفويض الكتابي العام، مع مهلة الإشعار البالغة 30 يوماً المبيّنة أعلاه.",
              "البند 11: لا تنطبق الصياغة الاختيارية بشأن سبل الانتصاف.",
              "البند 13: سلطة الرقابة هي السلطة المختصة بالعميل بصفته مُصدّر البيانات.",
              "البندان 17 و18: قانون ومحاكم الدولة العضو في الاتحاد الأوروبي التي يقع فيها مقر العميل، أو أيرلندا إذا لم يكن مقر العميل في الاتحاد الأوروبي.",
              "الملحق الأول هو قسم تفاصيل المعالجة، والملحق الثاني هو قسم التدابير الأمنية، والملحق الثالث هو قسم المعالِجون الفرعيون.",
            ],
          },
          "وفي النقل من المملكة المتحدة ينطبق ملحق النقل الدولي للبيانات الصادر في المملكة المتحدة (UK International Data Transfer Addendum) المرفق بالبنود التعاقدية القياسية، وفي النقل من سويسرا تنطبق تعديلات البنود التعاقدية القياسية التي يعترف بها المفوض الفيدرالي السويسري لحماية البيانات والمعلومات (FDPIC). وإذا تعارضت البنود التعاقدية القياسية مع هذه الاتفاقية فالبنود هي المعتمدة. ويعتمد النقل بموجب قانون حماية البيانات الشخصية الإماراتي على الضمانات التي يجيزها ذلك القانون، بما فيها هذه الشروط.",
        ],
      },
      {
        id: "audits",
        heading: "التدقيق",
        blocks: [
          "تثبت Fixio وفاءها بهذه الاتفاقية أساساً عبر الوثائق: إجابات مكتوبة على استبيانات الأمان المعقولة، ووصف لتدابيرها، وأي تقارير أو شهادات لديها. وحيثما لا تكفي الوثائق لإثبات الالتزام، أو طلبت ذلك سلطة رقابية، يجوز للعميل إجراء تدقيق بنفسه أو عبر مدقق مستقل ملتزم بالسرية، مرة واحدة في السنة، بإشعار لا يقل عن 30 يوماً، خلال ساعات العمل، دون إزعاج العملاء الآخرين، وعلى نفقته.",
        ],
      },
      {
        id: "deletion",
        heading: "الإعادة والحذف",
        blocks: [
          "يمكن للعميل تصدير سجل نشاط الذكاء الاصطناعي في أي وقت ما دامت مساحة العمل نشطة. وعند انتهاء الاشتراك تصبح مساحة العمل للقراءة فقط مع إمكانية التصدير لمدة 30 يوماً، ثم تحذف Fixio بيانات مساحة العمل بما فيها سجلها الموقّع. وتُحذف النسخ الاحتياطية المشفرة وفق دورتها المعتادة، في موعد لا يتجاوز 7 أيام بعد الحذف. ولا تحتفظ Fixio ببيانات مساحة العمل مدة أطول إلا إذا أوجب القانون ذلك، وتواصل عندها حمايتها بموجب هذه الاتفاقية. وتؤكد Fixio الحذف كتابةً عند الطلب.",
        ],
      },
      {
        id: "us-laws",
        heading: "قوانين الخصوصية في الولايات الأمريكية",
        blocks: [
          "حيثما ينطبق قانون خصوصية المستهلك في كاليفورنيا بصيغته المعدّلة بقانون حقوق الخصوصية في كاليفورنيا، أو قانون مماثل في ولاية أمريكية، تعمل Fixio مزوّدَ خدمة للعميل في ما يخص بيانات مساحة العمل. فلا تبيعها ولا تشاركها، ولا تحتفظ بها أو تستخدمها أو تفصح عنها خارج علاقة العمل المباشرة مع العميل أو لأي غرض غير تقديم الخدمة، ولا تدمجها مع معلومات شخصية من مصادر أخرى إلا بما تجيزه تلك القوانين، وتبلغ العميل إذا لم تعد قادرة على الوفاء بهذه الالتزامات.",
        ],
      },
      {
        id: "general",
        heading: "أحكام عامة",
        blocks: [
          "تسري هذه الاتفاقية ما دامت Fixio تعالج بيانات مساحة العمل. وتخضع المسؤولية بموجبها للحدود الواردة في شروط الخدمة، إلا حيث لا يجيز القانون هذا التحديد. وإذا تعارضت هذه الاتفاقية مع الشروط في ما يخص حماية البيانات فهذه الاتفاقية هي المعتمدة. للاستفسار: privacy@fixio.ae.",
        ],
      },
    ],
  },
}
