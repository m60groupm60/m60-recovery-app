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

  const ukPostcodeRegex =
    /^([A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2})$/i;

  const handleSubmit = async () => {
    const pickupValue = pickup.trim().toUpperCase();
    const dropoffValue = dropoff.trim().toUpperCase();

    if (!pickupValue || !dropoffValue) {
      alert("Please enter both pickup and dropoff postcodes");
      return;
    }

    if (!ukPostcodeRegex.test(pickupValue)) {
      alert("Please enter a valid UK pickup postcode");
      return;
    }

    if (!ukPostcodeRegex.test(dropoffValue)) {
      alert("Please enter a valid UK dropoff postcode");
      return;
    }

    setLoading(true);
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
          pickup_address: pickupValue,
          dropoff_address: dropoffValue,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      setDistance(data.distance);
      setQuote(data.quote);
    } catch {
      alert("Something went wrong");
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_30%),linear-gradient(180deg,#020617_0%,#081133_55%,#020617_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">
              M60 Recovery & Rescue
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              Instant Manchester recovery quote
            </h2>
          </div>
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:block">
            24/7 Service
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
            <div className="inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
              Fast quote in seconds
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
              Get your quote
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Enter your details and two postcodes to get a live recovery quote.
            </p>

            <div className="mt-10 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full name
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-100 px-5 py-4 text-lg text-slate-950 placeholder:text-slate-500 outline-none transition focus:border-orange-400"
                  placeholder="Michael Dyson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Phone number
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-100 px-5 py-4 text-lg text-slate-950 placeholder:text-slate-500 outline-none transition focus:border-orange-400"
                  placeholder="07903 784424"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Pickup postcode
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-100 px-5 py-4 text-lg text-slate-950 placeholder:text-slate-500 outline-none transition focus:border-orange-400"
                  placeholder="Pickup postcode (e.g. M11 4JG)"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Drop-off postcode
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-100 px-5 py-4 text-lg text-slate-950 placeholder:text-slate-500 outline-none transition focus:border-orange-400"
                  placeholder="Dropoff postcode (e.g. OL10 2EF)"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-2xl bg-orange-500 px-6 py-5 text-xl font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Calculating..." : "Calculate quote"}
              </button>
            </div>
          </section>

          <aside className="rounded-[32px] border border-white/10 bg-[#071538] p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">
              Live result
            </p>
            <h3 className="mt-4 text-3xl font-semibold">Your recovery estimate</h3>
            <p className="mt-3 text-slate-300">
              Mileage and quote update after calculation.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Distance</p>
                <p className="mt-2 text-3xl font-semibold">
                  {distance !== null ? `${distance} miles` : "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-500 p-5 text-white">
                <p className="text-sm opacity-90">Estimated quote</p>
                <p className="mt-2 text-4xl font-semibold">
                  {quote !== null ? `£${quote}` : "—"}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              <p className="font-medium text-white">What happens next</p>
              <div className="mt-3 space-y-2">
                <p>1. Get your quote instantly</p>
                <p>2. Send details to WhatsApp</p>
                <p>3. We contact you to confirm the job</p>
              </div>
            </div>

            {distance !== null && quote !== null && (
              <a
                href={`https://wa.me/447908831617?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Send to WhatsApp
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}