import { cn } from "@/lib/utils"

/** Visible marker that the adjacent product view contains sample data only. */
export function IllustrativeBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      {label}
    </span>
  )
}
