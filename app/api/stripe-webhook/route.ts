import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const stripe = new Stripe(STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-06-20" });

function supabaseAdmin() {
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  console.warn("Supabase admin not configured — skipping DB writes.");
  return null;
}

export async function POST(req: Request) {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK (signing secret)");
    return new NextResponse("Server misconfigured: STRIPE_WEBHOOK missing", { status: 500 });
  }

  const sig = headers().get("stripe-signature");
  if (!sig) return new NextResponse("Missing Stripe signature header", { status: 400 });

  let event: Stripe.Event;
  try {
    // raw body required for signature verification
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message);
    return new NextResponse(`Signature error: ${err?.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const stripe_session_id = session.id;
        const amount_total = session.amount_total ?? null; // cents
        const currency = session.currency?.toUpperCase() ?? null;
        const email = session.customer_details?.email ?? null;

        console.log("checkout.session.completed", {
          stripe_session_id,
          amount_total,
          currency,
          email,
        });

        const sb = supabaseAdmin();
        if (sb) {
          const { error } = await sb.from("purchases").insert({
            stripe_session_id,
            amount_cents: amount_total,
            currency,
            email,
          });
          if (error) console.error("Supabase insert failed:", error);
        }
        break;
      }
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
