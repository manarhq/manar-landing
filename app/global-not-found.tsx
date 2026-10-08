import type { Metadata } from "next"

import { buttonVariants } from "@/components/ui/button"
import { bundledContent } from "@/lib/content"
import { fontVariables } from "@/lib/fonts"
import { bookingHref, THEME_STORAGE_KEY } from "@/lib/site"

import "./globals.css"


export const metadata: Metadata = {
  title: "404 | Manar",
  robots: { index: false, follow: true },
}

const themeScript = `(function(){var d;try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){d=matchMedia("(prefers-color-scheme: dark)").matches}document.documentElement.classList.toggle("dark",d)})()`

/**
 * Unmatched routes have no locale, so the page speaks both languages. It renders the bundled
 * content: a 404 must never depend on the CMS being reachable.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <main id="main" className="flex min-h-dvh items-center">
          <div className="shell grid gap-16 py-16 md:grid-cols-2">
            {(["en", "ar"] as const).map((locale) => {
              const dict = bundledContent[locale]
              return (
                <section key={locale} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="max-w-md">
                  <p className="ltr-fragment font-mono text-sm text-muted-foreground">404</p>
                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">{dict.notFound.title}</h1>
                  <p className="mt-4 text-lg text-muted-foreground">{dict.notFound.body}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={`/${locale}`} className={buttonVariants({ size: "lg", variant: "secondary" })}>
                      {dict.notFound.home}
                    </a>
                    <a href={bookingHref(locale, dict)} className={buttonVariants({ size: "lg" })}>
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
