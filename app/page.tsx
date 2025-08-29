import BuyButton from "@/components/BuyButton";

export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>My_store</h1>
      <p style={{ marginBottom: 16 }}>Click below to checkout with Stripe:</p>
      <BuyButton />
    </main>
  );
}
