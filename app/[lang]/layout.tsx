import { DirectionProvider } from "@base-ui/react/direction-provider"
import type { Viewport } from "next"
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google"
import { notFound } from "next/navigation"

import { SiteChrome } from "@/components/site/site-chrome"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { isLocale, localeDirection, localeTag, locales } from "@/lib/i18n/config"
import { THEME_STORAGE_KEY } from "@/lib/site"

import "../globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1016" },
    { media: "(prefers-color-scheme: light)", color: "#f3f5f7" },
  ],
}

// Runs before paint (W01): an explicit stored choice wins, otherwise follow the system.
const themeScript = `(function(){var d;try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){d=true}document.documentElement.classList.toggle("dark",d)})()`

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = getDictionary(lang)
  const dir = localeDirection[lang]

  return (
    <html
      lang={localeTag[lang]}
      dir={dir}
      className={`${geist.variable} ${geistMono.variable} ${plexArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="fixed start-4 top-3 z-(--z-skip) -translate-y-24 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform focus-visible:translate-y-0"
        >
          {dict.common.skipToContent}
        </a>
        <div aria-hidden className="scroll-progress" />
        <DirectionProvider direction={dir}>
          {children}
          <SiteChrome locale={lang} dict={dict} />
        </DirectionProvider>
        <div aria-hidden className="grain" />
      </body>
    </html>
  )
}
