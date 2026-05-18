import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Zap,
} from "lucide-react";
import { api } from "@/lib/treaty";
import { useCheckout } from "@/hooks/use-checkout";
import { PLANS } from "@/config/plans";

export const Route = createFileRoute("/_authenticated/billing")({
  loader: async () => {
    const { data } = await api.api.payments.status.get();
    return { purchase: data?.purchase ?? null };
  },
  component: BillingPage,
});

const PLAN_LIST = Object.entries(PLANS).map(([key, plan]) => ({
  key,
  ...plan,
}));

const FREE_FEATURES = [
  "Up to 3 projects",
  "1 GB storage",
  "Basic analytics",
  "Community support",
];

const PRO_FEATURES = [
  "Unlimited projects",
  "100 GB storage",
  "Advanced analytics",
  "Priority support",
  "Background jobs",
  "Team collaboration",
];

export default function BillingPage() {
  const { purchase } = Route.useLoaderData();
  const isPro = !!purchase && purchase.status === "completed";
  const checkout = useCheckout();

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Billing</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your plan and payment details.
        </p>
      </div>

      {/* Current plan */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-4">
          Current plan
        </h2>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-semibold text-zinc-900">
                {isPro ? "Pro" : "Free"}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${
                  isPro
                    ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                    : "text-zinc-500 bg-zinc-50 border-zinc-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPro ? "bg-emerald-500" : "bg-zinc-400"
                  }`}
                />
                {isPro ? "Active" : "Free tier"}
              </span>
            </div>
            <p className="text-sm text-zinc-500">
              {isPro
                ? "Lifetime access — no renewals, no expiry."
                : "Limited to 3 projects and 1 GB storage."}
            </p>
          </div>

          {isPro && purchase && (
            <div className="text-right shrink-0">
              <p className="text-xs text-zinc-400 mb-0.5">Amount paid</p>
              <p className="text-sm font-semibold text-zinc-900">
                ${(purchase.amount / 100).toFixed(2)}{" "}
                {purchase.currency.toUpperCase()}
              </p>
            </div>
          )}
        </div>

        {/* Purchase details if pro */}
        {isPro && purchase && (
          <div className="mt-5 pt-5 border-t border-zinc-100 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-zinc-400 mb-1">Purchase date</p>
              <p className="text-sm font-medium text-zinc-900">
                {new Date(purchase.purchasedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">Plan</p>
              <p className="text-sm font-medium text-zinc-900 capitalize">
                {purchase.tier}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">Status</p>
              <p className="text-sm font-medium text-emerald-600 capitalize">
                {purchase.status.replace("_", " ")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade section — only shown if not pro */}
      {!isPro && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-medium text-zinc-900">Upgrade to Pro</h2>
          </div>
          <p className="text-sm text-zinc-500 mb-6">
            Choose the plan that works for you. All Pro plans include the same
            features.
          </p>

          {/* Plan cards */}
          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {PLAN_LIST.map((plan) => (
              <button
                key={plan.key}
                onClick={() => checkout.mutate(plan.priceId)}
                disabled={checkout.isPending}
                className="group relative flex flex-col items-start p-4 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-left"
              >
                {plan.key === "pro_yearly" && (
                  <span className="absolute -top-2.5 left-3 text-xs font-medium bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                    Best value
                  </span>
                )}
                <p className="text-sm font-medium text-zinc-900 mb-0.5">
                  {plan.label}
                </p>
                <p className="text-lg font-semibold text-zinc-900 mb-3">
                  {plan.price}
                </p>
                <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors flex items-center gap-1">
                  {checkout.isPending ? (
                    <>
                      <span className="w-3 h-3 border border-zinc-400 border-t-zinc-800 rounded-full animate-spin" />
                      Redirecting…
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3 h-3" /> Select plan
                    </>
                  )}
                </span>
              </button>
            ))}
          </div>

          {checkout.isError && (
            <p className="text-xs text-red-500 mb-4">
              Something went wrong. Please try again.
            </p>
          )}

          {/* Feature comparison */}
          <div className="grid sm:grid-cols-2 gap-4 pt-5 border-t border-zinc-100">
            <div className="rounded-lg border border-zinc-100 p-4">
              <p className="text-xs font-medium text-zinc-500 mb-3">Free</p>
              <ul className="space-y-2">
                {FREE_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-zinc-500"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border-2 border-zinc-900 bg-zinc-50 p-4">
              <p className="text-xs font-medium text-zinc-900 mb-3">Pro</p>
              <ul className="space-y-2">
                {PRO_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-zinc-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Pro features summary — only shown if pro */}
      {isPro && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-zinc-900 mb-4">
            Your Pro features
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {PRO_FEATURES.map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-sm text-zinc-700"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="text-sm font-medium text-zinc-900 mb-2">Need help?</h2>
        <p className="text-sm text-zinc-500 mb-4">
          For billing questions or refund requests, contact our support team.
        </p>
        <a
          href="mailto:support@mysaas.app"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Contact support <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}