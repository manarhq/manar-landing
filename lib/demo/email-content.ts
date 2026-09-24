import type { Utm } from "../consent.ts"
import type { DemoRequestInput } from "./validation.ts"

export type DemoEmailContent = {
  subject: string
  text: string
  html: string
}

const deploymentLabels: Record<string, string> = {
  cloud: "Customer cloud environment",
  "on-premises": "On-premises",
  hosted: "Hosted",
  unsure: "Not sure yet",
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Collapse anything that could break out of a header line. */
function headerSafe(value: string, max: number): string {
  return value.replace(/[\r\n\u2028\u2029\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max)
}

export function buildDemoRequestEmail(
  input: DemoRequestInput,
  context: { locale: string; submittedAt: Date; utm?: Utm }
): DemoEmailContent {
  const submitted = context.submittedAt.toISOString()
  const rows: Array<[string, string]> = [
    ["Name", input.name],
    ["Work email", input.email],
    ["Organization", input.organization],
    ["Role / function", input.role || "Not provided"],
    ["Deployment interest", input.deployment ? deploymentLabels[input.deployment] : "Not provided"],
    ["Site language", context.locale === "ar" ? "Arabic (ar)" : "English (en)"],
    ["Submitted (UTC)", submitted],
    ...Object.entries(context.utm ?? {}).map(([key, value]): [string, string] => [`Campaign ${key.slice(4)}`, value]),
  ]
  const message = input.message || "Not provided"

  const subject = `Manar demo request: ${headerSafe(input.organization, 80)}`

  const text = [
    "New Manar demo request",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "What would you like to govern?",
    message,
    "",
    "Reply to this email to respond to the requester.",
  ].join("\n")

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:6px 16px 6px 0;color:#4b5866;font-weight:600;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</th><td style="padding:6px 0;color:#0f1720">${escapeHtml(value)}</td></tr>`
    )
    .join("")

  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f5f2e9;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5">
<div style="max-width:600px;margin:0 auto;background:#fffef9;border:1px solid #d4ddd3;border-radius:12px;padding:24px">
<h1 style="margin:0 0 16px;font-size:18px;color:#18231e">New Manar demo request</h1>
<table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse">${htmlRows}</table>
<h2 style="margin:20px 0 8px;font-size:15px;color:#18231e">What would you like to govern?</h2>
<p style="margin:0;color:#18231e;white-space:pre-wrap">${escapeHtml(message)}</p>
<p style="margin:20px 0 0;color:#52635a;font-size:13px">Reply to this email to respond to the requester.</p>
</div>
</body>
</html>`

  return { subject, text, html }
}
