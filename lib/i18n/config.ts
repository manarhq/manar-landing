export const locales = ["en", "ar"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
}

/** BCP 47 tags used for <html lang>, hreflang, and Open Graph. */
export const localeTag: Record<Locale, string> = {
  en: "en",
  ar: "ar",
}

export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_AE",
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en"
}
