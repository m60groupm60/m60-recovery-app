"use client";

import { useEffect, useMemo, useState } from "react";

type ServiceType = {
  id: string;
  name: string;
  slug: string;
  base_fare: number;
  per_mile: number;
  is_active: boolean;
  sort_order: number;
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

  const ukPostcodeRegex =
    /^([A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2})$/i;

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch("/api/service-types?active=true");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load service types");
          return;
        }

        const loadedServices = data.services || [];
        setServices(loadedServices);

        if (loadedServices.length > 0) {
          setServiceType(loadedServices[0].slug);
        }
      } catch {
        setError("Could not load service types");
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  const selectedService = useMemo(() => {
    return services.find((service) => service.slug === serviceType) || null;
  }, [services, serviceType]);

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
    } catch {
      setError("Could not connect to the quote service.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hello M60 Recovery & Rescue, I would like a quote.
Name: ${name}
Phone: ${phone}
Service: ${selectedService?.name || ""}
Pickup: ${pickup}
Drop-off: ${dropoff}
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
              Get your quote
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Enter your details, choose a service, and get a live recovery quote instantly.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
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
                  Service type
                </label>

                {loadingServices ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-slate-300">
                    Loading service types...
                  </div>
                ) : (
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-100 px-5 py-4 text-lg text-slate-950 outline-none transition focus:border-orange-400"
                  >
                    {services.map((service) => (
                      <option key={service.id} value={service.slug}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                )}
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
                  placeholder="Drop-off postcode (e.g. OL10 2EF)"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading || loadingServices || services.length === 0}
                className="w-full rounded-2xl bg-[#FF6A00] px-6 py-5 text-xl font-semibold text-white shadow-[0_0_30px_rgba(255,106,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ff7b24] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Calculating..." : "Calculate quote"}
              </button>
            </form>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                {error}
              </div>
            )}
          </div>

          <aside className="rounded-[36px] border border-white/10 bg-[#0c1321]/95 p-8 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.22em] text-orange-300">
              Live result
            </p>

            <h2 className="mt-4 text-3xl font-semibold">
              Your recovery estimate
            </h2>

            <p className="mt-3 text-slate-300">
              Mileage and quote update after calculation.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-slate-400">Service</p>
                <p className="mt-2 text-2xl font-semibold">
                  {selectedService?.name || "—"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-slate-400">Distance</p>
                <p className="mt-2 text-3xl font-semibold">
                  {distance !== null ? `${distance} miles` : "—"}
                </p>
              </div>

              <div className="rounded-3xl bg-[#FF6A00] p-5 text-white shadow-[0_0_30px_rgba(255,106,0,0.25)]">
                <p className="text-sm opacity-90">Estimated quote</p>
                <p className="mt-2 text-4xl font-semibold">
                  {quote !== null ? `£${quote}` : "—"}
                </p>
              </div>

              {selectedService && (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm text-slate-400">Pricing rule</p>
                  <p className="mt-2 text-lg font-semibold">
                    Base fare £{Number(selectedService.base_fare).toFixed(0)} + £
                    {Number(selectedService.per_mile).toFixed(2)}/mile
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
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
        </section>
      </div>
    </main>
  );
}