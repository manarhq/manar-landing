/**
 * The published coverage matrix. ONE source for the home-page section and the /docs coverage page
 * (public launch spec section 6). Update here and both change. A label is never shown above what a
 * tool has earned: cells that depend on hook verification say "Being verified" until Day 1 settles
 * them, and carry the guaranteed minimum as `floor`.
 */
import type { Locale } from "../i18n/config.ts"

export type CellId =
  | "yes"
  | "yes_hook"
  | "yes_mcp_gateway"
  | "gateway_mcp"
  | "mcp_only"
  | "verifying"
  | "linux_yes_windows_vault"
  | "na"

/** `verifying` cells name the minimum that holds even if verification fails. */
export type Cell = { id: CellId; floor?: CellId }

export type CoverageRow = {
  id: string
  name: string
  seen: Cell
  approve: Cell
  alert: Cell
  blocked: Cell
}

const yes: Cell = { id: "yes" }
const linuxBlock: Cell = { id: "linux_yes_windows_vault" }

export const coverageRows: CoverageRow[] = [
  { id: "claude-code", name: "Claude Code", seen: yes, approve: { id: "yes_hook" }, alert: yes, blocked: yes },
  {
    id: "cursor",
    name: "Cursor",
    seen: yes,
    approve: { id: "verifying", floor: "mcp_only" },
    alert: yes,
    blocked: { id: "verifying", floor: "linux_yes_windows_vault" },
  },
  {
    id: "cli-agents",
    name: "Gemini CLI, Codex CLI, Copilot CLI",
    seen: yes,
    approve: { id: "verifying", floor: "gateway_mcp" },
    alert: yes,
    blocked: { id: "verifying", floor: "linux_yes_windows_vault" },
  },
  { id: "editors", name: "VS Code + Copilot, Windsurf", seen: yes, approve: { id: "mcp_only" }, alert: yes, blocked: linuxBlock },
  {
    id: "desktop",
    name: "ChatGPT desktop, Claude desktop",
    seen: yes,
    approve: { id: "mcp_only" },
    alert: yes,
    blocked: linuxBlock,
  },
  {
    id: "cloud",
    name: "Cloud agents (ChatGPT, Claude, Copilot Studio)",
    seen: yes,
    approve: { id: "yes_mcp_gateway" },
    alert: { id: "na" },
    blocked: { id: "na" },
  },
]

export const coverageColumns = ["seen", "approve", "alert", "blocked"] as const
export type CoverageColumn = (typeof coverageColumns)[number]

type CoverageText = {
  title: string
  body: string
  tool: string
  columns: Record<CoverageColumn, string>
  cells: Record<CellId, string>
  floorPrefix: string
  vaultNote: string
  honesty: string
  caption: string
  /** Names are product names or tool names, so only Arabic overrides are listed. */
  rowNames?: Record<string, string>
}

export const coverageText: Record<Locale, CoverageText> = {
  en: {
    title: "What Manar covers, tool by tool",
    body: "Every tool is stated precisely. Manar never claims more protection than a tool allows.",
    tool: "Tool",
    columns: { seen: "Seen", approve: "Approve or deny", alert: "Secrets alert", blocked: "Secrets blocked" },
    cells: {
      yes: "Yes",
      yes_hook: "Yes (hook)",
      yes_mcp_gateway: "Yes (MCP gateway)",
      gateway_mcp: "Gateway and MCP",
      mcp_only: "MCP tools only",
      verifying: "Being verified",
      linux_yes_windows_vault: "Linux yes, Windows vault only",
      na: "Not applicable",
    },
    floorPrefix: "At least:",
    vaultNote:
      "Vault only means that on Windows, AWS and SSH keys moved into the Secret vault are blocked for every tool, while other secret files are alert-only.",
    honesty: "Cells marked Being verified show the minimum that holds today. We update them once each hook is confirmed.",
    caption: "Coverage matrix",
  },
  ar: {
    title: "ما الذي يغطيه منار، أداة بأداة",
    body: "نذكر مستوى التغطية لكل أداة بدقة. لا يدّعي منار حماية أكثر مما تسمح به الأداة.",
    tool: "الأداة",
    columns: { seen: "مرصودة", approve: "الموافقة أو الرفض", alert: "تنبيه الأسرار", blocked: "حجب الأسرار" },
    cells: {
      yes: "نعم",
      yes_hook: "نعم (عبر الربط)",
      yes_mcp_gateway: "نعم (بوابة MCP)",
      gateway_mcp: "البوابة وMCP",
      mcp_only: "أدوات MCP فقط",
      verifying: "قيد التحقق",
      linux_yes_windows_vault: "نعم على لينكس، وعلى ويندوز عبر خزنة الأسرار فقط",
      na: "لا ينطبق",
    },
    floorPrefix: "على الأقل:",
    vaultNote:
      "عبارة خزنة الأسرار فقط تعني أن مفاتيح AWS وSSH التي نُقلت إلى خزنة الأسرار على ويندوز تُحجب عن كل الأدوات، أما بقية ملفات الأسرار فيقتصر الأمر فيها على التنبيه.",
    honesty: "الخلايا المكتوب فيها قيد التحقق تعرض الحد الأدنى المضمون اليوم. نحدّثها عند تأكيد كل ربط.",
    caption: "جدول التغطية",
    rowNames: {
      "claude-code": "Claude Code",
      "cli-agents": "Gemini CLI وCodex CLI وCopilot CLI",
      editors: "VS Code مع Copilot وWindsurf",
      desktop: "تطبيقا ChatGPT وClaude لسطح المكتب",
      cloud: "الوكلاء السحابيون (ChatGPT وClaude وCopilot Studio)",
    },
  },
}

/** What a cell reads as in a locale, with the floor appended for cells still being verified. */
export function cellLabel(locale: Locale, cell: Cell): { text: string; floor?: string } {
  const t = coverageText[locale]
  return { text: t.cells[cell.id], floor: cell.floor ? `${t.floorPrefix} ${t.cells[cell.floor]}` : undefined }
}

export function rowName(locale: Locale, row: CoverageRow): string {
  return coverageText[locale].rowNames?.[row.id] ?? row.name
}
