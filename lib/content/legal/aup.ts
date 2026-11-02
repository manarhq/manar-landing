import type { Locale } from "../../i18n/config.ts"

import type { LegalDoc } from "../schema.ts"

/** Launch draft (31 Oct 2026, updated 2 Nov 2026), approved by the founder to launch with, with no lawyer review (decision #19). Provider: Fixio Technologies LLC SPC. */
export const aup: Record<Locale, LegalDoc> = {
  en: {
    title: "Acceptable Use",
    description: "What you may and may not do with Manar, a product of Fixio. Part of the Terms of Service.",
    updated: "2026-11-02",
    sections: [
      {
        id: "purpose",
        heading: "Purpose",
        blocks: [
          "Manar, a product of Fixio Technologies LLC SPC, is a safety tool for the AI tools on computers you are entitled to manage. This policy is part of the Terms of Service and applies to everyone who uses the Service, including free accounts and company trials.",
        ],
      },
      {
        id: "do",
        heading: "What you may do",
        blocks: [
          {
            list: [
              "Install the device software on computers you own, or that your employer or the owner has authorised you to manage.",
              "Watch, approve, deny and record the actions of AI tools running on those computers.",
              "Connect your own AI accounts and cloud agents, under their own terms.",
              "Read, change and build on the open source code under its Apache-2.0 licence.",
            ],
          },
        ],
      },
      {
        id: "do-not",
        heading: "What you may not do",
        blocks: [
          {
            list: [
              "Install Manar on a computer without its owner's permission, or use it to spy on people. Manar must not be used to monitor a person who has not been told that AI tools on their computer are being watched.",
              "Use Manar to hide, enable or carry out harm, such as malware, fraud, intrusion into systems you are not authorised to test, or evasion of the law.",
              "Break or bypass plan limits, billing, rate limits or security controls, or create accounts to get around them.",
              "Probe, scan or test the Service for weaknesses without our written permission. To report a vulnerability, follow SECURITY.md in the manarhq repositories.",
              "Overload the Service, or send automated sign-ups, requests or enrolment codes in bulk.",
              "Upload or send unlawful content, or data you have no right to share, such as another person's secrets.",
              "Try to re-identify people or organisations from de-identified or aggregated data about the Service.",
              "Resell the hosted Service, or present it as your own.",
              "Use the Manar name or mark in a way that suggests we endorse you, except as the trademark note allows.",
            ],
          },
        ],
      },
      {
        id: "company-use",
        heading: "Company use",
        blocks: [
          "If you enrol your staff's computers, you must tell them first, as the law of your country requires. You are responsible for having the right to monitor those computers.",
        ],
      },
      {
        id: "enforcement",
        heading: "If you break this policy",
        blocks: [
          "We may limit, suspend or close an account, and remove devices or data, if this policy is broken or the Service or other people are at risk. Where we can, we warn you first and offer an export. We may report unlawful activity to the authorities.",
          "To report a breach or a concern: support@fixio.ae. Privacy concerns: privacy@fixio.ae.",
        ],
      },
    ],
  },
  ar: {
    title: "الاستخدام المقبول",
    description: "ما يجوز لك وما لا يجوز لك فعله مع منار، وهو منتج من Fixio. جزء من شروط الخدمة.",
    updated: "2026-11-02",
    sections: [
      {
        id: "purpose",
        heading: "الغرض",
        blocks: [
          "منار، وهو منتج من \u2068Fixio Technologies LLC SPC\u2069، أداة أمان لأدوات الذكاء الاصطناعي على الحواسيب التي يحق لك إدارتها. وهذه السياسة جزء من شروط الخدمة وتنطبق على كل من يستخدم الخدمة، بما في ذلك الحسابات المجانية وتجارب الشركات.",
        ],
      },
      {
        id: "do",
        heading: "ما يجوز لك فعله",
        blocks: [
          {
            list: [
              "تثبيت برنامج الجهاز على حواسيب تملكها أو خوّلك صاحبها أو جهة عملك إدارتها.",
              "مراقبة إجراءات أدوات الذكاء الاصطناعي العاملة على تلك الحواسيب والموافقة عليها ورفضها وتسجيلها.",
              "ربط حساباتك الخاصة بالذكاء الاصطناعي ووكلائك السحابيين، بموجب شروطها الخاصة.",
              "قراءة الشيفرة المفتوحة وتعديلها والبناء عليها بموجب ترخيص Apache-2.0.",
            ],
          },
        ],
      },
      {
        id: "do-not",
        heading: "ما لا يجوز لك فعله",
        blocks: [
          {
            list: [
              "تثبيت منار على حاسوب دون إذن مالكه، أو استخدامه للتجسس على الناس. ولا يجوز استخدام منار لمراقبة شخص لم يُخبَر بأن أدوات الذكاء الاصطناعي على حاسوبه تُراقب.",
              "استخدام منار لإخفاء الأذى أو تمكينه أو تنفيذه، مثل البرمجيات الخبيثة أو الاحتيال أو اختراق أنظمة لست مخوّلاً باختبارها أو التحايل على القانون.",
              "كسر حدود الخطة أو الفوترة أو حدود الطلبات أو ضوابط الأمان أو تجاوزها، أو إنشاء حسابات للالتفاف عليها.",
              "فحص الخدمة أو مسحها أو اختبارها بحثاً عن ثغرات دون إذن كتابي منا. وللإبلاغ عن ثغرة اتبع ملف SECURITY.md في مستودعات manarhq.",
              "إثقال الخدمة، أو إرسال تسجيلات أو طلبات أو رموز تسجيل أجهزة آلية بكميات كبيرة.",
              "رفع أو إرسال محتوى غير قانوني أو بيانات لا حق لك في مشاركتها، مثل أسرار شخص آخر.",
              "محاولة التعرّف على أشخاص أو مؤسسات من بيانات مجمّعة أو بيانات أزيل منها ما يحدد الهوية تتعلق بالخدمة.",
              "إعادة بيع الخدمة المستضافة أو تقديمها على أنها خدمتك.",
              "استخدام اسم منار أو شعاره بطريقة توحي بأننا نزكّيك، إلا بما تسمح به ملاحظة العلامة التجارية.",
            ],
          },
        ],
      },
      {
        id: "company-use",
        heading: "الاستخدام في الشركات",
        blocks: [
          "إذا سجّلت حواسيب موظفيك فعليك إبلاغهم أولاً، وفق ما يوجبه قانون بلدك. وأنت مسؤول عن امتلاك الحق في مراقبة تلك الحواسيب.",
        ],
      },
      {
        id: "enforcement",
        heading: "إذا خالفت هذه السياسة",
        blocks: [
          "يجوز لنا تقييد حساب أو تعليقه أو إغلاقه، وإزالة أجهزة أو بيانات، إذا خُرقت هذه السياسة أو تعرضت الخدمة أو الآخرون للخطر. وحيثما أمكن ننبّهك أولاً ونعرض عليك التصدير. وقد نبلغ الجهات المختصة عن أي نشاط غير قانوني.",
          "للإبلاغ عن مخالفة أو مخاوف: support@fixio.ae. ولمخاوف الخصوصية: privacy@fixio.ae.",
        ],
      },
    ],
  },
}
