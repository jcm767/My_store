'use client'
import BuyButton from '@/components/BuyButton'

export default function Home() {
  const demoUserId = '00000000-0000-0000-0000-000000000000' // replace with real user id later
  return (
    <main style={{ padding: 24 }}>
      <h1>My Store</h1>
      <p>Demo product. Click buy to test Stripe Checkout.</p>
      <BuyButton userId={demoUserId} />
      <p style={{marginTop:16}}><a href="/success">See recent orders</a></p>
    </main>
  )
}
