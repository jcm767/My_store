'use client'
export default function BuyButton({ priceId, userId }:{ priceId?: string; userId: string }) {
  const click = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
      body: JSON.stringify({ priceId })
    })
    const { url, error } = await res.json()
    if (error) return alert(error)
    window.location.href = url
  }
  return <button onClick={click} style={{ padding: '10px 16px', borderRadius: 8 }}>Buy Now</button>
}
