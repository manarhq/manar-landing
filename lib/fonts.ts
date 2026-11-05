/*
 * Readex Pro (Arabic and Latin) and JetBrains Mono are self-hosted (app/fonts.css, public/fonts) so each
 * locale preloads only its own files; next/font preloads every font on every page under a layout.
 * The root layout needs no font class: the faces and the --font-* variables come from fonts.css.
 */

/** The files each locale needs for its first paint. Arabic pages also show Latin (brand, code, numbers). */
export const localeFontPreloads = {
  en: ["/fonts/readex-pro-latin-wght-normal.7074eeb9.woff2"],
  ar: ["/fonts/readex-pro-arabic-wght-normal.b5815b71.woff2", "/fonts/readex-pro-latin-wght-normal.7074eeb9.woff2"],
} as const
