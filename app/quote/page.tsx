"use client";

import { useState } from "react";

type QuoteResult = {
  id: string;
  quoted_amount: number;
  distance_miles: number;
};

export default function QuotePage() {
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    pickup_address: "",
    dropoff_address: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
      }
    } catch {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }

  const whatsappText = encodeURIComponent(
    `Hello M60 Recovery & Rescue, I would like help.
Name: ${form.customer_name}
Phone: ${form.customer_phone}
Pickup: ${form.pickup_address}
Drop-off: ${form.dropoff_address}
Quote: £${result?.quoted_amount ?? ""}`
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-semibold">Get your quote</h1>
        <p className="mt-3 text-slate-300">
          Fill in the details below to get a quote.
        </p>

        <div className="mt-8 space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900 p-3 text-white"
            placeholder="Full name"
            value={form.customer_name}
            onChange={(e) =>
              setForm({ ...form, customer_name: e.target.value })
            }
          />

          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900 p-3 text-white"
            placeholder="Phone number"
            value={form.customer_phone}
            onChange={(e) =>
              setForm({ ...form, customer_phone: e.target.value })
            }
          />

          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900 p-3 text-white"
            placeholder="Pickup address"
            value={form.pickup_address}
            onChange={(e) =>
              setForm({ ...form, pickup_address: e.target.value })
            }
          />

          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900 p-3 text-white"
            placeholder="Drop-off address"
            value={form.dropoff_address}
            onChange={(e) =>
              setForm({ ...form, dropoff_address: e.target.value })
            }
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-medium text-white hover:bg-orange-400 disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Calculate quote"}
          </button>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
              {error}
            </div>
          )}

          {result && (
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
              <p>Distance: {result.distance_miles} miles</p>
              <p className="mt-2 text-2xl font-semibold">
                Quote: £{result.quoted_amount}
              </p>

              <a
                href={`https://wa.me/44790883117?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-2xl bg-white px-4 py-3 font-medium text-slate-950"
              >
                Send to WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}