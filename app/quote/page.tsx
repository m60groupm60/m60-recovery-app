"use client";

import { useEffect, useMemo, useState } from "react";

type ServiceType = {
  id: string;
  name: string;
  slug: string;
};

export default function QuotePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [services, setServices] = useState<ServiceType[]>([]);
  const [serviceType, setServiceType] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [quote, setQuote] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState("");
  const [outOfHours, setOutOfHours] = useState(false);

  const ukPostcodeRegex =
    /^([A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2})$/i;

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch("/api/service-types?active=true");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load services");
          return;
        }

        const loaded = data.services || [];
        setServices(loaded);

        if (loaded.length > 0) {
          setServiceType(loaded[0].slug);
        }
      } catch {
        setError("Failed to load services");
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  const selectedService = useMemo(() => {
    return services.find((s) => s.slug === serviceType) || null;
  }, [services, serviceType]);

  const isEmergency =
    selectedService?.slug?.toLowerCase().replace(/-/g, "_") ===
    "emergency_breakdown";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pickupValue = pickup.trim().toUpperCase();
    const dropoffValue = dropoff.trim().toUpperCase();

    if (!pickupValue || !dropoffValue) {
      setError("Please enter both pickup and drop-off postcodes.");
      return;
    }

    if (!ukPostcodeRegex.test(pickupValue)) {
      setError("Please enter a valid UK pickup postcode.");
      return;
    }

    if (!ukPostcodeRegex.test(dropoffValue)) {
      setError("Please enter a valid UK drop-off postcode.");
      return;
    }

    if (!serviceType) {
      setError("Please select a service type.");
      return;
    }

    setLoading(true);
    setError("");
    setDistance(null);
    setQuote(null);
    setOutOfHours(false);

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
          service_type: serviceType,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setDistance(data.distance);
      setQuote(data.quote);
      setOutOfHours(Boolean(data.out_of_hours));

      const whatsappText = encodeURIComponent(
        `Quote request:
Name: ${name}
Phone: ${phone}
Service: ${selectedService?.name || ""}
Pickup: ${pickupValue}
Dropoff: ${dropoffValue}
Distance: ${data.distance}
Quote: £${data.quote}`
      );

      window.open(`https://wa.me/447908831617?text=${whatsappText}`, "_blank");
    } catch {
      setError("Could not connect to the quote service.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `Quote request:
Name: ${name}
Phone: ${phone}
Service: ${selectedService?.name || ""}
Pickup: ${pickup}
Dropoff: ${dropoff}
Distance: ${distance ?? ""}
Quote: £${quote ?? ""}`
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.18),transparent_28%),linear-gradient(180deg,#050816_0%,#0B1220_55%,#050816_100%)] px-6 py-10 pt-28 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur md:p-10">
            <div className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm uppercase tracking-[0.18em] text-orange-300">
              Instant online quote
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
              Get Quote
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Enter your details, choose a service, and get a live recovery quote.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Michael Dyson"
                  className="w-full rounded-2xl border border-white/10 bg-white px-5 py-4 text-lg text-slate-950 placeholder:text-slate-500 outline-none transition focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07903 784424"
                  className="w-full rounded-2xl border border-white/10 bg-white px-5 py-4 text-lg text-slate-950 placeholder:text-slate-500 outline-none transition focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Service type
                </label>

                {loadingServices ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-300">
                    Loading services...
                  </div>
                ) : (
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white px-5 py-4 text-lg text-slate-950 outline-none transition focus:border-orange-400"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}

                {isEmergency && (
                  <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/15 p-4 text-red-100">
                    <p className="font-semibold">
                      ⚠️ For Smart Motorway Emergencies – Dial 999 Immediately
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Pickup postcode
                </label>
                <input
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Pickup postcode (e.g. M11 4JG)"
                  className="w-full rounded-2xl border border-white/10 bg-white px-5 py-4 text-lg text-slate-950 placeholder:text-slate-500 outline-none transition focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Dropoff postcode
                </label>
                <input
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Dropoff postcode (e.g. OL10 2EF)"
                  className="w-full rounded-2xl border border-white/10 bg-white px-5 py-4 text-lg text-slate-950 placeholder:text-slate-500 outline-none transition focus:border-orange-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading || loadingServices || services.length === 0}
                className="w-full rounded-2xl bg-[#FF6A00] px-6 py-5 text-xl font-semibold text-white shadow-[0_0_30px_rgba(255,106,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ff7b24] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Calculating..." : "Get Quote"}
              </button>

              {isEmergency && (
                <a
                  href="tel:999"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-6 py-5 text-xl font-semibold text-white shadow-[0_0_25px_rgba(255,0,0,0.25)] transition hover:bg-red-500"
                >
                  Call 999 Now
                </a>
              )}
            </form>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                {error}
              </div>
            )}
          </div>

          <aside className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur">
            <h2 className="text-4xl font-semibold">Your Quote</h2>

            <div className="mt-8 space-y-5">
              <div>
                <p className="text-slate-300">Service</p>
                <p className="mt-1 text-2xl font-semibold">
                  {selectedService?.name || "-"}
                </p>
              </div>

              <div>
                <p className="text-slate-300">Distance</p>
                <p className="mt-1 text-2xl font-semibold">
                  {distance !== null ? `${distance} miles` : "-"}
                </p>
              </div>

              <div>
                <p className="text-slate-300">Quote</p>
                <p className="mt-1 text-5xl font-bold">
                  {quote !== null ? `£${quote}` : "-"}
                </p>
              </div>

              {outOfHours && (
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-100">
                  <p className="text-sm font-medium">
                    Out-of-hours pricing has been applied.
                  </p>
                </div>
              )}

              {quote !== null && distance !== null && (
                <a
                  href={`https://wa.me/447908831617?text=${whatsappText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Send via WhatsApp
                </a>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}