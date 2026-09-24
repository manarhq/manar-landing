"use client"

import {
  CheckIcon,
  ClockIcon,
  FileTextIcon,
  InfoIcon,
  PaperPlaneTiltIcon,
  ProhibitIcon,
  ScalesIcon,
  UserCheckIcon,
} from "@phosphor-icons/react"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

import { IllustrativeBadge } from "./illustrative-badge"

/**
 * Scroll story: the step text scrolls while one connected action, pinned beside it,
 * lights up stage by stage. The trace is the same example used across the page.
 */
export function HowItWorks({ dict }: { dict: Dictionary }) {
  const h = dict.how
  const [active, setActive] = useState(0)
  const steps = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    steps.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative overflow-x-clip py-24 sm:py-28 lg:py-40">
      <div className="shell">
        <div className="max-w-3xl">
          <h2 id="how-title" className="headline">
            {h.title}
          </h2>
          <p className="lede mt-5 max-w-[52ch]">{h.body}</p>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-8 lg:grid-cols-12 lg:gap-10">
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-[calc(50dvh-13rem)]">
              <TraceCard dict={dict} active={active} name="pinned" />
            </div>
          </div>

          <ol className="lg:col-span-5 lg:col-start-8">
            {h.steps.map((step, i) => (
              <li
                key={step.title}
                ref={(node) => {
                  steps.current[i] = node
                }}
                data-step={i}
                className="flex border-s border-border ps-6 pb-10 transition-colors duration-500 last:pb-0 lg:min-h-[62dvh] lg:items-center lg:pb-0 data-[lit=true]:border-primary"
                data-lit={i <= active}
              >
                <div className={cn("transition-opacity duration-500", i === active ? "lg:opacity-100" : "lg:opacity-40")}>
                  <h3 className="text-2xl leading-snug font-semibold tracking-[-0.02em] text-foreground rtl:tracking-normal">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[42ch] text-[1.0625rem] leading-relaxed text-muted-foreground">{step.body}</p>
                  {i === 2 ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      <Outcome tone="success" icon={<CheckIcon weight="bold" />} label={h.outcomes.allow} />
                      <Outcome tone="warning" icon={<ClockIcon weight="bold" />} label={h.outcomes.approval} />
                      <Outcome tone="danger" icon={<ProhibitIcon weight="bold" />} label={h.outcomes.block} />
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <div className="lg:hidden">
            <TraceCard dict={dict} active={3} name="static" />
          </div>
        </div>

        <aside
          aria-labelledby="boundary-title"
          className="mt-20 grid gap-4 rounded-lg border border-border bg-card p-6 sm:grid-cols-[auto_1fr] sm:gap-5 sm:p-8 lg:mt-28"
        >
          <InfoIcon aria-hidden className="size-6 text-link sm:mt-0.5" />
          <div>
            <h3 id="boundary-title" className="text-lg font-semibold text-foreground">
              {h.boundaryTitle}
            </h3>
            <p className="mt-2 max-w-[70ch] text-base leading-relaxed text-foreground sm:text-[1.0625rem]">{h.boundary}</p>
            <p className="mt-3 max-w-[70ch] text-[0.9375rem] leading-relaxed text-muted-foreground">{h.boundaryDetail}</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function TraceCard({ dict, active, name }: { dict: Dictionary; active: number; name: string }) {
  const c = dict.hero.card
  const reduce = useReducedMotion()
  const decided = active >= 2

  return (
    <figure className="relative">
      <div aria-hidden className="glow absolute -inset-10 opacity-60" />
      <div className="relative overflow-hidden rounded-lg border border-border bg-card/95 shadow-[0_40px_90px_-40px_rgb(5_8_12/0.55)] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-2.5 text-sm">
            <span className="font-semibold text-foreground">{c.label}</span>
            <span className="ltr-fragment hidden font-mono text-xs text-muted-foreground sm:inline">{c.requestId}</span>
          </div>
          <IllustrativeBadge label={dict.common.illustrativeExample} />
        </div>

        <ol className="relative px-5 py-6 sm:px-6">
          <span aria-hidden className="absolute start-[2.1rem] top-10 bottom-12 w-px bg-border sm:start-[2.35rem]" />
          <motion.span
            aria-hidden
            className="absolute start-[2.1rem] top-10 bottom-12 w-px origin-top bg-primary sm:start-[2.35rem]"
            initial={false}
            animate={{ scaleY: active / 3 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 20 }}
          />

          <Step icon={<PaperPlaneTiltIcon />} lit={active >= 0}>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{c.system}</span> {c.requests}
            </p>
            <p className="mt-1 text-lg leading-snug font-semibold text-foreground sm:text-xl">{c.action}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {c.target} <span className="ltr-fragment font-mono text-xs">{c.targetId}</span>
            </p>
          </Step>

          <Step icon={<ScalesIcon />} lit={active >= 1}>
            <p className="text-xs font-semibold text-muted-foreground">{c.policyLabel}</p>
            <p className="mt-1 text-[0.9375rem] leading-snug text-foreground">{c.policy}</p>
            <p className="ltr-fragment mt-1 font-mono text-xs text-muted-foreground">{c.policyId}</p>
          </Step>

          <Step icon={<UserCheckIcon />} lit={decided}>
            <p className="text-xs font-semibold text-muted-foreground">{c.decisionLabel}</p>
            <div className="relative mt-2 grid grid-cols-3 gap-1 rounded-full border border-border bg-background/60 p-1 text-center text-xs font-semibold sm:text-sm">
              {(["allow", "approval", "block"] as const).map((key) => {
                const selected = decided && key === "approval"
                return (
                  <span
                    key={key}
                    className={cn("relative rounded-full px-2 py-1.5", selected ? "text-primary-foreground" : "text-muted-foreground")}
                  >
                    {selected ? (
                      <motion.span
                        aria-hidden
                        layoutId={`trace-decision-${name}`}
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
                      />
                    ) : null}
                    <span className="relative">{c.options[key]}</span>
                  </span>
                )
              })}
            </div>
            <p className="mt-2.5 text-sm text-muted-foreground">
              {c.approverLabel}: <span className="font-medium text-foreground">{c.approver}</span>
            </p>
          </Step>

          <Step icon={<FileTextIcon />} lit={active >= 3} last>
            <p className="flex items-center gap-2 text-sm text-foreground">
              <CheckIcon aria-hidden weight="bold" className="size-4 text-success" />
              {c.record}
            </p>
          </Step>
        </ol>
      </div>
    </figure>
  )
}

function Step({ icon, children, lit, last }: { icon: React.ReactNode; children: React.ReactNode; lit: boolean; last?: boolean }) {
  return (
    <li className={cn("relative flex gap-4 transition-opacity duration-500", !last && "pb-6", !lit && "opacity-35")}>
      <span
        aria-hidden
        className={cn(
          "relative z-(--z-raised) flex size-8 shrink-0 items-center justify-center rounded-full border bg-card transition-colors duration-500 [&_svg]:size-4",
          lit ? "border-primary text-link" : "border-border text-muted-foreground"
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">{children}</div>
    </li>
  )
}

function Outcome({ tone, icon, label }: { tone: "success" | "warning" | "danger"; icon: React.ReactNode; label: string }) {
  return (
    <li
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold [&_svg]:size-3.5",
        tone === "success" && "border-success/35 bg-success/10 text-success",
        tone === "warning" && "border-warning/40 bg-warning/10 text-warning",
        tone === "danger" && "border-danger/40 bg-danger/10 text-danger"
      )}
    >
      <span aria-hidden className="contents">
        {icon}
      </span>
      {label}
    </li>
  )
}
