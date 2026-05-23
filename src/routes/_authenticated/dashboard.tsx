import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Zap, CreditCard, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { api } from "@/lib/treaty";
import { useClaimPurchase } from "../../hooks/use-claim-purchase";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { db, purchases } from "@/lib/db";
import { eq } from "drizzle-orm";


const searchSchema = z.object({
  purchase: z.string().optional(),
  session_id: z.string().optional(),
});

const getPurchaseStatus = createServerFn().handler(async () => {
  const headers = new Headers(getRequestHeaders() as HeadersInit);
  const session = await auth.api.getSession({ headers });

  if (!session) return { purchase: null };

  const purchase = await db
    .select()
    .from(purchases)
    .where(eq(purchases.userId, session.user.id))
    .limit(1);

  return { purchase: purchase[0] ?? null };
});

export const Route = createFileRoute("/_authenticated/dashboard")({
  validateSearch: (search: Record<string, unknown>) => ({
    purchase: search.purchase as string | undefined,
    session_id: search.session_id as string | undefined,
  }),
  loader: async () => getPurchaseStatus(),
  component: DashboardPage,
});

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-semibold text-zinc-900">{value}</p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { purchase } = Route.useLoaderData();
  const { purchase: purchaseParam, session_id } = Route.useSearch();
  console.log("search params:", { purchaseParam, session_id }); 
  const navigate = useNavigate();
  const claimPurchase = useClaimPurchase();

  const isPro = !!purchase && purchase.status === "completed";
  const isSuccessRedirect = purchaseParam === "success" && !!session_id;

  useEffect(() => {
    if (isSuccessRedirect && session_id && !claimPurchase.isPending && !claimPurchase.isSuccess) {
      claimPurchase.mutate(
        { sessionId: session_id },
        {
          onSuccess: () => {
            window.location.href = "/dashboard";
          },
        }
      );
    }
  }, [session_id, isSuccessRedirect]);

  // Success overlay while claiming
  if (isSuccessRedirect) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="max-w-sm w-full text-center">
          {claimPurchase.isPending && (
            <>
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-7 h-7 text-zinc-400 animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-zinc-900 mb-2">
                Confirming your purchase…
              </h1>
              <p className="text-sm text-zinc-500">
                Just a moment while we verify your payment.
              </p>
            </>
          )}

          {claimPurchase.isError && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚠️</span>
              </div>
              <h1 className="text-xl font-semibold text-zinc-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-sm text-zinc-500 mb-6">
                We couldn't confirm your purchase. If you were charged, contact support.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => claimPurchase.mutate({ sessionId: session_id! })}
                  className="flex-1 border border-zinc-200 text-zinc-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Try again
                </button>
                <a
                  href="mailto:support@mysaas.app"
                  className="flex-1 bg-zinc-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors text-center"
                >
                  Contact support
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Welcome back. Here's an overview of your account.
        </p>
      </div>

      {/* Plan banner */}
      {!isPro && (
        <div className="mb-8 flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-indigo-900">You're on the Free plan</p>
              <p className="text-xs text-indigo-500 mt-0.5">
                Upgrade to Pro for unlimited projects and priority support.
              </p>
            </div>
          </div>
          <Link
            to="/pricing"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            Upgrade <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {isPro && (
        <div className="mb-8 flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-sm font-medium text-emerald-900">Pro plan active</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              You have access to all Pro features.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total projects"
          value={isPro ? "12" : "2 / 3"}
          sub={isPro ? "Unlimited on Pro" : "1 remaining on Free"}
        />
        <StatCard
          label="Storage used"
          value="840 MB"
          sub={isPro ? "of 100 GB" : "of 1 GB"}
        />
        <StatCard label="API calls" value="24,310" sub="This month" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <CreditCard className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-medium text-zinc-900">Billing</h2>
          </div>
          {isPro ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Plan</span>
                <span className="font-medium text-zinc-900 capitalize">{purchase.tier}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Active
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Amount paid</span>
                <span className="font-medium text-zinc-900">
                  ${(purchase.amount / 100).toFixed(2)} {purchase.currency.toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-zinc-500 mb-4">
                You're on the Free plan. Upgrade to unlock all features.
              </p>
              <Link
                to="/pricing"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View pricing <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <Clock className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-medium text-zinc-900">Recent activity</h2>
          </div>
          <ul className="space-y-3">
            {[
              { label: "Account created", time: "Just now" },
              { label: "GitHub login connected", time: "Just now" },
              ...(isPro ? [{ label: "Upgraded to Pro", time: "Recently" }] : []),
            ].map((item, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-zinc-700">{item.label}</span>
                <span className="text-zinc-400 text-xs">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}