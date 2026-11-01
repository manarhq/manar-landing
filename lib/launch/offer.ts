/** Launch offer counter and community link: runtime values, read on the server. */

export type Offer = { enabled: boolean; total: number; claimed: number; remaining: number }

/** Only a well-formed answer counts; anything else (down, slow, odd) means "show nothing". */
export function parseOffer(value: unknown): Offer | null {
  if (!value || typeof value !== "object") return null
  const v = value as Record<string, unknown>
  const ints = ["total", "claimed", "remaining"].every((k) => Number.isInteger(v[k]) && (v[k] as number) >= 0)
  if (typeof v.enabled !== "boolean" || !ints) return null
  return { enabled: v.enabled, total: v.total as number, claimed: v.claimed as number, remaining: v.remaining as number }
}

/** The API's cached public counter (it caches 15 s; this page re-reads it every 30 s). */
export async function fetchOffer(): Promise<Offer | null> {
  const base = process.env.MANAR_API_URL?.trim().replace(/\/+$/, "")
  if (!base?.startsWith("https://") && !base?.startsWith("http://localhost")) return null
  try {
    const res = await fetch(`${base}/public/launch-offer`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(2500),
    })
    return res.ok ? parseOffer(await res.json()) : null
  } catch {
    return null
  }
}

/** The Discord invite from MANAR_DISCORD_URL; null (no link anywhere) unless it is an https URL. */
export function discordUrl(): string | null {
  const raw = process.env.MANAR_DISCORD_URL?.trim()
  if (!raw) return null
  try {
    const u = new URL(raw)
    return u.protocol === "https:" ? u.toString() : null
  } catch {
    return null
  }
}
