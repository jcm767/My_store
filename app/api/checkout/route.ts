import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

export const runtime = "nodejs";        // Use Node (not Edge) so Stripe SDK works
export const dynamic = "force-dynamic"; // Always run on server

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

// Safe to construct with empty string; we guard above before using it
const stripe = new Stripe(STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
    console.error("Missing STRIPE envs", {
      hasKey: !!STRIPE_SECRET_KEY,
      hasPrice: !!STRIPE_PRICE_ID,
    });
    return new NextResponse("Server misconfigured: STRIPE envs missing", { status: 500 });
  }

  try {
    const hdrs = headers();
    const origin = hdrs.get("origin") ?? new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=1`,
    });

    if (!session.url) {
      console.error("Stripe session missing URL", session);
      return new NextResponse("Failed to create checkout session", { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    // Surface Stripe messages for quick diagnosis (e.g. “Invalid API Key provided”)
    return new NextResponse(err?.message ?? "Checkout error", { status: 500 });
  }
}

// Tiny diagnostics endpoint so you never have to guess if envs are present
export async function GET() {
  return NextResponse.json({
    ok: !!STRIPE_SECRET_KEY && !!STRIPE_PRICE_ID,
    hasKey: !!STRIPE_SECRET_KEY,
    hasPrice: !!STRIPE_PRICE_ID,
  });
}
