/** Where the launch site sends people. One place, so a hostname change is a one-line edit. */
export const CONSOLE_URL = "https://console-manar.vax.sh"
export const STATUS_URL = "https://status.manar.vax.sh"
export const GITHUB_URL = "https://github.com/manarhq"

export const links = {
  console: CONSOLE_URL,
  /** Sample workspace entry (identity track owns the console route; adjust here if it differs). */
  sample: `${CONSOLE_URL}/?sample=1`,
  status: STATUS_URL,
  github: GITHUB_URL,
} as const
