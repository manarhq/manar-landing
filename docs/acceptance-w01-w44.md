# Website requirements W01-W44: Manar landing

The W01-W44 checklist is carried over from the PepMyTide brief and adapted to a bilingual marketing site with a demo request form.
Status values: **implemented** (built, checked locally), **n/a** (no such surface on this site), **open** (needs a person or production).
Evidence is from the `feat/redesign-lighthouse` branch on 2026-09-25. It covers the dev server and `next build` + `next start` on localhost, Playwright at 1440x900 and 390x844, and Chrome Lighthouse.

| ID | Status | Where / evidence |
| --- | --- | --- |
| W01 Appearance | implemented | `components/site/theme-toggle.tsx`: Light/Dark/System menu, System default, explicit choice in `manar-theme`, pre-paint script in `app/[lang]/layout.tsx` and `app/global-not-found.tsx`. |
| W02 Cookie banner | implemented | `components/site/consent.tsx` and `lib/consent.ts`. Banner only when `NEXT_PUBLIC_CF_BEACON_TOKEN` is set. Accept, reject, and preferences. Reopen from the footer "Cookie settings". Withdrawal reloads to stop the beacon. The choice expires after 12 months. Tests are in `lib/consent.test.ts`. |
| W03 Site search | implemented | `components/site/search-dialog.tsx` and `lib/search-index.ts`. Cmd+K or Ctrl+K opens it. Mobile has an icon entry. Results cover sections, FAQ answers, legal and demo pages. Arrow keys and Enter work, with an empty state. Escape closes and focus is restored by the Base UI Dialog. Arabic diacritics and letter forms are folded. |
| W04 Back-to-top | implemented | `components/site/floating-controls.tsx`: the button appears after 1.5 viewports, has an accessible name, and moves focus to `#main`. It jumps instead of scrolling smoothly under reduced motion. |
| W05 Mobile navigation | implemented | `components/site/mobile-nav.tsx`: Sheet dialog, closes on link click and route change. Theme and language stay in the header. |
| W06 Loading states | implemented | The demo submit shows a pending state. The WebGL scenes show a poster until the first frame. There are no fake loaders. |
| W07 Interaction states | implemented | Button variants have hover, focus-visible ring, press scale and disabled states. Tabs, menu and switch expose selected state through data attributes. |
| W08 Scroll progress | implemented | `.scroll-progress` in `app/globals.css` uses a CSS scroll timeline. It is hidden when the page does not scroll or the timeline is unsupported, and runs right-to-left in Arabic. |
| W09 Copy actions | implemented | Copy email in the contact popover and copy link per FAQ answer. Clipboard API with an `execCommand` fallback, honest failure text and live regions. |
| W10 Print stylesheet | implemented | `@media print` in `globals.css`: header, canvas, grain, overlays and footer are hidden. Colors are forced light and external link URLs are printed. The legal pages have a Print button. |
| W11 Sticky header | implemented | `.header-surface`: transparent over the hero, frosted after scrolling. `scroll-padding-top` offsets anchors. |
| W12 Skip link | implemented | In the layout, it targets the single `main#main` on every route. |
| W13 Password visibility | n/a | The site has no password fields. |
| W14 UTM attribution | implemented | `pickUtm` allowlists 5 keys, each up to 100 characters of plain text. Stored in sessionStorage only with analytics consent and cleared on withdrawal. Sent with a demo request and re-validated on the server (`lib/demo/handle-request.ts`, test in `demo-request.test.ts`). |
| W15 Success states | implemented | The demo form separates validation, received, rate-limited and unavailable. The consent choice is announced when saved. |
| W16 Error states | implemented | The demo form keeps input and offers retry and email. Clipboard failure is explained. Search and FAQ have empty states. |
| W17 Confirmation dialogs | n/a | No destructive or financial actions. |
| W18 Last-updated dates | implemented | `updated` is stored in `lib/legal/*.ts`, rendered as `<time>` and used as the sitemap `lastmod`. |
| W19 Searchable FAQ | implemented | `components/home/faq.tsx`: filter, result count, empty state, reset, `#faq-N` deep links that open and focus the question, and copy link. |
| W20 Floating contact | implemented | A quiet contact popover with the email address and the demo link. It hides while the consent banner is up. |
| W21 Terms | open | `/[lang]/terms`, bilingual and dated. Marked as a draft. Needs the registered entity and governing law. |
| W22 Privacy notice | open | `/[lang]/privacy` covers the demo form, Resend, logs, Cloudflare and optional analytics. Draft. Needs the entity, retention periods and applicable law. |
| W23 Cookie/storage policy | implemented | `/[lang]/cookies` has a storage table matching `manar-theme`, `manar-consent`, `manar-utm` and the conditional Cloudflare cookies. |
| W24 English/Arabic | implemented | All new strings are in `lib/i18n/dictionaries/{en,ar}.ts`. Arabic sets `dir=rtl`, and the lighthouse scene is mirrored in Arabic. |
| W25 Semantics | implemented | One `main`, one `h1`, labelled sections and descriptive link text. Decorative canvases are `aria-hidden`. |
| W26 Keyboard/dialogs | implemented | Base UI Dialog, Popover and Menu handle focus trap, Escape and focus restore. The search uses the combobox pattern with `aria-activedescendant`. |
| W27 Contrast/targets | implemented | Lighthouse accessibility scored 97 on mobile. The one failure, the dimmed manifesto words, was fixed by raising their resting opacity. Floating controls are 48 px and header controls 40 px. Status is never shown by colour alone. |
| W28 Responsive/zoom | implemented | Checked at 390 px and 1440 px with no horizontal overflow. Arabic layout was checked. A 200% zoom pass is still to do on real devices. |
| W29 Reduced motion | implemented | CSS reveals are gated by `prefers-reduced-motion: no-preference`. Motion springs drop to zero duration. The WebGL scenes draw one still frame. Smooth scrolling is disabled. |
| W30 Purposeful scroll | implemented | The manifesto words light up as they are read. The product frame tilts in. The How it works trace is pinned beside its steps. All three are native scroll with a static fallback. |
| W31 URL/state integrity | implemented | FAQ deep links survive refresh and back/forward. The demo form is not URL-driven. |
| W32 Saved/comparison | n/a | No products. |
| W33 Product selection | n/a | No products. |
| W34 Cart/checkout | n/a | No commerce. |
| W35 Honest handoff | implemented | Demo requests go through the real API and Resend, with a mailto fallback. The contact popover promises only email. |
| W36 SEO metadata | implemented | Per-page titles and descriptions with no em dashes. Existing OG images kept. |
| W37 Indexing/URLs | implemented | Sitemap adds the legal pages with alternates. Canonicals are unchanged. The 404 page is noindex. |
| W38 Structured data | implemented | `WebSite` plus an `Organization` (VAX) with the Manar brand. No ratings or prices. |
| W39 Images/fonts | implemented | Geist variable and Plex Arabic with 3 weights. The mono font is not preloaded. Posters are 16 KB and 15 KB webp. The lens mounts only near the viewport. |
| W40 Performance | open | Lab measurement on localhost at 4x CPU and Fast 4G gave LCP 601 ms and CLS 0.00. Field INP needs production data. |
| W41 Empty/error/not-found | implemented | `app/global-not-found.tsx` is a bilingual, branded 404. Search and FAQ have empty states. The demo form has error states. |
| W42 Security boundaries | implemented | CSP and security headers in `next.config.ts`. `unsafe-inline` scripts are required by static prerendering, and the only third-party origin is the consent-gated beacon. Server-side validation for the demo request and UTM fields. |
| W43 Genuine destinations | implemented | Every link and button goes to a real route, anchor or action. Illustrative data is labelled. |
| W44 Overlay coordination | implemented | Layering scale in `--z-*` tokens. Floating controls step aside for the consent banner. Safe-area insets are respected. |
