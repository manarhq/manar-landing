/**
 * Demo request validation shared by the browser form and the server handler.
 * Returns error codes, not messages, so each locale renders its own wording.
 * Kept dependency-free so it runs unchanged in the browser, Node route handlers,
 * and `node --test`.
 */

export const deploymentOptions = ["cloud", "on-premises", "hosted", "unsure"] as const
export type DeploymentOption = (typeof deploymentOptions)[number]

export const fieldLimits = {
  name: 120,
  email: 254,
  organization: 160,
  role: 120,
  message: 2000,
} as const

export type DemoFieldName = "name" | "email" | "organization" | "role" | "deployment" | "message"

export type DemoRequestInput = {
  name: string
  email: string
  organization: string
  role: string
  deployment: DeploymentOption | ""
  message: string
}

export type FieldErrorCode = "required" | "email" | "tooLong" | "lineBreak" | "option"

export type FieldErrors = Partial<Record<DemoFieldName, FieldErrorCode>>

export type ValidationResult =
  | { ok: true; value: DemoRequestInput }
  | { ok: false; errors: FieldErrors }

export const emptyDemoRequest: DemoRequestInput = {
  name: "",
  email: "",
  organization: "",
  role: "",
  deployment: "",
  message: "",
}

// Pragmatic syntax check: one @, no spaces, a dot in the domain, sane label characters.
// Deliberately does not reject any provider (personal addresses are accepted).
const EMAIL_PATTERN = /^[^\s@"<>(),;:\\[\]]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/

const LINE_BREAK = /[\r\n\u2028\u2029]/
// Control characters other than tab/newline are never legitimate form input.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

function text(value: unknown): string {
  return typeof value === "string" ? value.replace(CONTROL_CHARS, "").trim() : ""
}

export function isValidEmail(value: string): boolean {
  if (value.length > fieldLimits.email) return false
  const [local, domain] = value.split("@")
  if (!local || !domain || local.length > 64) return false
  return EMAIL_PATTERN.test(value)
}

/** Validate untrusted input. Unknown keys are ignored; the recipient is never part of this input. */
export function validateDemoRequest(raw: unknown): ValidationResult {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>
  const value: DemoRequestInput = {
    name: text(source.name),
    email: text(source.email),
    organization: text(source.organization),
    role: text(source.role),
    deployment: "",
    message: text(source.message),
  }
  const errors: FieldErrors = {}

  // Single-line fields: required checks, then length, then header-injection guard.
  for (const field of ["name", "email", "organization", "role"] as const) {
    const current = value[field]
    const required = field !== "role"
    if (required && current.length === 0) {
      errors[field] = "required"
    } else if (current.length > fieldLimits[field]) {
      errors[field] = "tooLong"
    } else if (LINE_BREAK.test(current)) {
      errors[field] = "lineBreak"
    }
  }

  if (!errors.email && value.email && !isValidEmail(value.email)) {
    errors.email = "email"
  }

  const deployment = text(source.deployment)
  if (deployment) {
    if ((deploymentOptions as readonly string[]).includes(deployment)) {
      value.deployment = deployment as DeploymentOption
    } else {
      errors.deployment = "option"
    }
  }

  if (value.message.length > fieldLimits.message) {
    errors.message = "tooLong"
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, value }
}
