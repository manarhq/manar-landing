# Manar marketing site

Bilingual (English / Arabic) marketing homepage and demo request flow for Manar (منار), a VAX product.
Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, shadcn/ui on Base UI.

This repository contains only the public website. The governance application lives in `manar-web`.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values as needed; never commit .env files
npm run dev                  # http://localhost:3000 → redirects to /en
```

| Command             | Purpose                                                            |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Development server                                                 |
| `npm run build`     | Production build                                                   |
| `npm start`         | Serve the production build (requires the Node.js server)           |
| `npm run lint`      | ESLint (flat config, `eslint-config-next`)                         |
| `npm run typecheck` | Generate route types, then `tsc --noEmit`                          |
| `npm test`          | Unit tests for demo-request validation, email, and transport (Node's built-in test runner, no network) |

## Routes

| Route                | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `/`                  | Permanently redirects (308) to `/en`                   |
| `/en`, `/ar`         | Homepage (statically prerendered)                      |
| `/en/demo`, `/ar/demo` | Demo request page (statically prerendered)           |
| `/sitemap.xml`       | Public XML sitemap for the four canonical pages and their language alternates |
| `/robots.txt`        | Public crawler rules and absolute sitemap location    |
| `POST /api/demo-request` | Validates a demo request and emails it (Node.js runtime) |

Unsupported locales return 404 (`dynamicParams = false`).

## Environment variables

| Variable          | Required for          | Notes |
| ----------------- | --------------------- | ----- |
| `SITE_URL`        | Sitemap/robots/metadata | Public origin; defaults to `https://manar.vax.sh`. Read at **build time**. Overrides must be absolute HTTP(S) origins with no credentials, path, query, or fragment. Invalid values fail the build. Docker requires an explicit build argument; CI already supplies it. |
| `RESEND_API_KEY`  | Sending demo requests | Server-only. |
| `DEMO_FROM_EMAIL` | Sending demo requests | Sender on a domain verified in Resend, e.g. `Manar <demo@mail.your-domain>`. |

## Search indexing

Next.js generates `/robots.txt` and `/sitemap.xml` as public, static metadata routes at the domain root;
they require no login, cookies, or locale prefix. The sitemap contains `/en`, `/ar`, `/en/demo`, and
`/ar/demo`, with reciprocal English/Arabic alternates and an English `x-default`. It excludes the root
redirect and operational endpoints. `lastmod` is omitted because content modification dates are not
tracked; do not substitute build time for the date of a real content update.

Robots rules allow public pages and rendering assets, and disallow crawling `/api/` and `/_edge-health`.
These rules are crawler hints, not access controls or a guarantee that an endpoint cannot be indexed.
Every public page has a self-referencing canonical, localized title/description, language alternates,
and `index, follow` metadata. Both homepages include consistent `WebSite` structured data. FAQ answers
remain in server-rendered HTML even when collapsed. No keyword stuffing, invented reviews, or ratings
are needed.

After deploying:

1. Open `https://manar.vax.sh/robots.txt` and `https://manar.vax.sh/sitemap.xml` without signing in.
   Both must return HTTP 200 with plain-text/XML content, not a challenge or HTML error page. If
   Cloudflare still serves an earlier cached 404, purge those two URLs and check again. Keep Googlebot
   able to access pages, CSS, JavaScript, and images through any Cloudflare bot/access rules.
2. Verify the `manar.vax.sh` property in [Google Search Console](https://search.google.com/search-console)
   (DNS verification works without application changes), and submit `https://manar.vax.sh/sitemap.xml`
   in **Sitemaps**.
3. Use **URL Inspection → Test live URL** on `/en` and `/ar`, then **Request indexing**. Follow the
   Page indexing report for exclusions and the Performance report for actual search queries.

CI's optional public smoke check (`PRODUCTION_SMOKE_URL=https://manar.vax.sh`) validates both discovery
files after release. Google decides whether and when to index and rank a page; a valid sitemap does
not guarantee either. Reference: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[localized pages](https://developers.google.com/search/docs/specialty/international/localized-versions),
and [technical requirements](https://developers.google.com/search/docs/essentials/technical).

## Demo request email

- Flow: `components/demo/demo-form.tsx` → `POST /api/demo-request` (`app/api/demo-request/route.ts`)
  → `handleDemoRequest` (`lib/demo/handle-request.ts`) → transport (`lib/demo/server.ts`).
- The recipient is fixed server-side: `nofal@vax.sh` (`DEMO_REQUEST_RECIPIENT`). No request field can change it.
  The visitor's validated email is used as `Reply-To`.
- Validation runs in the browser and again on the server (`lib/demo/validation.ts`): required fields, email
  syntax (personal providers are accepted), length limits, allowed deployment options, and rejection of line
  breaks in single-line fields (header injection). Request bodies over 16 KB and non-JSON bodies are rejected.
- The email has HTML (all values escaped) and plain-text parts, and includes locale and UTC submission time.
- Spam and abuse: a hidden honeypot field (silently accepted, nothing sent) and a rate limit of 5 requests per
  client per 10 minutes.
- Failure behaviour: missing configuration (503), provider rejection or network failure (502) all show a
  localized failure with `nofal@vax.sh` as an alternative. The visitor's input is preserved. Only the failure
  reason is logged (`demo_request_email_failed`), never submission content.
- A 200 response means the provider **accepted** the message. It is not proof of inbox delivery.
- To change provider, replace `createResendTransport` in `lib/demo/server.ts` with another function matching
  `EmailTransport` (`lib/demo/resend.ts`). The handler and UI do not depend on Resend.

### Rate limiting limitation

`lib/demo/rate-limit.ts` is in-memory and per process. It is effective for a single Node instance. With several
replicas or serverless instances, each keeps separate counters that reset on restart. For replicated deployments,
add a shared store (for example Redis) or edge/WAF rate limiting in front of `/api/demo-request`.
The client key comes from `x-forwarded-for` / `x-real-ip`; only trust these behind a proxy that sets them.

### Resend setup (not yet done)

1. Verify a sending domain in Resend (DNS records).
2. Create an API key with sending access.
3. Set `RESEND_API_KEY` and `DEMO_FROM_EMAIL` in the deployment environment.
4. Submit one real request from the deployed site and confirm it arrives at `nofal@vax.sh`.

## Deployment requirements

The site needs a Node.js server runtime because the demo endpoint runs server-side. Do not configure
`output: "export"`; a static export removes the endpoint. Production runs as a container on K3s behind Traefik,
an edge Nginx, and Cloudflare: see [`deploy/README.md`](deploy/README.md) and the `Dockerfile`.
`/api/health` serves liveness and readiness probes. `TRUSTED_CLIENT_IP_HEADER` names a proxy-set header to use as
the client IP for rate limiting; set it only when every request passes a proxy that overwrites that header.

## Editing content and translations

- All visible copy, accessible labels, sample workspace data, FAQs, form text, errors, and metadata live in
  typed dictionaries: `lib/i18n/dictionaries/en.ts` and `ar.ts`. `ar.ts` is typed against the English shape,
  so a missing or extra key fails `npm run typecheck`.
- Locales and direction: `lib/i18n/config.ts`. The `[lang]` root layout sets `lang` and `dir` on the server.
- Use logical Tailwind utilities (`ms-*`, `pe-*`, `start-*`, `text-start`) so layouts mirror in RTL. Mirror
  directional arrows with `rtl:-scale-x-100`. Never mirror the logo. Wrap emails, IDs, and URLs in
  `ltr-fragment` (or `<bdi>`).
- Sample workspace content must stay visibly labelled as illustrative. Do not add customer names, certifications,
  performance numbers, or integrations that have not been confirmed.

## Brand tokens and theme

- Tokens are defined once in `app/globals.css`: light values on `:root`, dark values on `.dark`. shadcn variables
  (`--background`, `--primary`, …) are mapped from the semantic tokens (`--page`, `--action`, …), and Tailwind
  color utilities (`bg-surface`, `text-link`, `text-warning`, …) come from `@theme inline`.
- Radius scale: `rounded-md` 8px (controls), `rounded-lg` 12px (cards), `rounded-xl` 20px (large previews).
- Fonts via `next/font/google`: Manrope (English), IBM Plex Sans Arabic (Arabic), IBM Plex Mono (IDs and
  metadata only, not preloaded).
- Theme: dark by default. An explicit choice is stored in `localStorage` (`manar-theme`) and applied by an inline
  script before first paint (`app/[lang]/layout.tsx`); `components/site/theme-toggle.tsx` handles switching.
- The beam motif is CSS only (`.beam`, `.glow`, `.blueprint` in `globals.css`).

## Brand assets

- `public/brand/manar-lighthouse.png`: the selected lighthouse mark (Stitch Concept B, 160 × 168 RGBA).
  Always render it at its natural aspect ratio next to live "Manar" / "منار" text.
- `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`: derived from that PNG by padding to a square
  (no redrawing).
- `public/og/manar-en.png`, `public/og/manar-ar.png`: 1200 × 630 social images built from the same mark.
- `design/stitch/`: exported Stitch references (design input only, not site source; the copy in those files
  contains unverified claims and must not be reused as-is).
