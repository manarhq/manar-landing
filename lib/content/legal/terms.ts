import type { Locale } from "@/lib/i18n/config"

import type { LegalDoc } from "../schema.ts"

const ENTITY_EN = "[Registered address, licence number and issuing authority to be confirmed]"
const ENTITY_AR = "[العنوان المسجل ورقم الرخصة وجهة الإصدار قيد التأكيد]"
const LAW_EN = "[Governing law and jurisdiction to be confirmed]"
const LAW_AR = "[القانون الحاكم والاختصاص القضائي قيد التأكيد]"

export const terms: Record<Locale, LegalDoc> = {
  en: {
    title: "Terms of use",
    description: "The terms that apply when you use the Manar website, including illustrative content, intellectual property, and links.",
    updated: "2026-09-25",
    placeholders: [ENTITY_EN, LAW_EN],
    sections: [
      {
        id: "about",
        heading: "About these terms",
        blocks: [
          `These terms apply to your use of the Manar website at manar.vax.sh, operated by VAX Labs Cloud Computing Services L.L.C S.P.C, Abu Dhabi (VAX). ${ENTITY_EN}. By using the website you agree to them.`,
          "They cover the website only. Use of the Manar product is governed by a separate written agreement.",
        ],
      },
      {
        id: "using-the-site",
        heading: "Using the website",
        blocks: [
          "You may browse the website and request a demo for your own business purposes. Please do not:",
          {
            list: [
              "attempt to disrupt, overload, or gain unauthorised access to the website or its infrastructure;",
              "submit false details, other people's data without permission, or automated form submissions;",
              "copy the website's content for resale or to present it as your own.",
            ],
          },
          "A demo request is an enquiry. It does not create an agreement or any obligation on either side.",
        ],
      },
      {
        id: "illustrative-content",
        heading: "Illustrative content",
        blocks: [
          "The workspace views, decision examples, names, counts, and events shown on the website are illustrative sample data. They are not connected to a live environment and do not describe any real organization.",
          "Descriptions of capabilities and deployment options are general information. What applies to you is confirmed in writing during scoping. The website is provided as is, and to the extent the law allows we give no warranty that it is complete, current, or free of errors.",
        ],
      },
      {
        id: "intellectual-property",
        heading: "Intellectual property",
        blocks: [
          "The Manar name, the lighthouse mark, and the website's text, design, and code belong to VAX or its licensors. These terms do not grant you any licence to use them, other than viewing and sharing links to the website.",
        ],
      },
      {
        id: "links",
        heading: "Links to other websites",
        blocks: [
          "The website links to other websites, such as vax.sh. We do not control them and are not responsible for their content or privacy practices.",
        ],
      },
      {
        id: "liability",
        heading: "Liability and changes",
        blocks: [
          "To the extent the law allows, VAX is not liable for losses arising from use of, or inability to use, the website. Nothing in these terms limits liability that cannot be limited by law.",
          "We may update these terms or the website at any time. The date at the top shows the last real change to these terms.",
          `Governing law: ${LAW_EN}.`,
        ],
      },
      {
        id: "contact",
        heading: "Contact",
        blocks: ["Questions about these terms can be sent to nofal@vax.sh."],
      },
    ],
  },
  ar: {
    title: "شروط الاستخدام",
    description: "الشروط التي تنطبق عند استخدامك موقع منار، بما في ذلك المحتوى التوضيحي والملكية الفكرية والروابط.",
    updated: "2026-09-25",
    placeholders: [ENTITY_AR, LAW_AR],
    sections: [
      {
        id: "about",
        heading: "حول هذه الشروط",
        blocks: [
          `تنطبق هذه الشروط على استخدامك موقع منار على العنوان manar.vax.sh، الذي تشغّله شركة VAX Labs Cloud Computing Services L.L.C S.P.C في أبوظبي (VAX). ${ENTITY_AR}. وباستخدامك الموقع فإنك توافق عليها.`,
          "وتقتصر هذه الشروط على الموقع، أما استخدام منصة منار فتحكمه اتفاقية مكتوبة منفصلة.",
        ],
      },
      {
        id: "using-the-site",
        heading: "استخدام الموقع",
        blocks: [
          "يمكنك تصفح الموقع وطلب عرض توضيحي لأغراض عملك. ونرجو منك ألا:",
          {
            list: [
              "تحاول تعطيل الموقع أو إثقاله أو الوصول غير المصرح به إليه أو إلى بنيته التحتية؛",
              "ترسل بيانات غير صحيحة، أو بيانات أشخاص آخرين دون إذنهم، أو طلبات آلية عبر النموذج؛",
              "تنسخ محتوى الموقع لإعادة بيعه أو لتقديمه على أنه من عملك.",
            ],
          },
          "طلب العرض التوضيحي استفسار فقط، ولا ينشئ اتفاقًا أو أي التزام على أي من الطرفين.",
        ],
      },
      {
        id: "illustrative-content",
        heading: "المحتوى التوضيحي",
        blocks: [
          "واجهات مساحة العمل وأمثلة القرارات والأسماء والأعداد والأحداث المعروضة على الموقع بيانات توضيحية، غير متصلة ببيئة فعلية ولا تصف أي جهة حقيقية.",
          "أوصاف الإمكانات وخيارات النشر معلومات عامة، ويُؤكَّد ما ينطبق عليك كتابيًا أثناء تحديد النطاق. ويُقدَّم الموقع كما هو، وفي الحدود التي يسمح بها القانون لا نقدّم أي ضمان بأنه كامل أو محدّث أو خالٍ من الأخطاء.",
        ],
      },
      {
        id: "intellectual-property",
        heading: "الملكية الفكرية",
        blocks: [
          "اسم منار وشعار المنارة ونصوص الموقع وتصميمه وشيفرته مملوكة لـ VAX أو للجهات المرخِّصة لها. ولا تمنحك هذه الشروط أي ترخيص لاستخدامها سوى تصفح الموقع ومشاركة روابطه.",
        ],
      },
      {
        id: "links",
        heading: "روابط لمواقع أخرى",
        blocks: [
          "يتضمن الموقع روابط لمواقع أخرى مثل vax.sh. ولا نتحكم في هذه المواقع، ولسنا مسؤولين عن محتواها أو ممارساتها في الخصوصية.",
        ],
      },
      {
        id: "liability",
        heading: "المسؤولية والتعديلات",
        blocks: [
          "في الحدود التي يسمح بها القانون، لا تتحمل VAX المسؤولية عن الخسائر الناشئة عن استخدام الموقع أو تعذّر استخدامه. ولا يحدّ أي شيء في هذه الشروط من مسؤولية لا يجوز الحد منها قانونًا.",
          "قد نحدّث هذه الشروط أو الموقع في أي وقت. ويبيّن التاريخ في أعلى الصفحة آخر تعديل فعلي على هذه الشروط.",
          `القانون الحاكم: ${LAW_AR}.`,
        ],
      },
      {
        id: "contact",
        heading: "التواصل",
        blocks: ["للاستفسار عن هذه الشروط، راسلنا على nofal@vax.sh."],
      },
    ],
  },
}
