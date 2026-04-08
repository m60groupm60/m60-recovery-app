"use client";

import { useState } from "react";

export default function QuotePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const [distance, setDistance] = useState<number | null>(null);
  const [quote, setQuote] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDistance(null);
    setQuote(null);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          pickup_address: pickup,
          dropoff_address: dropoff,
        }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        setError(result.error || "Something went wrong");
        return;
      }

      setDistance(result.distance ?? null);
      setQuote(result.quote ?? null);
    } catch {
      setError("Could not connect to the quote service");
    } finally {
      setLoading(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hello M60 Recovery & Rescue, I would like a quote.
Name: ${name}
Phone: ${phone}
Pickup: ${pickup}
Drop-off: ${dropoff}
Distance: ${distance ?? ""}
Quote: £${quote ?? ""}`
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-[#081133] p-8 shadow-2xl md:p-12">
        <h1 className="text-5xl font-semibold tracking-tight">Get your quote</h1>
        <p className="mt-5 text-2xl text-slate-300">
          Fill in the details below to get a quote.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-7">
          <input
            className="w-full rounded-[28px] border border-white/10 bg-slate-200 px-6 py-6 text-2xl text-slate-950 outline-none"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded-[28px] border border-white/10 bg-slate-200 px-6 py-6 text-2xl text-slate-950 outline-none"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="w-full rounded-[28px] border border-white/10 bg-slate-200 px-6 py-6 text-2xl text-slate-950 outline-none"
            placeholder="Pickup address"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />

          <input
            className="w-full rounded-[28px] border border-white/10 bg-slate-200 px-6 py-6 text-2xl text-slate-950 outline-none"
            placeholder="Drop-off address"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[28px] bg-orange-500 px-6 py-6 text-2xl font-medium text-white transition hover:bg-orange-400 disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Calculate quote"}
          </button>
        </form>

        {error && (
          <div className="mt-8 rounded-[28px] border border-red-500/30 bg-red-500/10 p-6 text-2xl text-red-200">
            {error}
          </div>
        )}

        {distance !== null && quote !== null && (
          <div className="mt-8 rounded-[28px] border border-white/10 bg-[#071538] p-8">
            <p className="text-2xl text-white">Distance: {distance} miles</p>
            <p className="mt-5 text-5xl font-semibold text-white">Quote: £{quote}</p>

            <a
              href={`https://wa.me/447908831617?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-[24px] bg-white px-8 py-5 text-2xl font-medium text-slate-950"
            >
              Send to WhatsApp
            </a>
          </div>
        )}
      </div>
    </main>
  );
}