import { DirectionProvider } from "@base-ui/react/direction-provider"
import type { Viewport } from "next"
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google"
import { notFound } from "next/navigation"

import { SiteChrome } from "@/components/site/site-chrome"
import { getContent } from "@/lib/content/load"
import { isLocale, localeDirection, localeTag, locales } from "@/lib/i18n/config"
import { consentPendingScript } from "@/lib/consent"
import { CF_BEACON_TOKEN, THEME_STORAGE_KEY } from "@/lib/site"

import "../globals.css"

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
})

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
})

export const dynamicParams = false

/**
 * Pages prerender at build (CI has no SITE_API_URL), then regenerate at most once a minute on
 * visit, reading the runtime SITE_API_URL. Without this, CMS content would never reach a built page.
 */
export const revalidate = 60

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f2" },
  ],
}

// Runs before paint (W01): an explicit stored choice wins, otherwise follow the system.
const themeScript = `(function(){var d;try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){d=matchMedia("(prefers-color-scheme: dark)").matches}document.documentElement.classList.toggle("dark",d)})()`

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getContent(lang)
  const dir = localeDirection[lang]

  return (
    <html
      lang={localeTag[lang]}
      dir={dir}
      className={`${plexSans.variable} ${plexMono.variable} ${plexArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `${themeScript};${consentPendingScript(Boolean(CF_BEACON_TOKEN))}` }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <a
          href="#main"
          className="fixed start-4 top-3 z-(--z-skip) -translate-y-24 rounded-md bg-ink px-4 py-2 text-sm font-medium text-ink-text focus-visible:translate-y-0"
        >
          {dict.common.skipToContent}
        </a>
        <DirectionProvider direction={dir}>
          {children}
          <SiteChrome locale={lang} dict={dict} />
        </DirectionProvider>
      </body>
    </html>
  )
}
