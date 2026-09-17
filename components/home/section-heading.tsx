import { cn } from "@/lib/utils"

export function SectionHeading({
  id,
  eyebrow,
  title,
  body,
  className,
  align = "start",
}: {
  id: string
  eyebrow: string
  title: string
  body?: string
  className?: string
  align?: "start" | "center"
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="headline mt-5">
        {title}
      </h2>
      {body ? <p className="lede mt-5">{body}</p> : null}
    </div>
  )
}
