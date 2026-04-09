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
    return services.find((s) => s.slug === serviceType) || null;
  }, [services, serviceType]);

  // 🔥 FIXED: universal slug check
  const isEmergency =
    selectedService?.slug
      ?.toLowerCase()
      .replace(/-/g, "_") === "emergency_breakdown";

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
    <main className="min-h-screen bg-[#050816] px-6 py-10 pt-28 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h1 className="text-4xl font-semibold">Get your quote</h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <input
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-black"
              />

              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-black"
              />

              {/* SERVICE SELECT */}
              {loadingServices ? (
                <div>Loading services...</div>
              ) : (
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-black"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}

              {/* 🚨 EMERGENCY BANNER */}
              {isEmergency && (
                <div className="rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-200">
                  <div className="flex gap-2">
                    <span>⚠️</span>
                    <div>
                      <p className="font-semibold">
                        For Smart Motorway Emergencies – Dial 999 Immediately
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <input
                placeholder="Pickup postcode"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-black"
              />

              <input
                placeholder="Dropoff postcode"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-black"
              />

              <button className="w-full rounded-xl bg-orange-500 py-4 font-semibold">
                {loading ? "Calculating..." : "Get Quote"}
              </button>

              {/* 🚨 CALL BUTTON */}
              {isEmergency && (
                <a
                  href="tel:999"
                  className="block w-full rounded-xl bg-red-600 py-4 text-center font-semibold"
                >
                  Call 999 Now
                </a>
              )}
            </form>

            {error && <p className="mt-4 text-red-400">{error}</p>}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">Result</h2>

            <p className="mt-4">
              Distance: {distance !== null ? `${distance} miles` : "-"}
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {quote !== null ? `£${quote}` : "-"}
            </p>

            {quote && (
              <a
                href={`https://wa.me/447908831617?text=${whatsappText}`}
                className="mt-6 block rounded-xl bg-white py-4 text-center text-black"
              >
                Send to WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}