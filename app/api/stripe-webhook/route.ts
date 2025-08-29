import Stripe from 'stripe'
import supabaseAdmin from '../../lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  const body = await req.text()

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const amount = (session.amount_total ?? 0) / 100
    await supabaseAdmin.rpc('stripe_upsert_paid', {
      session_id: session.id,
      payment_intent: session.payment_intent,
      amount,
      user_uuid: session.client_reference_id ?? null,
    })
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge
    const amount = (charge.amount_refunded ?? 0) / 100
    const session_id = charge.metadata?.session_id ?? null
    if (session_id) await supabaseAdmin.rpc('stripe_mark_refunded', { session_id, amount })
  }

  return new Response('ok', { status: 200 })
}
