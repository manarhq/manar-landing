import { CheckCircleIcon, InfoIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type Tone = "allow" | "wait" | "deny" | "neutral"

const tones = {
  allow: { box: "bg-allow-soft", icon: "text-allow", Icon: CheckCircleIcon },
  wait: { box: "bg-wait-soft", icon: "text-wait", Icon: WarningCircleIcon },
  deny: { box: "bg-deny-soft", icon: "text-deny", Icon: WarningCircleIcon },
  neutral: { box: "border border-line bg-surface", icon: "text-muted-foreground", Icon: InfoIcon },
}

/** One banner for every outcome: a tinted fill, an icon and words, never colour alone. */
export function Notice({ tone, title, children, className }: { tone: Tone; title?: string; children?: ReactNode; className?: string }) {
  const t = tones[tone]
  return (
    <div role={tone === "deny" || tone === "wait" ? "alert" : "status"} className={cn("flex gap-3 rounded-md p-4", t.box, className)}>
      <t.Icon aria-hidden weight={tone === "allow" ? "fill" : "regular"} className={cn("mt-0.5 size-5 shrink-0", t.icon)} />
      <div className="text-sm text-foreground">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn(title && "mt-1")}>{children}</div> : null}
      </div>
    </div>
  )
}
