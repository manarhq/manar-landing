"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

/** 44px wide, so it is an easy touch target; red when on, line-strong when off. */
function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group/switch relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-line-strong bg-surface p-0.5 transition-colors duration-[120ms] outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring data-checked:border-primary data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-60",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-[18px] rounded-full bg-muted-foreground transition-transform duration-[120ms] data-checked:translate-x-5 data-checked:bg-primary-foreground rtl:data-checked:-translate-x-5"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
