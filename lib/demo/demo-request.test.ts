import assert from "node:assert/strict"
import { createHash, createHmac } from "node:crypto"
import { describe, it } from "node:test"

import { buildDemoRequestEmail, escapeHtml } from "./email-content.ts"
import { DEMO_REQUEST_RECIPIENT, handleDemoRequest, type DemoRequestDeps } from "./handle-request.ts"
import { createRateLimiter } from "./rate-limit.ts"
import { createAcsTransport, type OutboundEmail, type SendResult } from "./acs.ts"
import { validateDemoRequest } from "./validation.ts"

const valid = {
  name: "Aisha Al Mansoori",
  email: "aisha@example.org",
  organization: "Example Authority",
  role: "Head of Information Security",
  deployment: "unsure",
  message: "An agent that updates supplier records.",
}

function recordingTransport(result: SendResult = { ok: true, id: "email_123" }) {
  const sent: OutboundEmail[] = []
  return {
    sent,
    transport: async (email: OutboundEmail) => {
      sent.push(email)
      return result
    },
  }
}

function deps(overrides: Partial<DemoRequestDeps> = {}): DemoRequestDeps {
  return {
    transport: recordingTransport().transport,
    fromAddress: "Manar <demo@mail.example.com>",
    limiter: createRateLimiter({ limit: 100, windowMs: 60_000 }),
    now: () => new Date("2026-09-17T08:00:00Z"),
    ...overrides,
  }
}

function request(body: unknown, contentType = "application/json") {
  return {
    bodyText: typeof body === "string" ? body : JSON.stringify(body),
    contentType,
    clientKey: "203.0.113.7",
  }
}

describe("validateDemoRequest", () => {
  it("accepts a complete request and trims values", () => {
    const result = validateDemoRequest({ ...valid, name: "  Aisha Al Mansoori  " })
    assert.equal(result.ok, true)
    if (result.ok) assert.equal(result.value.name, "Aisha Al Mansoori")
  })

  it("accepts only the required fields", () => {
    const result = validateDemoRequest({ name: "A", email: "a@b.co", organization: "O" })
    assert.equal(result.ok, true)
  })

  it("reports each missing required field", () => {
    const result = validateDemoRequest({})
    assert.deepEqual(result, {
      ok: false,
      errors: { name: "required", email: "required", organization: "required" },
    })
  })

  it("rejects malformed email but not personal providers", () => {
    for (const bad of ["no-at-sign", "a@b", "a b@example.com", "a@-example.com", "@example.com"]) {
      const result = validateDemoRequest({ ...valid, email: bad })
      assert.equal(result.ok, false, bad)
      if (!result.ok) assert.equal(result.errors.email, "email", bad)
    }
    assert.equal(validateDemoRequest({ ...valid, email: "someone@gmail.com" }).ok, true)
  })

  it("rejects header injection in single-line fields", () => {
    const result = validateDemoRequest({ ...valid, organization: "Acme\r\nBcc: victim@example.com" })
    assert.equal(result.ok, false)
    if (!result.ok) assert.equal(result.errors.organization, "lineBreak")
  })

  it("enforces length limits and deployment options", () => {
    const result = validateDemoRequest({ ...valid, message: "x".repeat(2001), deployment: "mars" })
    assert.equal(result.ok, false)
    if (!result.ok) {
      assert.equal(result.errors.message, "tooLong")
      assert.equal(result.errors.deployment, "option")
    }
  })
})

describe("buildDemoRequestEmail", () => {
  it("escapes HTML and keeps a plain-text alternative", () => {
    const content = buildDemoRequestEmail(
      { ...valid, deployment: "hosted", message: "<script>alert(1)</script>" },
      { locale: "ar", submittedAt: new Date("2026-09-17T08:00:00Z") }
    )
    assert.ok(!content.html.includes("<script>"))
    assert.ok(content.html.includes(escapeHtml("<script>alert(1)</script>")))
    assert.ok(content.text.includes("<script>alert(1)</script>"))
    assert.ok(content.text.includes("Arabic (ar)"))
    assert.ok(content.text.includes("2026-09-17T08:00:00.000Z"))
    assert.equal(content.subject, "Manar demo request: Example Authority")
  })
})

describe("handleDemoRequest", () => {
  it("sends one email to the fixed recipient with the visitor as reply-to", async () => {
    const { sent, transport } = recordingTransport()
    const response = await handleDemoRequest(
      request({ ...valid, to: "attacker@example.com", recipient: "attacker@example.com", locale: "ar" }),
      deps({ transport })
    )
    assert.equal(response.status, 200)
    assert.deepEqual(response.body, { ok: true })
    assert.equal(sent.length, 1)
    assert.equal(sent[0].to, DEMO_REQUEST_RECIPIENT)
    assert.equal(sent[0].to, "info@fixio.ae")
    assert.equal(sent[0].replyTo, valid.email)
    assert.ok(!JSON.stringify(sent[0]).includes("attacker@example.com"))
  })

  it("keeps only allowlisted campaign fields in the email", async () => {
    const { sent, transport } = recordingTransport()
    await handleDemoRequest(
      request({ ...valid, utm: { utm_source: "linkedin", utm_evil: "x", utm_term: "<b>", utm_medium: 7 } }),
      deps({ transport })
    )
    assert.match(sent[0].text, /Campaign source: linkedin/)
    assert.doesNotMatch(sent[0].text, /evil|<b>|Campaign medium/)
  })

  it("does not send invalid submissions", async () => {
    const { sent, transport } = recordingTransport()
    const response = await handleDemoRequest(request({ ...valid, email: "nope" }), deps({ transport }))
    assert.equal(response.status, 422)
    assert.deepEqual(response.body, { ok: false, error: "validation", fields: { email: "email" } })
    assert.equal(sent.length, 0)
  })

  it("rejects non-JSON, malformed, and oversized bodies without sending", async () => {
    const { sent, transport } = recordingTransport()
    assert.equal((await handleDemoRequest(request(valid, "text/plain"), deps({ transport }))).status, 415)
    assert.equal((await handleDemoRequest(request("{not json"), deps({ transport }))).status, 400)
    assert.equal((await handleDemoRequest(request([valid]), deps({ transport }))).status, 400)
    const huge = request({ ...valid, message: "x".repeat(20_000) })
    assert.equal((await handleDemoRequest(huge, deps({ transport }))).status, 413)
    assert.equal(sent.length, 0)
  })

  it("silently drops honeypot submissions", async () => {
    const { sent, transport } = recordingTransport()
    const response = await handleDemoRequest(request({ ...valid, website: "https://spam.example" }), deps({ transport }))
    assert.equal(response.status, 200)
    assert.equal(sent.length, 0)
  })

  it("never reports success when the provider rejects or is unreachable", async () => {
    for (const reason of ["rejected", "network"] as const) {
      const failures: string[] = []
      const { transport } = recordingTransport({ ok: false, reason })
      const response = await handleDemoRequest(
        request(valid),
        deps({ transport, logFailure: (r) => failures.push(r) })
      )
      assert.equal(response.status, 502)
      assert.deepEqual(response.body, { ok: false, error: "unavailable" })
      assert.deepEqual(failures, [reason])
    }
  })

  it("never reports success when email is not configured", async () => {
    const transport = createAcsTransport({
      connectionString: undefined,
      fetchImpl: async () => {
        throw new Error("fetch must not be called without configuration")
      },
    })
    const response = await handleDemoRequest(request(valid), deps({ transport, fromAddress: undefined }))
    assert.equal(response.status, 503)
    assert.deepEqual(response.body, { ok: false, error: "unavailable" })
  })

  it("rate limits repeated submissions from one client", async () => {
    const { sent, transport } = recordingTransport()
    const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 })
    const shared = deps({ transport, limiter })
    assert.equal((await handleDemoRequest(request(valid), shared)).status, 200)
    assert.equal((await handleDemoRequest(request(valid), shared)).status, 200)
    const third = await handleDemoRequest(request(valid), shared)
    assert.equal(third.status, 429)
    assert.ok(Number(third.headers?.["Retry-After"]) > 0)
    assert.equal(sent.length, 2)
  })
})

describe("createAcsTransport", () => {
  const key = Buffer.from("test-access-key").toString("base64")
  const connectionString = `endpoint=https://acs-test.uae.communication.azure.com/;accesskey=${key}`
  const email = { from: "a@b.co", to: "info@fixio.ae", replyTo: "c@d.co", subject: "s", text: "t", html: "h" }

  it("posts a signed send request with a mocked fetch", async () => {
    let captured: { url: string; init: RequestInit } | undefined
    const now = new Date("2026-11-02T10:00:00Z")
    const transport = createAcsTransport({
      connectionString,
      now: () => now,
      fetchImpl: async (url, init) => {
        captured = { url: String(url), init: init ?? {} }
        return new Response(JSON.stringify({ id: "op-1", status: "Running" }), { status: 202 })
      },
    })
    const result = await transport({ ...email, from: "Manar <noreply@fixio.ae>", replyTo: "aisha@example.org" })
    assert.deepEqual(result, { ok: true, id: "op-1" })
    assert.equal(captured?.url, "https://acs-test.uae.communication.azure.com/emails:send?api-version=2023-03-31")

    const body = String(captured?.init.body)
    const parsed = JSON.parse(body)
    assert.equal(parsed.senderAddress, "noreply@fixio.ae")
    assert.deepEqual(parsed.recipients, { to: [{ address: "info@fixio.ae" }] })
    assert.deepEqual(parsed.replyTo, [{ address: "aisha@example.org" }])
    assert.deepEqual(parsed.content, { subject: "s", plainText: "t", html: "h" })

    const headers = captured?.init.headers as Record<string, string>
    const hash = createHash("sha256").update(body).digest("base64")
    assert.equal(headers["x-ms-date"], "Mon, 02 Nov 2026 10:00:00 GMT")
    assert.equal(headers["x-ms-content-sha256"], hash)
    const signed = `POST\n/emails:send?api-version=2023-03-31\nMon, 02 Nov 2026 10:00:00 GMT;acs-test.uae.communication.azure.com;${hash}`
    const signature = createHmac("sha256", Buffer.from("test-access-key")).update(signed).digest("base64")
    assert.equal(
      headers.Authorization,
      `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}`
    )
  })

  it("is not configured without a usable connection string or sender", async () => {
    const fetchImpl = async () => {
      throw new Error("fetch must not be called without configuration")
    }
    for (const cs of [undefined, "", "endpoint=https://x.example/", `accesskey=${key}`, `endpoint=http://x.example/;accesskey=${key}`]) {
      assert.deepEqual(await createAcsTransport({ connectionString: cs, fetchImpl })(email), {
        ok: false,
        reason: "not_configured",
      })
    }
    assert.deepEqual(await createAcsTransport({ connectionString, fetchImpl })({ ...email, from: "" }), {
      ok: false,
      reason: "not_configured",
    })
  })

  it("maps provider errors and network failures", async () => {
    const rejected = createAcsTransport({
      connectionString,
      fetchImpl: async () => new Response("{}", { status: 401 }),
    })
    const offline = createAcsTransport({
      connectionString,
      fetchImpl: async () => {
        throw new TypeError("fetch failed")
      },
    })
    assert.deepEqual(await rejected(email), { ok: false, reason: "rejected" })
    assert.deepEqual(await offline(email), { ok: false, reason: "network" })
  })
})
