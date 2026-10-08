/**
 * The landing site's content model: every visible string, link and image, one document per
 * locale. manar-site seeds its CMS from the bundled documents and serves the published one at
 * GET /public/content/:locale; this schema validates both sides, so they stay one schema.
 *
 * Relative imports only (no "@/" aliases) so `node --test` and other repos can load this file.
 */
import { z } from "zod"

/** DESIGN-SYSTEM.md rule 15 and CLAUDE.md section 6, enforced on every string, including CMS edits. */
const DASHES = /[\u2012-\u2015]/
const BANNED = /\b(immutable|unhackable|tamper-proof|guaranteed|provably safe|physically impossible|production-ready|seamless)\b|100% safe/i
/** Checks run on the NFKC form, so full-width and compatibility characters cannot slip past. */
const nfkc = (s: string) => s.normalize("NFKC")

/** One visible string. Never empty, never a dash, never a banned word, never markup. */
export const text = z
  .string()
  .trim()
  .min(1)
  .max(4000)
  .refine((s) => !DASHES.test(nfkc(s)), "Use a period, comma, colon or hyphen instead of a dash")
  .refine((s) => !BANNED.test(nfkc(s)), "Contains a banned word (see docs/hackathon/LANGUAGE.md)")
  .refine((s) => !/[<>]/.test(nfkc(s)), "Plain text only")

/** Alt text: may be empty when the image is decorative and the adjacent text names it. */
const alt = z
  .string()
  .trim()
  .max(300)
  .refine((s) => !DASHES.test(nfkc(s)), "No dashes")
  .refine((s) => !/[<>]/.test(nfkc(s)), "Plain text only")

/** Same-origin page path, such as "/meet". Never a full URL, so content cannot point visitors off-site. */
const internalPath = z.string().regex(/^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/, "A same-site path such as /meet")

/** The only domains a contact address may use. Compared exactly against the part after "@". */
export const EMAIL_DOMAINS = ["fixio.ae"] as const

const contactEmail = z
  .email()
  .max(254)
  .refine((s) => (EMAIL_DOMAINS as readonly string[]).includes(s.split("@")[1]?.toLowerCase() ?? ""), {
    message: `An address at ${EMAIL_DOMAINS.join(", ")}`,
  })

/** The only external hosts the site links to. Compared exactly against the parsed hostname. */
export const EXTERNAL_HOSTS = ["vax.sh", "www.vax.sh", "manar.vax.sh"] as const

const httpsUrl = z
  .string()
  .max(2048)
  .refine((s) => !/[\\\u0000-\u001f\u007f\s]/.test(s), "No backslashes, spaces or control characters")
  .refine((s) => {
    try {
      const url = new URL(s)
      return (
        url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        !url.port &&
        (EXTERNAL_HOSTS as readonly string[]).includes(url.hostname)
      )
    } catch {
      return false
    }
  }, `An https link to one of: ${EXTERNAL_HOSTS.join(", ")}`)

/**
 * An image served from this site's /public folder (CSP img-src 'self'). Segment by segment: each
 * segment starts with a letter, digit, underscore or hyphen, so "//host", "/../" and "/./" fail.
 * No SVG: an edited or uploaded SVG can carry script.
 */
const imagePath = z
  .string()
  .max(512)
  .regex(/^(\/[A-Za-z0-9_-][A-Za-z0-9._-]*)+\.(png|webp|jpg|jpeg|avif)$/, "A raster image path under /public")
const image = z.strictObject({ src: imagePath, alt })

const field = z.object({ label: text, placeholder: text })
const strict = <T extends z.ZodRawShape>(shape: T) => z.strictObject(shape)

const legalBlock = z.union([
  text,
  strict({ list: z.array(text).min(1) }),
  strict({ table: strict({ head: z.array(text).min(1), rows: z.array(z.array(text).min(1)).min(1) }) }),
])

export const legalDocSchema = strict({
  title: text,
  /** Meta description, under 160 characters. */
  description: text.max(160),
  /** ISO date of the last real content change. */
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sections: z
    .array(strict({ id: z.string().regex(/^[a-z0-9-]+$/), heading: text, blocks: z.array(legalBlock).min(1) }))
    .min(1),
})

export const siteContentSchema = strict({
  meta: strict({
    homeTitle: text,
    homeDescription: text.max(160),
    demoTitle: text,
    demoDescription: text.max(200),
    siteName: text,
  }),

  common: strict({
    skipToContent: text,
    brandName: text,
    homeLink: text,
    endorsement: text,
    endorsementLink: text,
    bookDemo: text,
    primaryNav: text,
    openMenu: text,
    closeMenu: text,
    menuTitle: text,
    languageSwitch: text,
    languageSwitchLabel: text,
  }),

  site: strict({
    theme: strict({ label: text, system: text, light: text, dark: text }),
    search: strict({
      open: text,
      title: text,
      label: text,
      placeholder: text,
      hint: text,
      empty: text,
      results: text,
      close: text,
      groups: strict({ section: text, page: text }),
    }),
    backToTop: text,
    contact: strict({
      open: text,
      title: text,
      body: text,
      copy: text,
      copied: text,
      copyFailed: text,
      close: text,
    }),
    consent: strict({
      title: text,
      body: text,
      accept: text,
      reject: text,
      preferences: text,
      save: text,
      necessaryTitle: text,
      necessaryBody: text,
      analyticsTitle: text,
      analyticsBody: text,
      signalNote: text,
      policy: text,
      privacy: text,
      saved: text,
      dialogClose: text,
    }),
  }),

  nav: strict({ platform: text, howItWorks: text, deployment: text }),

  hero: strict({
    title: text.max(60),
    body: text.max(160),
    primaryCta: text.max(32),
    secondaryCta: text.max(32),
    record: strict({
      label: text,
      title: text,
      pending: text,
      approved: text,
      agent: text,
      wants: text,
      action: text,
      fields: z.array(strict({ label: text, value: text, mono: z.boolean() })).min(1).max(6),
      timelineLabel: text,
      steps: z.array(strict({ time: text, text })).length(5),
      caption: text,
    }),
  }),

  how: strict({
    title: text.max(80),
    body: text.max(200),
    steps: z.array(strict({ title: text, fact: text.max(120) })).length(5),
    outcomes: strict({ allow: text, approval: text, deny: text }),
  }),

  packs: strict({
    title: text.max(80),
    body: text.max(200),
    available: text,
    planned: text,
    soc: strict({ name: text, systems: text, actions: z.array(text).min(1).max(6) }),
    others: z.array(strict({ name: text, systems: text })).min(1).max(6),
  }),

  deployment: strict({
    title: text.max(80),
    body: text.max(200),
    options: z.array(strict({ title: text, facts: z.array(text).min(1).max(4) })).length(2),
  }),

  closing: strict({ title: text.max(80), body: text.max(200), cta: text.max(32) }),

  links: strict({
    /** Where every "Book a meeting" link goes. */
    booking: internalPath,
    /** The written request form, the fallback when online booking is unavailable. */
    requestForm: internalPath,
    vax: httpsUrl,
    /** General contact and privacy requests. */
    email: contactEmail,
    /** Support requests. */
    support: contactEmail,
  }),

  /** deployment shows in light mode, deploymentDark in dark mode: same framing, same aspect ratio. */
  images: strict({ logo: image, deployment: image, deploymentDark: image, og: image }),

  meet: strict({
    metaTitle: text,
    metaDescription: text.max(200),
    title: text,
    body: text,
    hostHeading: text,
    anyone: text,
    anyoneHint: text,
    whenHeading: text,
    timezone: text,
    yourTime: text,
    daysLabel: text,
    timesLabel: text,
    emptyDay: text,
    loading: text,
    retry: text,
    slotsFailed: text,
    detailsHeading: text,
    fields: strict({ name: field, email: field, company: field, role: field, note: field }),
    optional: text,
    requiredMark: text,
    honeypot: text,
    notice: text,
    noticeLink: text,
    submit: text,
    submitting: text,
    pickTimeFirst: text,
    slotTaken: text,
    turnstileFailed: text,
    rateTitle: text,
    rateBody: text,
    failTitle: text,
    failBody: text,
    activeBooking: text,
    errors: strict({ required: text, email: text, tooLong: text }),
    pendingTitle: text,
    pendingBody: text,
    resend: text,
    resendWait: text,
    resent: text,
    holdExpired: text,
    retryAfterConfirm: text,
    summary: strict({ hostLabel: text, whenLabel: text }),
    unavailable: strict({ title: text, body: text, cta: text }),
    confirm: strict({
      heading: text,
      working: text,
      confirmedTitle: text,
      confirmedBody: text,
      slotTakenTitle: text,
      slotTakenBody: text,
      slotTakenCta: text,
      expiredTitle: text,
      expiredBody: text,
      invalidTitle: text,
      invalidBody: text,
      startAgain: text,
      failTitle: text,
      failBody: text,
    }),
    manage: strict({
      heading: text,
      loading: text,
      statusLabel: text,
      statusConfirmed: text,
      statusCancelled: text,
      statusInactive: text,
      join: text,
      reschedule: text,
      rescheduleHeading: text,
      rescheduleSubmit: text,
      rescheduling: text,
      keepTime: text,
      rescheduled: text,
      cancel: text,
      cancelTitle: text,
      cancelBody: text,
      cancelReason: text,
      cancelConfirm: text,
      cancelKeep: text,
      cancelling: text,
      cancelled: text,
      endedTitle: text,
      endedBody: text,
      invalidTitle: text,
      invalidBody: text,
      failTitle: text,
      failBody: text,
      bookAnother: text,
    }),
  }),

  footer: strict({
    tagline: text,
    hackathon: text,
    sectionsTitle: text,
    contactTitle: text,
    support: text,
    rights: text,
    legalTitle: text,
    privacy: text,
    cookies: text,
    terms: text,
    cookieSettings: text,
  }),

  notFound: strict({ title: text, body: text, home: text }),

  demo: strict({
    title: text,
    body: text,
    altContact: text,
    back: text,
    form: strict({
      title: text,
      requiredHint: text,
      requiredMark: text,
      optional: text,
      fields: strict({
        name: field,
        email: field,
        organization: field,
        role: field,
        deployment: strict({
          label: text,
          placeholder: text,
          /** Keys are the values the API accepts (lib/demo/validation.ts); only the labels are content. */
          options: strict({ cloud: text, "on-premises": text, hosted: text, unsure: text }),
        }),
        message: field,
      }),
      honeypot: text,
      notice: text,
      noticeLink: text,
      submit: text,
      submitting: text,
      errors: strict({
        required: text,
        email: text,
        tooLong: text,
        lineBreak: text,
        option: text,
        summary: text,
      }),
      success: strict({ title: text, body: text, back: text }),
      failure: strict({ title: text, body: text, retry: text }),
      rateLimited: strict({ title: text, body: text }),
    }),
  }),

  legal: strict({
    ui: strict({
      lastUpdated: text,
      onThisPage: text,
      backHome: text,
      print: text,
      tableLabel: text,
      sectionLink: text,
    }),
    privacy: legalDocSchema,
    cookies: legalDocSchema,
    terms: legalDocSchema,
  }),
})

export type SiteContent = z.infer<typeof siteContentSchema>
export type LegalDoc = z.infer<typeof legalDocSchema>
export type LegalBlock = LegalDoc["sections"][number]["blocks"][number]

/** The published document as manar-site serves it: the content plus the version it came from. */
export const publishedContentSchema = z.object({
  version: z.string().min(1),
  content: siteContentSchema,
})
