import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * DESIGN-SYSTEM.md section 8. Landing primary is red. Hover changes the fill only (120 ms colour
 * transition, never opacity); press moves down one pixel. Heights: 32 compact, 36 default, 44 CTA.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent font-medium whitespace-nowrap transition-colors duration-[120ms] outline-none select-none active:not-aria-[haspopup]:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-brand-hover",
        secondary:
          "border-line bg-surface text-foreground hover:bg-subtle aria-expanded:bg-subtle",
        ghost: "text-foreground hover:bg-subtle aria-expanded:bg-subtle",
        destructive: "bg-deny text-brand-text hover:bg-brand-hover",
        link: "h-auto px-0 text-foreground underline underline-offset-4 decoration-line-strong hover:decoration-current",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-9 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
