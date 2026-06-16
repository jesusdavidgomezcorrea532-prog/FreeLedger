# FreeLedger — Project Audit

> Generated 2026-06-09 by reading the codebase directly. Note: the audit prompt was written for a Flutter/Dart app; **FreeLedger is a Next.js web app**, so the Flutter-specific questions have been mapped to their web equivalents (`pubspec.yaml` → `package.json`, Dart files → TS/TSX, etc.).

---

## Section 1: Executive Summary

FreeLedger is a web-based personal-finance dashboard built specifically for freelancers: it tracks income per client, separates business from personal expenses, estimates a tax reserve, and surfaces one headline number — "your real money" (received income − expenses − tax reserve). It's for solo freelancers and contractors who get paid irregularly by multiple clients and never quite know how much of their bank balance is actually theirs to spend. The project is at a **late-MVP / pre-launch-beta** stage: the full product loop (auth → onboarding → track → visualize → upgrade → pay) is built and wired to real payments, but it has zero automated tests, an unversioned database schema, and several manual deploy steps still pending. Tech stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Supabase (auth/Postgres) + Recharts + Resend + LemonSqueezy.

---

## Section 2: What Exists Today

### 2a. Feature Inventory

| Feature | Status | Complexity | Notes |
|---|---|---|---|
| Landing page (hero, problem, features, pricing, footer) | Working | Medium | Sticky nav, scroll animations, dark/light. Pricing CTAs now point to `/signup` (registration open for Product Hunt launch). |
| Waitlist capture | Working | Simple | Server Action with duplicate handling + confirmation email. Now secondary since registration is open. |
| Auth — email/password | Working | Medium | Supabase. Signup/login Server Actions. No "forgot password" flow. |
| Auth — Google OAuth | Working | Medium | `/auth/callback` code exchange with Vercel forwarded-host handling. Requires Google Cloud config (manual). |
| Route protection | Working | Medium | `proxy.ts` (Next 16 middleware) + defense-in-depth auth checks in layouts. |
| Onboarding wizard (3 steps) | Working | Medium | Country/currency, tax rate, first client. Skip option. Redirect logic guards against loops. |
| Dashboard — "Real Money" | Working | Complex | Summary cards + MoM delta + CSS mini-bar-chart + 3 Recharts charts + alerts + recent transactions + empty state. Core value prop. |
| Income CRUD | Working | Complex | Month picker, client/status/search filters, sortable columns, URL-persisted state, debounced search. |
| Expenses CRUD | Working | Complex | Same architecture; business/personal/mixed types with deductible % slider, 13 categories. |
| Clients CRUD | Working | Medium | Color picker, active/archived, delete confirm with unlink copy. |
| Settings | Working | Medium | Profile, financial settings, plan card, CSV export, danger zone (delete account is a **placeholder/disabled**). |
| CSV export (income/expenses/all) | Working | Medium | 3 Route Handlers, auth-gated, RFC-style escaping. **Not yet gated behind Pro** (intentionally open pre-launch). |
| Free-tier limits + paywall | Working | Complex | 3 clients / 30 transactions per month, enforced **server-side**. Usage meters, 80% warning toast, upgrade prompts. |
| Upgrade page (Free/Pro/Lifetime) | Working | Medium | Live checkout CTAs. |
| LemonSqueezy payments | Working | Complex | Real variant IDs wired, `/api/checkout` redirect with user_id injection, webhook with HMAC-SHA256 signature verification, plan updates via service-role client. |
| Transactional emails | Working | Medium | Welcome, waitlist confirmation, upgrade confirmation. Hand-rolled HTML (no React Email). Send-once guards. **Requires verified DNS to deliver to non-owner addresses.** |
| Blog (MDX) | Working | Medium | 4 posts, `next-mdx-remote`, reading time, RSS feed (`/blog/feed.xml`), related posts, canonical tags. |
| SEO / metadata | Working | Medium | Dynamic OG/Twitter images (edge), favicon/apple-icon, `robots.ts`, `sitemap.ts`. |
| Legal pages | Working | Simple | Privacy + Terms (static, Colombia governing law). |
| Dark/light mode | Working | Medium | `next-themes`, theme-reactive charts, hydration-safe toggle. |
| Keyboard shortcuts | Working | Simple | Ctrl/Cmd+K and `/` focus search; `N` opens create dialog. |
| Loading + error states | Working | Simple | Per-route `loading.tsx` skeletons + dashboard `error.tsx` boundary. |

### 2b. Tech Stack & Architecture

- **Framework / language:** Next.js `16.2.4` (App Router, Turbopack), React `19.2.4`, TypeScript `^5`. Tailwind CSS `v4`.
- **State management:** No global store. Server Components fetch data; client state is local (`useState`/`useMemo`/`useRef`) with URL `searchParams` as the source of truth for filters/sorting. This is the idiomatic App-Router approach and is appropriate for the app's scope.
- **Backend / API:** Supabase (hosted Postgres + Auth). No separate backend — all server logic lives in Next.js Server Actions (`src/lib/actions/*`) and Route Handlers (`src/app/api/*`).
- **Database:** Supabase Postgres. Tables: `users`, `clients`, `income`, `expenses`, `waitlist`. Row-Level Security on every table keyed to `auth.uid()`. Indexes on `user_id` and `(user_id, date)`.
- **Authentication:** Supabase Auth — email/password + Google OAuth. `@supabase/ssr` cookie-based sessions, refreshed in `proxy.ts`. Three layers of auth (proxy + route-group layout + dashboard layout).
- **Third-party services:** Supabase (auth/DB), LemonSqueezy (payments/MoR), Resend (email), Vercel Analytics, Google OAuth.
- **Navigation:** Next.js App Router file-based routing with route groups `(auth)` and `(dashboard)`.
- **Project structure:** Layer-first within `src/` — `app/` (routes), `components/` (feature-grouped + `ui/` primitives), `lib/` (`actions/`, `hooks/`, `emails/`, `supabase/`, utilities), `types/`, `content/blog/`. Clean and consistent.

### 2c. Codebase Health

- **Size:** ~100 source files, **~12,457 lines** of TS/TSX (161 files total incl. config/content).
- **Test coverage:** **Zero.** No `*.test.*` / `*.spec.*` files, no test runner installed. Quality assurance is a manual `TESTING_CHECKLIST.md` (~80 items). This is the single biggest health gap.
- **Code organization:** **8/10.** Genuinely clean — consistent naming, feature-grouped components, reusable Server Actions with uniform `ActionResult<T>` returns, strict TypeScript (essentially no `any`), centralized constants/plans/dates. Loses points only for the missing tests and the schema-not-in-repo issue below.
- **Dependencies:** 23 runtime deps, all current and mainstream. Nothing abandoned or risky. `shadcn` is listed as a runtime dependency (line 30 of `package.json`) — it's a CLI/devtool and arguably belongs in devDependencies, but it's harmless. `@base-ui/react` is in active use (shadcn's underlying primitives).
- **Secrets:** **Clean.** `.env*` is gitignored; no `.env` files are tracked in git. The Supabase service-role key is read **only** in the LemonSqueezy webhook handler (server-only, never `NEXT_PUBLIC_`). The only hardcoded values are non-secret LemonSqueezy store/variant IDs (`366692`, `1634640`, `1634662`) in `src/lib/lemonsqueezy.ts` — fine to commit.
- **Build status:** `npx tsc --noEmit` → **clean (exit 0).** `next build` is documented as clean at 25 routes. `npm run lint` → **2 pre-existing errors**: one unescaped apostrophe in `landing/problem.tsx`, one intentional `setState`-in-effect in `animate-on-scroll.tsx` (a deliberate mounted-safe pattern that the new React 19 lint rule flags). Neither breaks the build but `npm run lint` exits non-zero.

**Top 5 technical-debt items:**
1. **No automated tests** — a payment webhook, money math, and tax-reserve logic with zero regression safety net.
2. **Database schema is not in the repo.** Tables, RLS policies, indexes, and several `ALTER TABLE` migrations (`users.plan` CHECK constraint, `welcome_email_sent` column) exist only as copy-paste SQL blocks inside `STATUS.md`. There is no `supabase/migrations/` directory. A fresh environment cannot be reproduced from the codebase alone, and forgetting one of these `ALTER`s causes **silent failures** (e.g. the webhook fails to set `plan='lifetime'`).
3. **Hardcoded checkout success URL.** `getCheckoutUrl` sends users to `https://freeledger.dev/dashboard?upgraded=true` regardless of environment, so a local test checkout bounces to production.
4. **No server-side validation library.** Input parsing in Server Actions is hand-rolled per action; STATUS itself recommends Zod. Money fields rely on `Number(...) || 0` coercion.
5. **Documentation drift.** `STATUS.md` describes `/api/checkout` redirecting unauthenticated users to `/login`; the actual code returns a 401 JSON. Minor, but a sign STATUS is a narrative log rather than a maintained spec.

---

## Section 3: What's Missing

### 3a. Incomplete Features

| Feature | What exists | What's missing | Effort |
|---|---|---|---|
| Delete account (danger zone) | UI placeholder, disabled | Actual account+data deletion Server Action, confirmation, Supabase auth user removal | 4–6 h |
| Forgot/reset password | Nothing | Supabase reset-password flow + UI | 3–4 h |
| CSV export gating | Works but open to Free | Flip `PLANS.free.canExportCSV = false` + add 402 guard in 3 Route Handlers | 1 h |
| LemonSqueezy customer portal | Webhook updates plan | Persist `customer_id`/`variant_id` (column doesn't exist yet); wire "manage/cancel subscription" link | 4–6 h |
| Trend chart date range | Fixed last-6-calendar-months | Honor the month picker / add a date-range picker | 4–8 h |
| Avatar in sidebar | Layout supports `avatar_url` | Confirm `handle_new_user` trigger populates it from Google | 1–2 h |

### 3b. Critical Gaps

- **Error handling / edge cases:** Solid for a solo build — Server Actions return typed errors surfaced as toasts; dashboard error boundary exists. But there's no centralized logging/observability beyond `console.error`.
- **Loading / empty states:** ✅ Genuinely well covered (per-route skeletons, empty dashboards, no-match states).
- **Offline support:** N/A (web app, not expected).
- **Analytics:** Partial — Vercel Analytics is installed, but STATUS flags that funnel events (paywall views, upgrade clicks) are **not** instrumented. No product analytics (PostHog/etc.).
- **Crash reporting:** ❌ None (no Sentry or equivalent).
- **CI/CD:** ❌ No `.github/workflows`. Deploy is presumably Vercel's git integration; there's no automated lint/typecheck/test gate.
- **App store metadata:** N/A (web).
- **Privacy / terms:** ✅ Present.
- **Onboarding:** ✅ Built (3-step wizard).
- **Monetization infra:** ✅ Built and wired to real LemonSqueezy — ahead of most MVPs.

---

## Section 4: Business Viability Analysis

### 4a. The Problem & Market

- **Problem:** Freelancers paid irregularly by multiple clients can't easily answer "how much of my balance is actually mine to spend after taxes and expenses?" Generic accounting tools either over-complicate this or don't model the freelancer's mental question (real spendable money, tax set-aside, client concentration).
- **Who has it:** Solo freelancers and independent contractors — designers, developers, writers, consultants — especially in markets without simple, localized tools. The onboarding's country/currency/tax-rate setup (20 countries, Colombia-first legal framing) signals a LATAM/international-friendly positioning rather than US-only.
- **How they solve it today:** Spreadsheets (the dominant "competitor"), generic accounting apps (QuickBooks/Wave/FreshBooks), bank balances + mental math, or nothing.
- **Painkiller or vitamin:** **Mild painkiller.** The tax-reserve and "real money" framing addresses genuine anxiety, but most freelancers tolerate spreadsheets, so switching cost/inertia is the enemy. It's closer to a painkiller than a pure vitamin, but not an urgent must-have.
- **Market size signal:** **Mid-market, crowded.** Freelance finance is a large audience but a well-served category; differentiation has to come from simplicity and localization, not novelty.

### 4b. Monetization

- **Built:** ✅ Three tiers — Free ($0), Pro ($9/mo), Lifetime ($69 one-time, "first 200"). Real LemonSqueezy checkout, webhook-driven plan provisioning, server-enforced free limits (3 clients / 30 transactions per month), upgrade prompts at the limit and at 80%. This is a complete, working freemium funnel.
- **Free/freemium angle:** ✅ Yes — generous-enough free tier to try, hard caps that bite for active users.
- **Realistic willingness to pay:** $9/mo is in line with the category but on the higher side for a single-purpose tracker competing with free spreadsheets. The **$69 Lifetime** is the more compelling wedge for this audience and launch context (Product Hunt early adopters love lifetime deals) — it converts price-sensitive freelancers who'd never start a subscription.

### 4c. Competitive Landscape

| Product | Roughly charges | How they differ |
|---|---|---|
| Spreadsheets (Excel/Google Sheets) | Free | Infinitely flexible, zero opinionated structure, no tax-reserve logic. The real default. |
| Wave | Free (+ paid payroll/payments) | Full accounting/invoicing; heavier, US/Canada-centric. |
| QuickBooks Self-Employed | ~$15–20/mo | Mature, mileage/tax features, but complex and pricey for the casual freelancer. |
| FreshBooks | ~$17+/mo | Invoicing-first, broader SMB focus. |
| Bonsai / Hectic / indie freelancer tools | $0–25/mo | All-in-one freelancer suites (contracts, invoicing, time). |

- **Potential unfair advantage:** **Not yet established.** The honest read: the differentiation is (a) radical simplicity around one number ("real money"), (b) the tax-reserve framing, and (c) international/multi-currency, multi-country onboarding that the US incumbents under-serve. None of these is a moat — they're a positioning. The localization angle (Colombia/LATAM) is the most defensible if leaned into hard.

### 4d. Distribution

- **Discovery:** Built for organic/content + launch-driven discovery. There's a **blog with 4 SEO-targeted posts** ("best finance app for freelancers", "how much to save for taxes", etc.), RSS, sitemap, and OG images — a real content-marketing foundation. Product Hunt launch is in motion (recent commits).
- **App-store dependence:** None — it's a web app, so distribution is fully owner-controlled (SEO, social, PH, communities).
- **Viral/sharing mechanics:** Blog has share buttons; otherwise none built-in (no referrals, no shareable artifacts).
- **Network effects:** None required — it's single-player and works for one user on day one. Good (no cold-start problem) and bad (no viral loop).

---

## Section 5: Effort Estimation

### 5a. To Reach MVP (a stranger can sign up and use it)
The product is **already at MVP** functionally. Remaining hardening to call it launch-safe for strangers:

| Task | Hours |
|---|---|
| Commit DB schema as versioned migrations (`supabase/migrations/`) + verify all `ALTER`s applied in prod | 4 |
| Run pending production setup (Vercel env vars, DNS for Resend, Supabase URLs, Google OAuth origins) | 3 |
| Forgot-password flow | 4 |
| Fix the 2 lint errors + add CI (lint/typecheck gate) | 2 |
| Add crash reporting (Sentry) | 2 |
| Smoke tests for money math + webhook signature (even minimal Vitest) | 6 |
| Verify end-to-end checkout + email delivery in production | 3 |
| **Total to launch-safe MVP** | **~24 h** |

### 5b. To Reach Revenue (MVP + payment + distribution basics)
Payment is already built, so this is mostly the "turn it on safely" delta beyond 5a:

| Task | Hours |
|---|---|
| Gate CSV export behind Pro (flip flag + 402 guards) | 1 |
| LemonSqueezy test-mode → live-mode end-to-end verification (both Pro and Lifetime paths) | 3 |
| Persist `customer_id`/`variant_id` + cancellation/portal link | 5 |
| Instrument funnel analytics (paywall views, upgrade clicks, conversions) | 4 |
| Account-deletion flow (legal/trust requirement before charging) | 5 |
| **Additional beyond MVP** | **~18 h** → **~42 h total to first dollar** |

### 5c. Ongoing Maintenance
- **Weekly once live:** ~2–4 h (support emails, dependency bumps, occasional Supabase/LemonSqueezy/Next changes, blog content if pursuing SEO).
- **If untouched for 30 days:** Very little breaks — Vercel/Supabase are managed. Risks: a LemonSqueezy webhook schema change silently misclassifies a plan; a dependency security advisory goes unpatched; Resend DNS/domain reputation drifts. Nothing catastrophic, but webhook/payment regressions would be invisible without tests or monitoring.

---

## Section 6: Risk Assessment

1. **No tests around money & payments.** *Likely: high · Severe: high.* A refactor or dependency bump could silently break the real-money math, tax reserve, or webhook plan-provisioning, and nothing would catch it. **Mitigation:** add even a handful of Vitest unit tests for `getDashboardSummary`, the limit checks, and `verifySignature`.
2. **Schema lives only in STATUS.md.** *Likely: medium · Severe: high.* Reproducing prod from the repo is impossible; a forgotten `ALTER TABLE` causes silent plan-update failures. **Mitigation:** export the live schema into `supabase/migrations/` and commit it.
3. **No durable market differentiation.** *Likely: high · Severe: medium.* Competing with free spreadsheets and funded incumbents on a generic "freelancer finance" pitch is hard. **Mitigation:** lean hard into one wedge — localized tax-reserve for LATAM/international freelancers — rather than "finance dashboard for everyone."
4. **Solo-developer execution + scope.** *Likely: medium · Severe: medium.* The 10-"day" build cadence and rich STATUS log show strong momentum, but launch, support, and marketing on top of dev is a lot for one person. **Mitigation:** ship the Lifetime tier first to validate willingness-to-pay before investing in subscription retention.
5. **Payments-provider / platform dependency.** *Likely: low · Severe: medium.* LemonSqueezy (Merchant of Record) handles tax/compliance — a real asset — but a webhook contract change or account issue directly gates revenue, and there's no monitoring. **Mitigation:** add webhook delivery alerting + a manual "set plan" admin fallback.

---

## Section 7: Honest Verdict

### Strengths (top 3)
1. **Genuinely complete, clean product loop.** Auth → onboarding → track → visualize → paywall → real payment → provisioning → transactional email is all built and coherent, with strict TypeScript and a tidy architecture. This is far past "prototype."
2. **Monetization is real, not mocked.** Server-enforced limits, working LemonSqueezy checkout, signature-verified webhook, send-once email guards. Most "MVPs" fake this; FreeLedger doesn't.
3. **Sharp product framing + marketing foundation.** The single "real money" number, tax-reserve, and client-concentration alerts are a focused, anxiety-reducing pitch — and there's already a blog, SEO plumbing, and OG images to drive organic discovery.

### Weaknesses (top 3)
1. **Zero automated tests** around money and payments — the riskiest possible place to have none.
2. **Database schema isn't in the repo** — environment reproducibility and silent-failure risk.
3. **No defensible moat** — competes against free spreadsheets and funded incumbents; differentiation is positioning, not technology.

### The One Question That Matters
> Could this generate $1,000/month within 6 months of launch, one part-time developer?

**Maybe (leaning yes-but-modest).** The product is built, payments work, and the $69 Lifetime tier is well-matched to a Product Hunt / indie launch — selling ~15 Lifetimes plus a handful of Pro subscriptions clears $1k in a single good launch month, and the bar is "reach $1k," not "sustain it." The real risk isn't the code (it's ready); it's distribution and retention in a crowded category with a free-spreadsheet default. If the owner leans into the localized/tax-reserve wedge and treats the blog + launch seriously, $1k/mo is realistically achievable; sustaining it past month one is the harder, unproven part.

---

*Items that could not be determined from code and need founder input: actual production deploy status (which manual setup steps are done), live vs. test LemonSqueezy mode, current waitlist/registered-user counts, and whether the Resend domain DNS is verified.*
