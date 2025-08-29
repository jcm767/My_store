"use client";

import { useState } from "react";

export default function BuyButton() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Checkout failed (${res.status}): ${await res.text()}`);
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("Missing Stripe Checkout URL");
      window.location.assign(data.url);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Unknown error");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        style={{
          padding: "12px 18px",
          borderRadius: 8,
          border: "none",
          fontSize: 16,
          background: "#635bff",
          color: "white",
        }}
      >
        {loading ? "Redirecting…" : "Buy"}
      </button>
      {err && <p style={{ color: "crimson", marginTop: 12 }}>{err}</p>}
    </div>
  );
}
