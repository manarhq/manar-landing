import type { Metadata } from "next"
import { Geist, IBM_Plex_Sans_Arabic } from "next/font/google"

import ar from "@/lib/i18n/dictionaries/ar"
import en from "@/lib/i18n/dictionaries/en"
import { THEME_STORAGE_KEY } from "@/lib/site"

import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" })
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "600"], variable: "--font-plex-arabic", display: "swap" })

export const metadata: Metadata = {
  title: "404 | Manar",
  robots: { index: false, follow: true },
}

const themeScript = `(function(){var d;try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){d=true}document.documentElement.classList.toggle("dark",d)})()`

/** W41: unmatched routes have no locale, so the page speaks both languages. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${geist.variable} ${plexArabic.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <main id="main" className="relative isolate flex min-h-dvh items-center overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="beam absolute top-0 left-1/2 h-full w-[min(90rem,180vw)] -translate-x-1/2 opacity-70" />
          </div>
          <div className="shell grid gap-16 py-20 md:grid-cols-2">
            {([en, ar] as const).map((dict) => {
              const locale = dict === ar ? "ar" : "en"
              return (
                <section key={locale} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="max-w-md">
                  <p className="ltr-fragment font-mono text-sm text-link">404</p>
                  <h1 className="headline mt-4">{dict.notFound.title}</h1>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{dict.notFound.body}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={`/${locale}`}
                      className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-action-hover"
                    >
                      {dict.notFound.home}
                    </a>
                    <a
                      href={`/${locale}/demo`}
                      className="inline-flex h-12 items-center rounded-full border border-control/70 px-6 text-[0.9375rem] font-semibold text-foreground transition-colors hover:bg-elevated"
                    >
                      {dict.common.bookDemo}
                    </a>
                  </div>
                </section>
              )
            })}
          </div>
        </main>
      </body>
    </html>
  )
}
