import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, purchases, users } from "@/lib/db";
import { purchasesRoute } from "./routes/purchases";
import { serve } from "inngest/edge";
import { inngest, functions } from "@/lib/jobs";
import { cors } from "@elysiajs/cors";
import {
  createOneTimeCheckoutSession,
  retrieveCheckoutSession,
  constructWebhookEvent,
} from "@/lib/payments"; 

const inngestHandler = serve({
  client: inngest,
  functions,
});

export const api = new Elysia({ prefix: "/api" })
  .onRequest(({ request }) => {
    console.log(`[API] ${request.method} ${request.url}`);
  })
  .onError(({ code, error, path }) => {
    console.error(`[API ERROR] ${code} on ${path}:`, error);
  })
  .use(cors({
    origin: true, 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }))
  .mount(auth.handler)
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .use(purchasesRoute)
  .all("/inngest", async (ctx) => {
    return inngestHandler(ctx.request);
  })
  .get("/me", async ({ request, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    return { user: session.user };
  })
  .patch(
    "/me",
    async ({ request, body, set }) => {
      const session = await auth.api.getSession({ headers: request.headers });

      if (!session) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const [updatedUser] = await db
        .update(users)
        .set({ name: body.name, updatedAt: new Date() })
        .where(eq(users.id, session.user.id))
        .returning();

      return { user: updatedUser };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
      }),
    }
  )
  .get("/payments/status", async ({ request, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const purchase = await db
      .select()
      .from(purchases)
      .where(eq(purchases.userId, session.user.id))
      .limit(1);

    return {
      userId: session.user.id,
      purchase: purchase[0] ?? null,
    };
  })
  .post("/payments/checkout", async ({ body , set }) => {
    const priceId = body?.priceId ?? process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      set.status = 500;
      return { error: "Price not configured" };
    }

    const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

    const checkoutSession = await createOneTimeCheckoutSession({
      priceId,
      successUrl: `${baseUrl}/dashboard?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: body?.cancelUrl ?? `${baseUrl}/pricing`, 
      metadata: { tier: "pro" },
    });

    return { url: checkoutSession.url };
  }, {
    body: t.Object({
      priceId: t.Optional(t.String()),
      cancelUrl: t.Optional(t.String()),
    })
  }
)
  .post("/payments/webhook", async ({ request, set }) => {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      set.status = 400;
      return { error: "Missing signature" };
    }

    try {
      const event = await constructWebhookEvent(body, sig);
      console.log(`[Webhook] Received ${event.type}`);

      if (event.type === "charge.refunded") {
        const charge = event.data.object as {
          id: string;
          payment_intent: string;
          amount: number;
          amount_refunded: number;
          currency: string;
        };

        await inngest.send({
          name: "stripe/charge.refunded",
          data: {
            chargeId: charge.id,
            paymentIntentId: charge.payment_intent,
            amountRefunded: charge.amount_refunded,
            originalAmount: charge.amount,
            currency: charge.currency,
          },
        });
      }

      return { received: true };
    } catch (error) {
      console.error("[Webhook] Stripe verification failed:", error);
      set.status = 400;
      return { error: "Webhook verification failed" };
    }
  })
  .post(
    "/purchases/claim",
    async ({ body, request, set }) => {
      const session = await auth.api.getSession({ headers: request.headers });

      if (!session) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const { sessionId } = body;

      const existing = await db
        .select()
        .from(purchases)
        .where(eq(purchases.stripeCheckoutSessionId, sessionId))
        .limit(1);

      if (existing[0]) {
        return { success: true, alreadyClaimed: true, tier: existing[0].tier };
      }

      const stripeSession = await retrieveCheckoutSession(sessionId);

      if (stripeSession.payment_status !== "paid") {
        set.status = 400;
        return { error: "Payment not completed" };
      }

      const tier = (stripeSession.metadata?.tier ?? "pro") as "pro";

      await db.insert(purchases).values({
        userId: session.user.id,
        stripeCheckoutSessionId: sessionId,
        stripeCustomerId:
          typeof stripeSession.customer === "string"
            ? stripeSession.customer
            : stripeSession.customer?.id ?? null,
        stripePaymentIntentId:
          typeof stripeSession.payment_intent === "string"
            ? stripeSession.payment_intent
            : stripeSession.payment_intent?.id ?? null,
        tier,
        status: "completed",
        amount: stripeSession.amount_total ?? 0,
        currency: stripeSession.currency ?? "usd",
      });

      await inngest.send({
        name: "purchase/completed",
        data: { userId: session.user.id, tier, sessionId },
      });

      return { success: true, tier };
    },
    {
      body: t.Object({
        sessionId: t.String(),
      }),
    }
  );

export type Api = typeof api;