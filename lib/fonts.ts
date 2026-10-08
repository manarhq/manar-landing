import { IBM_Plex_Mono } from "next/font/google"

/*
 * IBM Plex Sans and Plex Sans Arabic are self-hosted (app/fonts.css, public/fonts) so each locale
 * preloads only its own files; next/font preloads every font on every page under a layout.
 * Mono stays on next/font: it is small, never preloaded, and the same for both locales.
 * One module, imported by both root layouts: a font declared twice is downloaded twice.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
})

export const fontVariables = plexMono.variable

/** The files each locale needs for its first paint: body text, and for Arabic the heading weight too. */
export const localeFontPreloads = {
  en: ["/fonts/plex-sans-var-latin.woff2"],
  ar: ["/fonts/plex-sans-arabic-400-arabic.woff2", "/fonts/plex-sans-arabic-600-arabic.woff2"],
} as const
