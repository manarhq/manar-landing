import { cn } from "@/lib/utils"

/** Visible marker that the adjacent product view contains sample data only. */
export function IllustrativeBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-info/35 bg-info/10 px-2.5 py-1 text-xs font-semibold text-info",
        className
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
