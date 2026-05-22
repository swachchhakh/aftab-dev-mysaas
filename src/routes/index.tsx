import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  ArrowRight,
  Database,
  Globe,
  Lock,
  Mail,
  Server,
  Zap,
  CreditCard,
  Workflow,
  ChevronRight,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

const TECH_STACK = [
  {
    category: 'Frontend',
    color: 'bg-blue-50 border-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    items: [
      { name: 'TanStack Start', desc: 'Full-stack React framework with SSR + file-based routing' },
      { name: 'TanStack Router', desc: 'Type-safe routing with loaders and search params' },
      { name: 'TanStack Query', desc: 'Async state management for server data' },
      { name: 'Tailwind CSS + shadcn/ui', desc: 'Utility-first styling with pre-built components' },
    ],
  },
  {
    category: 'Backend',
    color: 'bg-violet-50 border-violet-100 text-violet-700',
    dot: 'bg-violet-500',
    items: [
      { name: 'Elysia', desc: 'TypeScript-first API framework embedded inside TanStack Start' },
      { name: 'Eden Treaty', desc: 'End-to-end type-safe API client — no code generation' },
      { name: 'Drizzle ORM', desc: 'Type-safe SQL query builder for PostgreSQL' },
      { name: 'Neon', desc: 'Serverless Postgres — scales to zero, deploys globally' },
    ],
  },
  {
    category: 'Auth & Payments',
    color: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    items: [
      { name: 'Better Auth', desc: 'GitHub OAuth with sessions, accounts, and verifications' },
      { name: 'Stripe', desc: 'Checkout sessions, webhooks, and refund handling' },
      { name: 'Inngest', desc: 'Durable background jobs triggered by Stripe events' },
      { name: 'Resend + React Email', desc: 'Transactional emails — purchase, refund, password reset' },
    ],
  },
]

const ARCHITECTURE = [
  {
    step: '01',
    icon: <Globe className="w-5 h-5" />,
    title: 'User visits the app',
    desc: 'TanStack Start serves the page with SSR. Loaders fetch session and purchase status server-side before rendering.',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    step: '02',
    icon: <Lock className="w-5 h-5" />,
    title: 'GitHub OAuth login',
    desc: 'Better Auth handles the OAuth flow. Session, account, and user rows are created in Neon via Drizzle.',
    color: 'text-violet-600 bg-violet-50 border-violet-100',
  },
  {
    step: '03',
    icon: <CreditCard className="w-5 h-5" />,
    title: 'Stripe Checkout',
    desc: 'Frontend calls POST /api/payments/checkout. Elysia creates a Stripe session and returns the hosted checkout URL.',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
  {
    step: '04',
    icon: <Database className="w-5 h-5" />,
    title: 'Purchase claimed',
    desc: 'After payment, Stripe redirects to /dashboard?session_id=xxx. The app calls /api/purchases/claim, verifies with Stripe, and inserts the purchase row.',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    step: '05',
    icon: <Workflow className="w-5 h-5" />,
    title: 'Inngest background job',
    desc: 'The claim route fires a purchase/completed event. Inngest picks it up and runs the job asynchronously — no blocking the API.',
    color: 'text-rose-600 bg-rose-50 border-rose-100',
  },
  {
    step: '06',
    icon: <Mail className="w-5 h-5" />,
    title: 'Email sent via Resend',
    desc: 'The Inngest function looks up the user and purchase, then calls Resend with a React Email template. Purchase confirmation lands in the inbox.',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  },
]

function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-zinc-900 tracking-tight">MySaaS</span>
       
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16">

        {/* Hero */}
        <section className="text-center space-y-4">
          <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-200">
            Full-stack SaaS Starter
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Built with the modern TypeScript stack
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
            A production-ready SaaS foundation with authentication, payments, background jobs,
            and transactional emails — fully type-safe from database to UI.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="flex items-center gap-2 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              View pricing
            </Link>
          </div>
        </section>

        <Separator />

        {/* Tech stack */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-1">Tech stack</h2>
            <p className="text-sm text-zinc-500">Every layer is type-safe. No code generation required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {TECH_STACK.map((group) => (
              <Card key={group.category} className="border-zinc-200 shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${group.dot}`} />
                    <CardTitle className="text-sm font-medium text-zinc-900">
                      {group.category}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.name}>
                      <p className="text-xs font-semibold text-zinc-800">{item.name}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Architecture flow */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-1">How it works</h2>
            <p className="text-sm text-zinc-500">End-to-end flow from first visit to email confirmation.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {ARCHITECTURE.map((step, i) => (
              <Card key={step.step} className="border-zinc-200 shadow-none">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${step.color}`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-zinc-300">{step.step}</span>
                        <p className="text-sm font-semibold text-zinc-900">{step.title}</p>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  {i < ARCHITECTURE.length - 1 && i % 2 === 0 && (
                    <div className="hidden" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Data flow diagram */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-1">Data flow</h2>
            <p className="text-sm text-zinc-500">How the layers connect.</p>
          </div>

          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-col gap-0">
                {[
                  { label: 'Browser', sub: 'TanStack Router + Query + shadcn/ui', icon: <Globe className="w-4 h-4" />, color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  { label: 'API Layer', sub: 'Elysia (embedded) — /api/* routes', icon: <Server className="w-4 h-4" />, color: 'bg-violet-50 border-violet-200 text-violet-700' },
                  { label: 'Database', sub: 'Drizzle ORM → Neon PostgreSQL', icon: <Database className="w-4 h-4" />, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                  { label: 'Background Jobs', sub: 'Inngest → Resend email delivery', icon: <Zap className="w-4 h-4" />, color: 'bg-amber-50 border-amber-200 text-amber-700' },
                ].map((row, i, arr) => (
                  <div key={row.label} className="flex flex-col items-center">
                    <div className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 ${row.color}`}>
                      {row.icon}
                      <div>
                        <p className="text-sm font-semibold">{row.label}</p>
                        <p className="text-xs opacity-70">{row.sub}</p>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex flex-col items-center my-1">
                        <div className="w-px h-3 bg-zinc-300" />
                        <ChevronRight className="w-3 h-3 text-zinc-300 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Type safety callout */}
        <section>
          <Card className="border-zinc-200 shadow-none bg-zinc-900 text-white">
            <CardContent className="p-8 text-center space-y-3">
              <h2 className="text-xl font-semibold">End-to-end type safety</h2>
              <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
                Types flow from your Drizzle schema → Elysia route handlers → Eden Treaty client →
                React components. Change a field in the DB schema and TypeScript catches every
                affected line — no code generation, no manual syncing.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                {['Drizzle schema', '→', 'Elysia routes', '→', 'Eden Treaty', '→', 'React UI'].map((item, i) => (
                  item === '→'
                    ? <span key={i} className="text-zinc-600 text-sm">{item}</span>
                    : <Badge key={i} variant="outline" className="border-zinc-700 text-zinc-300 text-xs">{item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

      </main>

      <footer className="border-t border-zinc-200 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-900">MySaaS</span>
          <p className="text-xs text-zinc-400">Built with TanStack Start · Elysia · Neon · Stripe · Inngest · Resend</p>
        </div>
      </footer>
    </div>
  )
}