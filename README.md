# Craft MySaaS

A production-ready full-stack SaaS starter built with a modern, fully type-safe TypeScript stack. Covers authentication, payments, background jobs, and transactional emails — deployed to Vercel with a serverless Postgres database on Neon.

Live demo: [aftab-dev-mysaas.vercel.app](https://aftab-dev-mysaas.vercel.app)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (SSR + file-based routing) |
| API | Elysia (embedded, mounted at `/api/*`) |
| API client | Eden Treaty (end-to-end type safety) |
| Database | Neon (serverless PostgreSQL) |
| ORM | Drizzle ORM |
| Auth | Better Auth (GitHub OAuth) |
| Payments | Stripe Checkout + Webhooks |
| Background jobs | Inngest |
| Email | Resend + React Email |
| UI | shadcn/ui + Tailwind CSS |
| Deployment | Vercel |

---

## Features

- GitHub OAuth login with session management and protected routes
- Stripe Checkout with one-time and subscription pricing
- Purchase verification via Stripe webhook signature validation
- Refund handling with automatic plan downgrade
- Durable background jobs via Inngest with automatic retries
- Transactional emails — purchase confirmation, refund notification, password reset
- End-to-end TypeScript inference from DB schema to React components
- Server-side rendering with session-aware route loaders

---

## Project structure

```text
src/
  routes/
    index.tsx                     # Landing page
    login.tsx                     # GitHub OAuth login
    pricing.tsx                   # Pricing page
    _authenticated.tsx            # Sidebar layout (protected)
    _authenticated/
      dashboard.tsx               # Main dashboard
      billing.tsx                 # Plan management
      settings.tsx                # Profile settings
  server/
    api.ts                        # Elysia API routes
    routes/
      purchases.ts                # Purchase routes
  lib/
    auth.ts                       # Better Auth config
    auth/client.ts                # Better Auth client
    db.ts                         # Drizzle + Neon setup
    payments.ts                   # Stripe helpers
    jobs.ts                       # Inngest functions
    email.ts                      # Resend client
    send-email.ts                 # Email sending helpers
    treaty.ts                     # Eden Treaty client
  hooks/
    use-checkout.ts
    use-claim-purchase.ts
    use-purchase-status.ts
    use-update-profile.ts
  emails/
    purchase-confirmation.tsx
    refund-confirmation.tsx
    password-reset.tsx
  config/
    plans.ts                      # Stripe price config
```

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh)
- [Neon](https://neon.tech) account
- [Stripe](https://stripe.com) account
- [Better Auth](https://better-auth.com) secret
- [Resend](https://resend.com) account
- [Inngest](https://inngest.com) account
- GitHub OAuth app

### Installation

```bash
git clone https://github.com/yourusername/my-saas.git
cd my-saas
bun install
```

### Environment variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL=postgres://postgres:postgres@db.localtest.me:5432/my_saas
NEON_PROXY_URL=http://localhost:4444

# Auth
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx

# Inngest
INNGEST_EVENT_KEY=local

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=onboarding@resend.dev

# App
PUBLIC_URL=http://localhost:3000
```

### Database setup

```bash
bun db:push
```

### Development

Run the app and Inngest dev server in separate terminals:

```bash
# Terminal 1 — app
bun dev

# Terminal 2 — Inngest
npx --ignore-scripts=false inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

App runs at `http://localhost:3000`. Inngest dashboard at `http://localhost:8288`.

---

## Database schema

```
users          — created by Better Auth on first login
sessions       — managed by Better Auth
accounts       — links users to OAuth providers
verifications  — used for OAuth state and email verification
purchases      — inserted after successful Stripe payment
```

---

## Payment flow

1. User clicks upgrade on `/pricing` or `/billing`
2. Frontend calls `POST /api/payments/checkout` with a `priceId`
3. Elysia creates a Stripe Checkout session and returns the hosted URL
4. Browser redirects to Stripe — user pays
5. Stripe redirects back to `/dashboard?purchase=success&session_id=xxx`
6. Dashboard calls `POST /api/purchases/claim` — verifies with Stripe, inserts purchase row, fires Inngest event
7. Inngest sends purchase confirmation email via Resend
8. Stripe also fires a `checkout.session.completed` webhook as the reliable parallel path

---

## Deployment

### Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add all environment variables under **Settings → Environment Variables**
4. Update `BETTER_AUTH_URL` and `PUBLIC_URL` to your Vercel domain
5. Update your GitHub OAuth app callback URL to `https://your-app.vercel.app/api/auth/callback/github`
6. Add your Stripe webhook endpoint `https://your-app.vercel.app/api/payments/webhook`
7. Sync your Inngest app at `https://your-app.vercel.app/api/inngest`

### Run migrations against production

```bash
DATABASE_URL="your_neon_production_url" bun db:push
```

---

## Scripts

```bash
bun dev          # start dev server
bun build        # production build
bun db:push      # push schema to database
bun db:generate  # generate migrations
bun db:migrate   # run migrations
bun db:studio    # open Drizzle Studio
```

---

## License

AFTAB MIRAJ SWACHCHHA
