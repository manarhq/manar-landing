export type LegalBlock = string | { list: string[] } | { table: { head: string[]; rows: string[][] } }

export type LegalSection = {
  id: string
  heading: string
  blocks: LegalBlock[]
}

export type LegalDoc = {
  title: string
  /** Meta description, under 160 characters. */
  description: string
  /** ISO date of the last real content change. Stored, never computed at render. */
  updated: string
  /** Details that still need confirmation, shown in the draft notice. */
  placeholders: string[]
  sections: LegalSection[]
}
