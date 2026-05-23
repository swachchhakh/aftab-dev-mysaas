import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { useCheckout } from "@/hooks/use-checkout";
import { PLANS } from "@/config/plans";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const FREE_FEATURES = [
  "Up to 3 projects",
  "Basic analytics",
  "Community support",
  "1 GB storage",
];

const PRO_FEATURES = [
  "Unlimited projects",
  "Advanced analytics",
  "Priority support",
  "100 GB storage",
  "Background job processing",
  "Custom integrations",
  "Team collaboration",
];

export default function PricingPage() {
  const checkout = useCheckout();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg tracking-tight text-zinc-900">
            MySaaS
          </Link>
          <Link
            to="/login"
            className="text-sm bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-zinc-500 text-lg max-w-md mx-auto">
            Start for free, upgrade when you're ready. No hidden fees.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl border border-zinc-200 p-8 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-medium text-zinc-500 mb-1">Free</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-zinc-900">$0</span>
                <span className="text-zinc-400 text-sm">/month</span>
              </div>
              <p className="text-sm text-zinc-500 mt-2">Perfect for side projects.</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-700">
                  <CheckCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to="/login"
              className="block text-center border border-zinc-200 rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Get started for free
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-zinc-900 bg-zinc-900 p-8 flex flex-col relative overflow-hidden">
            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className="text-xs font-medium bg-white/10 text-white px-2.5 py-1 rounded-full">
                Most popular
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-zinc-400 mb-1">Pro</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-white">$249</span>
                <span className="text-zinc-400 text-sm">/one-time</span>
              </div>
              <p className="text-sm text-zinc-400 mt-2">Lifetime access, no subscriptions.</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/90">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
             onClick={() => checkout.mutate(PLANS.pro_lifetime.priceId)}
              disabled={checkout.isPending}
              className="w-full bg-white text-zinc-900 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-zinc-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {checkout.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-800 rounded-full animate-spin" />
                  Redirecting…
                </>
              ) : (
                "Upgrade to Pro"
              )}
            </button>

            {checkout.isError && (
              <p className="text-xs text-red-400 text-center mt-3">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-zinc-900 mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Do I need a credit card to sign up?",
                a: "No. The free plan requires no credit card. You only need one when upgrading to Pro.",
              },
              {
                q: "Is the Pro plan really one-time?",
                a: "Yes — pay once, use forever. No recurring fees, no surprise charges.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We use Stripe Checkout, which supports all major credit and debit cards.",
              },
              {
                q: "Can I get a refund?",
                a: "Yes, within 14 days of purchase if you're not satisfied. Just reach out.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-zinc-100 pb-6">
                <p className="font-medium text-zinc-900 mb-2">{item.q}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}