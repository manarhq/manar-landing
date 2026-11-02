/**
 * Public product hosts. A domain move is config only: set these at build time.
 * NEXT_PUBLIC_* are inlined into client bundles, so each must be read as a literal process.env.X.
 */
export const DEFAULT_SITE_URL = "https://manar.fixio.ae"
export const CONSOLE_URL = process.env.NEXT_PUBLIC_CONSOLE_URL?.trim() || "https://console-manar.fixio.ae"
export const STATUS_URL = process.env.NEXT_PUBLIC_STATUS_URL?.trim() || "https://status-manar.fixio.ae"

const hostOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/.*$/, "")

/** Hostnames for prose (legal texts). The site host follows SITE_URL (server, build time). */
export const SITE_HOST = hostOf(process.env.SITE_URL?.trim() || DEFAULT_SITE_URL)
export const CONSOLE_HOST = hostOf(CONSOLE_URL)
