import { DirectionProvider } from "@base-ui/react/direction-provider"
import type { Viewport } from "next"
import { IBM_Plex_Mono, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google"
import { notFound } from "next/navigation"

import { getDictionary } from "@/lib/i18n/dictionaries"
import { isLocale, localeDirection, localeTag, locales } from "@/lib/i18n/config"
import { THEME_STORAGE_KEY } from "@/lib/site"

import "../globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
})

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121816" },
    { media: "(prefers-color-scheme: light)", color: "#f5f2e9" },
  ],
}

// Dark is the initial brand presentation; only an explicit stored choice changes it.
const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}"),c=document.documentElement.classList;if(t==="light")c.remove("dark");else c.add("dark")}catch(e){}})()`

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = getDictionary(lang)
  const dir = localeDirection[lang]

  return (
    <html
      lang={localeTag[lang]}
      dir={dir}
      className={`dark ${manrope.variable} ${plexArabic.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="fixed start-4 top-3 z-[60] -translate-y-24 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform focus-visible:translate-y-0"
        >
          {dict.common.skipToContent}
        </a>
        <DirectionProvider direction={dir}>{children}</DirectionProvider>
      </body>
    </html>
  )
}
