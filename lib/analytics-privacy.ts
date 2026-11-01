/**
 * What may reach the analytics provider. /meet/confirm and /meet/manage carry a booking token in the
 * query string, so analytics never starts on /meet/* and every URL it does send is path only.
 * No path aliases: `node --test` loads this file.
 */

/** True for /meet and everything under it, with or without a locale prefix. */
export function isMeetPath(pathname: string): boolean {
  return /^(\/(en|ar))?\/meet(\/|$)/.test(pathname)
}

/** An absolute http(s) URL reduced to origin and path; anything else is returned unchanged. */
export function pathOnly(value: string): string {
  if (!/^https?:\/\//i.test(value)) return value
  try {
    const url = new URL(value)
    return url.origin + url.pathname
  } catch {
    return value.split(/[?#]/)[0]
  }
}

type Bag = Record<string, unknown> | undefined
const scrubBag = (bag: Bag): Bag =>
  bag && Object.fromEntries(Object.entries(bag).map(([k, v]) => [k, typeof v === "string" ? pathOnly(v) : v]))

/** PostHog before_send: strip query and hash from every URL-valued property ($current_url, $referrer, ...). */
export function scrubEvent<T extends { properties?: Bag; $set?: Bag; $set_once?: Bag }>(event: T | null): T | null {
  if (!event) return event
  return { ...event, properties: scrubBag(event.properties), $set: scrubBag(event.$set), $set_once: scrubBag(event.$set_once) }
}
