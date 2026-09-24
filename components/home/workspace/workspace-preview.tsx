"use client"

import { CaretDownIcon, ClockCounterClockwiseIcon, ListIcon, SquaresFourIcon, UserCheckIcon } from "@phosphor-icons/react"
import { useId, useState } from "react"

import { BrandMark } from "@/components/site/brand"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

import { IllustrativeBadge } from "../illustrative-badge"
import { lifecycleTone, outcomeTone, riskTone, StatusPill } from "./status"

type Workspace = Dictionary["workspace"]

const tabIcons = {
  overview: SquaresFourIcon,
  inventory: ListIcon,
  approvals: UserCheckIcon,
  evidence: ClockCounterClockwiseIcon,
} as const

export function WorkspacePreview({ w, brandName }: { w: Workspace; brandName: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-[0_50px_100px_-50px_rgb(0_0_0/0.5)]">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5 text-sm">
          <BrandMark className="h-6" />
          <span className="font-semibold text-foreground">{brandName}</span>
          <span aria-hidden className="hidden text-border sm:inline">/</span>
          <span className="hidden truncate text-muted-foreground sm:inline">{w.breadcrumb}</span>
        </div>
        <IllustrativeBadge label={w.label} />
      </div>

      <Tabs defaultValue="overview" className="gap-0">
        <div className="border-b border-border bg-card px-1 sm:px-3">
          <TabsList
            variant="line"
            aria-label={w.tabsLabel}
            className="grid h-auto w-full grid-cols-4 gap-0 rounded-none p-0 sm:flex sm:w-fit"
          >
            {(Object.keys(tabIcons) as Array<keyof typeof tabIcons>).map((key) => {
              const Icon = tabIcons[key]
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className={cn(
                    "h-auto min-h-14 flex-col gap-1 rounded-none border-0 px-1 py-2 text-xs font-semibold text-muted-foreground sm:min-h-12 sm:flex-row sm:gap-2 sm:px-4 sm:text-sm",
                    "hover:text-foreground focus-visible:ring-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                    "data-active:text-foreground dark:data-active:text-foreground",
                    "group-data-horizontal/tabs:after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                  )}
                >
                  <Icon aria-hidden className="size-4" />
                  <span className="text-center leading-tight">{w.tabs[key]}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-4 text-base sm:p-6">
          <Overview w={w} />
        </TabsContent>
        <TabsContent value="inventory" className="p-4 text-base sm:p-6">
          <Inventory w={w} />
        </TabsContent>
        <TabsContent value="approvals" className="p-4 text-base sm:p-6">
          <Approvals w={w} />
        </TabsContent>
        <TabsContent value="evidence" className="p-4 text-base sm:p-6">
          <Evidence w={w} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PanelTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="text-sm font-semibold text-foreground">
      {children}
    </h3>
  )
}

function Overview({ w }: { w: Workspace }) {
  const o = w.overview
  const attentionTone = { approval: "warning", review: "info", flag: "danger" } as const
  const attentionIcon = { approval: "approval", review: undefined, flag: "flag" } as const

  return (
    <div className="grid gap-4 sm:gap-5">
      <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-4">
        {o.stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              "flex flex-col-reverse gap-1.5 border-border p-4 sm:p-5",
              i % 2 === 0 && "border-e",
              i < 2 && "border-b lg:border-b-0",
              i === 1 && "lg:border-e",
              i === 2 && "lg:border-e"
            )}
          >
            <dt className="text-xs leading-snug text-muted-foreground sm:text-sm">{stat.label}</dt>
            <dd className="text-2xl font-semibold text-foreground tabular-nums sm:text-3xl">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.35fr_1fr]">
        <section aria-labelledby="ws-attention" className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <PanelTitle id="ws-attention">{o.attentionTitle}</PanelTitle>
          </div>
          <ul className="divide-y divide-border">
            {o.attention.map((item) => {
              const kind = item.kind as keyof typeof attentionTone
              return (
                <li key={item.title} className="flex flex-col gap-1.5 px-4 py-3.5 sm:px-5">
                  <StatusPill tone={attentionTone[kind]} icon={attentionIcon[kind]} className="self-start">
                    {item.tag}
                  </StatusPill>
                  <p className="text-[0.9375rem] leading-snug font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.meta}</p>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="ws-decisions" className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <PanelTitle id="ws-decisions">{o.decisionsTitle}</PanelTitle>
          </div>
          <ul className="divide-y divide-border">
            {o.decisions.map((item) => (
              <li key={item.action} className="flex items-start justify-between gap-3 px-4 py-3.5 sm:px-5">
                <div className="min-w-0">
                  <p className="text-[0.9375rem] leading-snug font-medium text-foreground">{item.action}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.system}</p>
                </div>
                <StatusPill tone={outcomeTone[item.outcome]} icon={item.outcome as "allow" | "approval" | "block"}>
                  {item.label}
                </StatusPill>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function Inventory({ w }: { w: Workspace }) {
  const inv = w.inventory
  const [selectedId, setSelectedId] = useState(inv.systems[0].id)
  const selected = inv.systems.find((s) => s.id === selectedId) ?? inv.systems[0]
  const detailId = useId()

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div
          aria-hidden
          className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_5.5rem_7rem] gap-4 border-b border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground md:grid"
        >
          <span>{inv.columns.system}</span>
          <span>{inv.columns.owner}</span>
          <span>{inv.columns.risk}</span>
          <span>{inv.columns.status}</span>
        </div>
        <p className="border-b border-border px-4 py-2.5 text-sm text-muted-foreground md:hidden">{inv.selectHint}</p>
        <ul className="divide-y divide-border">
          {inv.systems.map((system) => {
            const isSelected = system.id === selected.id
            return (
              <li key={system.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  aria-controls={detailId}
                  onClick={() => setSelectedId(system.id)}
                  className={cn(
                    "relative grid w-full gap-x-4 gap-y-1.5 px-4 py-3.5 text-start transition-colors outline-none hover:bg-elevated/60 focus-visible:bg-elevated/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_5.5rem_7rem] md:items-center md:px-5",
                    isSelected && "bg-elevated/70"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 start-0 w-0.5 bg-primary transition-opacity",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="text-[0.9375rem] font-semibold text-foreground">{system.name}</span>
                  <span className="text-sm text-muted-foreground">
                    <span className="sr-only">{inv.columns.owner}: </span>
                    {system.owner}
                  </span>
                  <span className="flex flex-wrap gap-1.5 md:contents">
                    <span>
                      <span className="sr-only">{inv.columns.risk}: </span>
                      <StatusPill tone={riskTone[system.risk]}>{w.risk[system.risk as keyof Workspace["risk"]]}</StatusPill>
                    </span>
                    <span>
                      <span className="sr-only">{inv.columns.status}: </span>
                      <StatusPill tone={lifecycleTone[system.lifecycle]}>
                        {w.lifecycle[system.lifecycle as keyof Workspace["lifecycle"]]}
                      </StatusPill>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <section
        id={detailId}
        aria-live="polite"
        aria-labelledby={`${detailId}-title`}
        className="rounded-lg border border-border bg-card p-4 sm:p-5"
      >
        <p className="text-xs font-semibold text-muted-foreground">{inv.detailTitle}</p>
        <h3 id={`${detailId}-title`} className="mt-1 text-lg font-semibold text-foreground">
          {selected.name}
        </h3>
        <dl className="mt-4 grid gap-3.5 text-sm">
          <DetailRow label={inv.purposeLabel}>{selected.purpose}</DetailRow>
          <DetailRow label={inv.ownerLabel}>{selected.owner}</DetailRow>
          <DetailRow label={inv.controlLabel}>
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "size-2 rounded-full",
                  selected.control === "routed" ? "bg-success" : "border border-control"
                )}
              />
              {w.control[selected.control as keyof Workspace["control"]]}
            </span>
          </DetailRow>
          <DetailRow label={inv.policiesLabel}>{selected.policies}</DetailRow>
          <DetailRow label={inv.reviewLabel}>{selected.review}</DetailRow>
        </dl>
      </section>
    </div>
  )
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="leading-relaxed text-foreground">{children}</dd>
    </div>
  )
}

function Disclosure({
  showLabel,
  hideLabel,
  children,
}: {
  showLabel: string
  hideLabel: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-control/60 px-3 text-sm font-semibold text-foreground transition-colors hover:border-control hover:bg-elevated"
      >
        {open ? hideLabel : showLabel}
        <CaretDownIcon aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      <div id={panelId} hidden={!open} className="mt-3">
        {children}
      </div>
    </div>
  )
}

function Approvals({ w }: { w: Workspace }) {
  const a = w.approvals
  const fieldOrder = ["system", "task", "target", "approver"] as const

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-labelledby="ws-approval" className="rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
          <p className="text-xs font-semibold text-muted-foreground">{a.queueTitle}</p>
          <StatusPill tone="warning" icon="approval">
            {a.status}
          </StatusPill>
        </div>
        <div className="p-4 sm:p-5">
          <h3 id="ws-approval" className="text-lg leading-snug font-semibold text-foreground sm:text-xl">
            {a.requestTitle}
          </h3>
          <dl className="mt-4 grid gap-x-6 gap-y-3.5 text-sm sm:grid-cols-2">
            {fieldOrder.map((key) => (
              <DetailRow key={key} label={a.fields[key]}>
                {a.values[key]}
              </DetailRow>
            ))}
            <DetailRow label={a.fields.risk}>
              <StatusPill tone="danger">{w.risk.high}</StatusPill>
            </DetailRow>
          </dl>
          <div className="mt-4 rounded-md border border-border bg-background/60 p-3.5">
            <p className="text-xs text-muted-foreground">{a.fields.policy}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-foreground">{a.values.policy}</p>
            <p className="ltr-fragment mt-1 font-mono text-xs text-muted-foreground">POL-PAY-03</p>
          </div>
        </div>
      </section>

      <div className="grid content-start gap-4 sm:gap-5">
        <section aria-labelledby="ws-change" className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <h3 id="ws-change" className="text-sm font-semibold text-foreground">
            {a.changeTitle}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{a.changeField}</p>
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-background/60 px-3 py-2">
              <dt className="text-muted-foreground">{a.changeFrom}</dt>
              <dd className="ltr-fragment font-mono text-[0.8125rem] text-foreground">AE07 0331 •••• •••• 4821</dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-warning/10 px-3 py-2 ring-1 ring-warning/30">
              <dt className="text-warning">{a.changeTo}</dt>
              <dd className="ltr-fragment font-mono text-[0.8125rem] text-foreground">AE45 0260 •••• •••• 1190</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <Disclosure showLabel={a.traceShow} hideLabel={a.traceHide}>
            <h3 className="text-sm font-semibold text-foreground">{a.traceTitle}</h3>
            <ol className="mt-3 grid gap-2">
              {a.trace.map((step, i) => (
                <li
                  key={step.check}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm"
                >
                  <span className="text-foreground">{step.check}</span>
                  <StatusPill tone={i === a.trace.length - 1 ? "warning" : "neutral"}>{step.result}</StatusPill>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.traceNote}</p>
          </Disclosure>
        </section>
      </div>
    </div>
  )
}

function Evidence({ w }: { w: Workspace }) {
  const e = w.evidence
  const dotTone = ["bg-primary", "bg-primary", "bg-warning", "bg-success", "bg-success"]

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <section aria-labelledby="ws-record" className="rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
          <h3 id="ws-record" className="text-sm font-semibold text-foreground">
            {e.recordTitle}
          </h3>
          <span className="ltr-fragment font-mono text-xs text-muted-foreground">{e.recordId}</span>
        </div>
        <ol aria-label={e.timelineLabel} className="relative px-4 py-5 sm:px-5">
          <span aria-hidden className="absolute start-[4.6rem] top-7 bottom-8 w-px bg-border sm:start-[4.85rem]" />
          {e.events.map((event, i) => (
            <li key={`${event.time}-${event.title}`} className="relative grid grid-cols-[3rem_1fr] gap-x-6 pb-5 last:pb-0">
              <span className="ltr-fragment pt-0.5 font-mono text-xs text-muted-foreground tabular-nums">{event.time}</span>
              <div className="relative">
                <span
                  aria-hidden
                  className={cn(
                    "absolute -start-[1.9rem] top-1.5 size-2.5 rounded-full ring-4 ring-card",
                    dotTone[i] ?? "bg-muted-foreground"
                  )}
                />
                <p className="text-[0.9375rem] font-semibold text-foreground">{event.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{event.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="content-start rounded-lg border border-border bg-card p-4 sm:p-5">
        <Disclosure showLabel={e.showDetails} hideLabel={e.hideDetails}>
          <h3 className="text-sm font-semibold text-foreground">{e.detailsTitle}</h3>
          <dl className="mt-3 divide-y divide-border rounded-md border border-border text-sm">
            {e.details.map((d) => (
              <div key={d.label} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
                <dt className="text-muted-foreground">{d.label}</dt>
                <dd className={cn("text-foreground", d.mono && "ltr-fragment font-mono text-[0.8125rem]")}>{d.value}</dd>
              </div>
            ))}
          </dl>
        </Disclosure>
      </section>
    </div>
  )
}
