"use client"

import Link from "next/link"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { format } from "@/lib/i18n/format"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

import { Notice, type Tone } from "./notice"
import { useTurnstile } from "./turnstile"

export type Details = { name: string; email: string; company: string; role: string; message: string }
export const EMPTY_DETAILS: Details = { name: "", email: "", company: "", role: "", message: "" }
type Name = keyof Details

const LIMITS: Record<Name, number> = { name: 120, email: 254, company: 160, role: 120, message: 2000 }
const REQUIRED: Name[] = ["name", "email", "company", "role"]
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type SubmitOutcome =
  | { type: "done" }
  | { type: "handled" }
  | { type: "fields"; fields: Record<string, string> }
  | { type: "notice"; tone: Tone; title?: string; body: string }

function validate(d: Details): Partial<Record<Name, "required" | "email" | "tooLong">> {
  const errors: Partial<Record<Name, "required" | "email" | "tooLong">> = {}
  for (const name of Object.keys(LIMITS) as Name[]) {
    const value = d[name].trim()
    if (REQUIRED.includes(name) && !value) errors[name] = "required"
    else if (value.length > LIMITS[name]) errors[name] = "tooLong"
    else if (name === "email" && value && !EMAIL.test(value)) errors[name] = "email"
  }
  return errors
}

/** Name, work email, organisation, role, and an optional note. Nothing else is collected. */
export function DetailsForm({
  t,
  locale,
  details,
  onChange,
  onSubmit,
}: {
  t: Dictionary["meet"]
  locale: "en" | "ar"
  details: Details
  onChange: (patch: Partial<Details>) => void
  onSubmit: (input: { website: string; turnstileToken: string }) => Promise<SubmitOutcome>
}) {
  const [errors, setErrors] = useState<Partial<Record<Name, string>>>({})
  const [notice, setNotice] = useState<{ tone: Tone; title?: string; body: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [website, setWebsite] = useState("")
  const turnstile = useTurnstile(locale)
  const inFlight = useRef(false)

  const message = (name: Name, code?: string) =>
    code === "tooLong" ? format(t.errors.tooLong, { max: LIMITS[name] }) : code === "email" ? t.errors.email : code ? t.errors.required : undefined

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current) return
    const found = validate(details)
    setErrors(found)
    const first = (Object.keys(LIMITS) as Name[]).find((n) => found[n])
    if (first) return document.getElementById(`meet-${first}`)?.focus()
    if (!turnstile.token) return setNotice({ tone: "wait", body: t.turnstileFailed })

    inFlight.current = true
    setBusy(true)
    setNotice(null)
    const outcome = await onSubmit({ website, turnstileToken: turnstile.token })
    inFlight.current = false
    setBusy(false)
    if (outcome.type === "done") return
    turnstile.reset()
    if (outcome.type === "fields") setErrors(outcome.fields as Partial<Record<Name, string>>)
    if (outcome.type === "notice") setNotice({ tone: outcome.tone, title: outcome.title, body: outcome.body })
  }

  const fieldProps = (name: Name) => ({
    id: `meet-${name}`,
    name,
    value: details[name],
    maxLength: LIMITS[name],
    "aria-invalid": Boolean(errors[name]) || undefined,
    "aria-describedby": errors[name] ? `meet-${name}-error` : undefined,
    "aria-required": REQUIRED.includes(name) || undefined,
  })

  const label = (name: Name) => (
    <div className="flex items-baseline justify-between gap-3">
      <FieldLabel htmlFor={`meet-${name}`} className="text-sm font-medium text-foreground">
        {t.fields[name === "message" ? "note" : name].label}
        {REQUIRED.includes(name) ? (
          <>
            <span aria-hidden className="text-deny">*</span>
            <span className="sr-only">({t.requiredMark})</span>
          </>
        ) : null}
      </FieldLabel>
      {!REQUIRED.includes(name) ? <span className="text-xs text-muted-foreground">{t.optional}</span> : null}
    </div>
  )

  const input = (name: Exclude<Name, "message">, extra: Partial<React.ComponentProps<"input">> = {}) => (
    <Field data-invalid={Boolean(errors[name])} className="gap-2">
      {label(name)}
      <Input
        {...fieldProps(name)}
        {...extra}
        placeholder={t.fields[name].placeholder}
        onChange={(e) => onChange({ [name]: e.target.value })}
      />
      <FieldError id={`meet-${name}-error`}>{message(name, errors[name])}</FieldError>
    </Field>
  )

  return (
    <form noValidate onSubmit={submit} aria-busy={busy} className="relative grid gap-6">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title}>
          {notice.body}
        </Notice>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {input("name", { autoComplete: "name" })}
        {input("email", { type: "email", autoComplete: "email", inputMode: "email", dir: "ltr", className: "rtl:text-right" })}
        {input("company", { autoComplete: "organization" })}
        {input("role", { autoComplete: "organization-title" })}
        <Field data-invalid={Boolean(errors.message)} className="gap-2 sm:col-span-2">
          {label("message")}
          <Textarea {...fieldProps("message")} rows={3} placeholder={t.fields.note.placeholder} onChange={(e) => onChange({ message: e.target.value })} />
          <FieldError id="meet-message-error">{message("message", errors.message)}</FieldError>
        </Field>
        {/* Honeypot: hidden from people and assistive technology. */}
        <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="meet-website">{t.honeypot}</label>
          <input id="meet-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>
      {turnstile.element}
      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-sm text-muted-foreground">
          {t.notice}{" "}
          <Link href={`/${locale}/privacy`} className="font-medium text-foreground underline underline-offset-4">
            {t.noticeLink}
          </Link>
        </p>
        <Button type="submit" size="lg" disabled={busy} className={cn("w-full sm:w-auto")}>
          {busy ? t.submitting : t.submit}
        </Button>
      </div>
    </form>
  )
}
