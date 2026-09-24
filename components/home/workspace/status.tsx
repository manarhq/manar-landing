import { CheckIcon, ClockIcon, FlagIcon, ProhibitIcon } from "@phosphor-icons/react/ssr"

import { cn } from "@/lib/utils"

export type Tone = "success" | "warning" | "danger" | "info" | "neutral"

const toneClasses: Record<Tone, string> = {
  success: "border-success/35 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-danger/40 bg-danger/10 text-danger",
  info: "border-control/60 bg-elevated text-foreground",
  neutral: "border-border bg-elevated text-muted-foreground",
}

/** Status label: color is always paired with text, and optionally an icon. */
export function StatusPill({
  tone,
  children,
  icon,
  className,
}: {
  tone: Tone
  children: React.ReactNode
  icon?: "allow" | "approval" | "block" | "flag"
  className?: string
}) {
  const Icon =
    icon === "allow" ? CheckIcon : icon === "approval" ? ClockIcon : icon === "block" ? ProhibitIcon : icon === "flag" ? FlagIcon : null
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs leading-4 font-semibold whitespace-nowrap",
        toneClasses[tone],
        className
      )}
    >
      {Icon ? <Icon aria-hidden className="size-3" /> : null}
      {children}
    </span>
  )
}

export const riskTone: Record<string, Tone> = { high: "danger", medium: "warning", low: "success" }
export const lifecycleTone: Record<string, Tone> = { active: "success", review: "info", draft: "neutral" }
export const outcomeTone: Record<string, Tone> = { allow: "success", approval: "warning", block: "danger" }
