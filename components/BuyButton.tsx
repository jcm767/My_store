'use client'

export default function BuyButton() {
  const buy = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ quantity: 1 }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <button
      onClick={buy}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        background: '#635bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      Buy Now
    </button>
  )
}
