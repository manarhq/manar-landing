import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/** Status badges map to the status tokens. Never colour alone: always an icon and a word. */
const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-sm px-2 text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        allow: "bg-allow-soft text-allow",
        wait: "bg-wait-soft text-wait",
        deny: "bg-deny-soft text-deny",
        neutral: "border border-line text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

function Badge({
  className,
  variant = "neutral",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">({ className: cn(badgeVariants({ variant }), className) }, props),
    render,
    state: { slot: "badge", variant },
  })
}

export { Badge, badgeVariants }
