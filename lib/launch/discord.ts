/** The community link: a runtime value, read on the server. */

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
