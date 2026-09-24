"use client"

import { Tabs } from "@base-ui/react/tabs"
import { motion, useReducedMotion } from "motion/react"
import { useState } from "react"

import type { Dictionary } from "@/lib/i18n/dictionaries"

type Audience = Dictionary["capabilities"]["audiences"][number]

/** Role switcher: pick who you are, read what Manar answers for you. */
export function Audiences({ title, audiences }: { title: string; audiences: Audience[] }) {
  const [value, setValue] = useState(audiences[0].role)
  const reduce = useReducedMotion()
  const current = audiences.find((a) => a.role === value) ?? audiences[0]

  return (
    <div className="mt-24 lg:mt-32">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <Tabs.Root value={value} onValueChange={(next) => setValue(next as string)} className="mt-6 grid gap-8 lg:grid-cols-12">
        <Tabs.List aria-label={title} className="flex gap-2 overflow-x-auto pb-1 lg:col-span-4 lg:flex-col lg:overflow-visible">
          {audiences.map((a) => (
            <Tabs.Tab
              key={a.role}
              value={a.role}
              className="relative shrink-0 rounded-full px-5 py-3 text-start text-[0.9375rem] font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-active:text-primary-foreground lg:rounded-md lg:text-lg"
            >
              {a.role === value ? (
                <motion.span
                  aria-hidden
                  layoutId="audience-pill"
                  className="absolute inset-0 rounded-[inherit] bg-primary"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                />
              ) : null}
              <span className="relative">{a.role}</span>
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {audiences.map((a) => (
          <Tabs.Panel key={a.role} value={a.role} className="outline-none lg:col-span-8 lg:border-s lg:border-border lg:ps-12">
            {a.role === current.role ? (
              <motion.div
                key={a.role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)] leading-tight font-semibold tracking-[-0.03em] text-foreground rtl:leading-snug rtl:tracking-normal">
                  {a.title}
                </p>
                <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">{a.body}</p>
              </motion.div>
            ) : null}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  )
}
