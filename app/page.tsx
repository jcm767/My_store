import BuyButton from '../components/BuyButton'

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>My Store</h1>
      <p>Click below to checkout with Stripe:</p>
      <BuyButton />
    </main>
  )
}
