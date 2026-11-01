import { DirectionProvider } from "@base-ui/react/direction-provider"
import type { Viewport } from "next"
import { notFound } from "next/navigation"
import { preload } from "react-dom"

import { PreviewBar } from "@/components/site/preview-bar"
import { SiteChrome } from "@/components/site/site-chrome"
import { getContent, isPreviewing } from "@/lib/content/load"
import { localeFontPreloads } from "@/lib/fonts"
import { isLocale, localeDirection, localeTag, locales } from "@/lib/i18n/config"
import { consentPendingScript } from "@/lib/consent"
import { POSTHOG_KEY, THEME_STORAGE_KEY } from "@/lib/site"

import "../globals.css"


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
    { media: "(prefers-color-scheme: dark)", color: "#02070a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f8fa" },
  ],
}

// Runs before paint (W01): an explicit stored choice wins, otherwise follow the system.
const themeScript = `(function(){var d;try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){d=matchMedia("(prefers-color-scheme: dark)").matches}document.documentElement.classList.toggle("dark",d)})()`

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getContent(lang)
  const preview = await isPreviewing()
  const dir = localeDirection[lang]
  for (const href of localeFontPreloads[lang]) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" })

  return (
    <html
      lang={localeTag[lang]}
      dir={dir}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `${themeScript};${consentPendingScript(Boolean(POSTHOG_KEY))}` }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <a
          href="#main"
          className="fixed start-4 top-3 z-(--z-skip) -translate-y-24 rounded-md bg-ink px-4 py-2 text-sm font-medium text-ink-text focus-visible:translate-y-0"
        >
          {dict.common.skipToContent}
        </a>
        <DirectionProvider direction={dir}>
          {preview ? <PreviewBar locale={lang} /> : null}
          {children}
          <SiteChrome locale={lang} dict={dict} />
        </DirectionProvider>
      </body>
    </html>
  )
}
