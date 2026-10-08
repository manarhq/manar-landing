"use client"

import { CheckCircleIcon, CircleNotchIcon, WarningCircleIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { readStoredUtm } from "@/lib/consent"
import type { DemoApiBody } from "@/lib/demo/handle-request"
import {
  deploymentOptions,
  emptyDemoRequest,
  fieldLimits,
  validateDemoRequest,
  type DemoFieldName,
  type DemoRequestInput,
  type FieldErrorCode,
  type FieldErrors,
} from "@/lib/demo/validation"
import type { Locale } from "@/lib/i18n/config"
import { format, type Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

type FormText = Dictionary["demo"]["form"]
type Status = "idle" | "submitting" | "success" | "failure" | "rate_limited"

const fieldOrder: DemoFieldName[] = ["name", "email", "organization", "role", "deployment", "message"]

export function DemoForm({ locale, t, email }: { locale: Locale; t: FormText; email: string }) {
  const [values, setValues] = useState<DemoRequestInput>(emptyDemoRequest)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [honeypot, setHoneypot] = useState("")
  const [submitted, setSubmitted] = useState<{ name: string; email: string } | null>(null)
  const inFlight = useRef(false)
  const successHeading = useRef<HTMLHeadingElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "success") successHeading.current?.focus()
    if (status === "failure" || status === "rate_limited") feedbackRef.current?.focus()
  }, [status])

  function messageFor(field: DemoFieldName, code: FieldErrorCode | undefined): string | undefined {
    if (!code) return undefined
    if (code === "tooLong") {
      const max = field in fieldLimits ? fieldLimits[field as keyof typeof fieldLimits] : 0
      return format(t.errors.tooLong, { max })
    }
    return t.errors[code]
  }

  function update<K extends keyof DemoRequestInput>(field: K, value: DemoRequestInput[K]) {
    const next = { ...values, [field]: value }
    setValues(next)
    if (status === "failure" || status === "rate_limited") setStatus("idle")
    // After a submit attempt, re-check as the visitor corrects fields.
    if (attempted) {
      const result = validateDemoRequest(next)
      setErrors(result.ok ? {} : result.errors)
    }
  }

  function focusField(field: DemoFieldName) {
    const el = document.getElementById(`demo-${field}`)
    el?.focus()
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current) return

    setAttempted(true)
    const result = validateDemoRequest(values)
    if (!result.ok) {
      setErrors(result.errors)
      const first = fieldOrder.find((f) => result.errors[f])
      if (first) focusField(first)
      return
    }

    setErrors({})
    inFlight.current = true
    setStatus("submitting")

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.value, locale, website: honeypot, utm: readStoredUtm() }),
      })
      const body = (await response.json().catch(() => null)) as DemoApiBody | null

      if (response.ok && body?.ok) {
        setSubmitted({ name: result.value.name, email: result.value.email })
        setStatus("success")
      } else if (body && !body.ok && body.error === "validation") {
        setErrors(body.fields)
        setStatus("idle")
        const first = fieldOrder.find((f) => body.fields[f])
        if (first) focusField(first)
      } else if (response.status === 429) {
        setStatus("rate_limited")
      } else {
        setStatus("failure")
      }
    } catch {
      setStatus("failure")
    } finally {
      inFlight.current = false
    }
  }

  if (status === "success" && submitted) {
    return (
      <div className="rounded-md border border-line bg-surface p-6 md:p-8" role="status">
        <CheckCircleIcon aria-hidden weight="fill" className="size-8 text-allow" />
        <h2 ref={successHeading} tabIndex={-1} className="mt-6 text-2xl font-semibold text-foreground outline-none">
          {t.success.title}
        </h2>
        <p className="mt-3 max-w-lg text-lg text-muted-foreground">
          {renderWithFragments(t.success.body, submitted)}
        </p>
        <Link href={`/${locale}`} className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "mt-8")}>
          {t.success.back}
        </Link>
      </div>
    )
  }

  const submitting = status === "submitting"
  const errorCount = Object.keys(errors).length
  const describedBy = (field: DemoFieldName) => (errors[field] ? `demo-${field}-error` : undefined)

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="demo-form-title"
      aria-busy={submitting}
      className="relative rounded-md border border-line bg-surface p-4 md:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 id="demo-form-title" className="text-2xl font-semibold text-foreground">
          {t.title}
        </h2>
        <p className="text-sm text-muted-foreground">{t.requiredHint}</p>
      </div>

      <div ref={feedbackRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {status === "failure" || status === "rate_limited" ? (
          <div className="mt-6 flex gap-3 rounded-md bg-deny-soft p-4 text-sm">
            <WarningCircleIcon aria-hidden className="size-5 shrink-0 text-deny" />
            <div>
              <p className="font-semibold text-foreground">
                {status === "failure" ? t.failure.title : t.rateLimited.title}
              </p>
              <p className="mt-1 text-foreground">
                {status === "failure" ? t.failure.body : t.rateLimited.body}{" "}
                <a href={`mailto:${email}`} className="ltr-fragment font-medium text-foreground underline underline-offset-4">
                  {email}
                </a>
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <p aria-live="polite" className={cn("text-sm font-medium text-deny", attempted && errorCount > 0 ? "mt-6" : "sr-only")}>
        {attempted && errorCount > 0 ? t.errors.summary : ""}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <TextField
          field="name"
          label={t.fields.name.label}
          placeholder={t.fields.name.placeholder}
          value={values.name}
          onChange={(v) => update("name", v)}
          error={messageFor("name", errors.name)}
          required
          requiredMark={t.requiredMark}
          autoComplete="name"
          maxLength={fieldLimits.name}
        />
        <TextField
          field="email"
          type="email"
          label={t.fields.email.label}
          placeholder={t.fields.email.placeholder}
          value={values.email}
          onChange={(v) => update("email", v)}
          error={messageFor("email", errors.email)}
          required
          requiredMark={t.requiredMark}
          autoComplete="email"
          inputMode="email"
          maxLength={fieldLimits.email}
          ltr
        />
        <TextField
          field="organization"
          label={t.fields.organization.label}
          placeholder={t.fields.organization.placeholder}
          value={values.organization}
          onChange={(v) => update("organization", v)}
          error={messageFor("organization", errors.organization)}
          required
          requiredMark={t.requiredMark}
          autoComplete="organization"
          maxLength={fieldLimits.organization}
        />
        <TextField
          field="role"
          label={t.fields.role.label}
          optionalLabel={t.optional}
          placeholder={t.fields.role.placeholder}
          value={values.role}
          onChange={(v) => update("role", v)}
          error={messageFor("role", errors.role)}
          autoComplete="organization-title"
          maxLength={fieldLimits.role}
        />

        <Field data-invalid={Boolean(errors.deployment)} className="gap-2 sm:col-span-2">
          <LabelRow htmlFor="demo-deployment" label={t.fields.deployment.label} optionalLabel={t.optional} />
          <Select
            items={deploymentOptions.map((value) => ({ value, label: t.fields.deployment.options[value] }))}
            value={values.deployment || null}
            onValueChange={(value) => update("deployment", (value ?? "") as DemoRequestInput["deployment"])}
          >
            <SelectTrigger
              id="demo-deployment"
              className="w-full"
              aria-invalid={Boolean(errors.deployment) || undefined}
              aria-describedby={describedBy("deployment")}
            >
              <SelectValue placeholder={t.fields.deployment.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {deploymentOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {t.fields.deployment.options[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError id="demo-deployment-error">{messageFor("deployment", errors.deployment)}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.message)} className="gap-2 sm:col-span-2">
          <LabelRow htmlFor="demo-message" label={t.fields.message.label} optionalLabel={t.optional} />
          <Textarea
            id="demo-message"
            name="message"
            rows={4}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder={t.fields.message.placeholder}
            maxLength={fieldLimits.message}
            aria-invalid={Boolean(errors.message) || undefined}
            aria-describedby={describedBy("message")}
            className="min-h-32"
          />
          <FieldError id="demo-message-error">{messageFor("message", errors.message)}</FieldError>
        </Field>

        {/* Honeypot: hidden from people and assistive technology. */}
        <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="demo-website">{t.honeypot}</label>
          <input
            id="demo-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-sm text-muted-foreground">
          {t.notice}{" "}
          <Link href={`/${locale}/privacy`} className="font-medium text-foreground underline underline-offset-4">
            {t.noticeLink}
          </Link>
        </p>
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? <CircleNotchIcon aria-hidden className="animate-spin" /> : null}
          {submitting ? t.submitting : status === "failure" ? t.failure.retry : t.submit}
        </Button>
      </div>
    </form>
  )
}

function LabelRow({ htmlFor, label, optionalLabel, required, requiredMark }: {
  htmlFor: string
  label: string
  optionalLabel?: string
  required?: boolean
  requiredMark?: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <FieldLabel htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <>
            <span aria-hidden className="text-deny">
              *
            </span>
            <span className="sr-only">({requiredMark})</span>
          </>
        ) : null}
      </FieldLabel>
      {optionalLabel && !required ? <span className="text-xs text-muted-foreground">{optionalLabel}</span> : null}
    </div>
  )
}

function TextField({
  field,
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  requiredMark,
  optionalLabel,
  type = "text",
  ltr,
  ...inputProps
}: {
  field: DemoFieldName
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  requiredMark?: string
  optionalLabel?: string
  type?: string
  ltr?: boolean
} & Pick<React.ComponentProps<"input">, "autoComplete" | "maxLength" | "inputMode">) {
  const id = `demo-${field}`
  return (
    <Field data-invalid={Boolean(error)} className="gap-2">
      <LabelRow htmlFor={id} label={label} optionalLabel={optionalLabel} required={required} requiredMark={requiredMark} />
      <Input
        id={id}
        name={field}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        dir={ltr ? "ltr" : undefined}
        className={cn(ltr && "rtl:text-right")}
        {...inputProps}
      />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </Field>
  )
}

/** Render a template with {name}/{email} values as isolated fragments. */
function renderWithFragments(template: string, values: { name: string; email: string }) {
  return template.split(/(\{name\}|\{email\})/).map((part, i) => {
    if (part === "{name}") return <bdi key={i} className="font-semibold text-foreground">{values.name}</bdi>
    if (part === "{email}") return <bdi key={i} className="ltr-fragment font-semibold text-foreground">{values.email}</bdi>
    return <span key={i}>{part}</span>
  })
}
