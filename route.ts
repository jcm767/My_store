import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const { priceId } = await req.json().catch(() => ({}))
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Missing x-user-id' }, { status: 401 })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId || process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    client_reference_id: userId,
    metadata: { source: 'supabase-store' }
  })

  return NextResponse.json({ url: session.url })
}
