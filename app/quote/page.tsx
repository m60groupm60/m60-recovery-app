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
      return setError("Enter both postcodes");
    }

    if (!ukPostcodeRegex.test(pickupValue)) {
      return setError("Invalid pickup postcode");
    }

    if (!ukPostcodeRegex.test(dropoffValue)) {
      return setError("Invalid dropoff postcode");
    }

    setLoading(true);
    setError("");
    setDistance(null);
    setQuote(null);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          pickup_address: pickupValue,
          dropoff_address: dropoffValue,
          service_type: serviceType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.error);
      }

      setDistance(data.distance);
      setQuote(data.quote);
      setOutOfHours(Boolean(data.out_of_hours));

      const text = encodeURIComponent(
        `Quote request:
Name: ${name}
Phone: ${phone}
Service: ${selectedService?.name}
Pickup: ${pickupValue}
Dropoff: ${dropoffValue}
Distance: ${data.distance}
Quote: £${data.quote}`
      );

      window.open(`https://wa.me/447908831617?text=${text}`, "_blank");
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `Quote:
${name} - ${phone}
${pickup} → ${dropoff}
£${quote}`
  );

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 pt-28 text-white">
      <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-2">
        {/* FORM */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-4xl font-semibold">Get Quote</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

            {/* 🚨 Emergency Banner */}
            {isEmergency && (
              <div className="rounded-xl bg-red-500/10 p-4 text-red-200">
                ⚠️ For Smart Motorway Emergencies – Dial 999 Immediately
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

            {/* 🚨 999 Button */}
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

        {/* RESULT */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold">Your Quote</h2>

          <p className="mt-4">
            Service: {selectedService?.name || "-"}
          </p>

          <p className="mt-2">
            Distance: {distance ? `${distance} miles` : "-"}
          </p>

          <p className="mt-4 text-4xl font-bold">
            {quote ? `£${quote}` : "-"}
          </p>

          {/* ⭐ NICE TOUCH */}
          {outOfHours && (
            <div className="mt-4 rounded-xl bg-yellow-500/10 p-4 text-yellow-200">
              Out-of-hours pricing has been applied
            </div>
          )}

          {quote && (
            <a
              href={`https://wa.me/447908831617?text=${whatsappText}`}
              className="mt-6 block rounded-xl bg-white py-4 text-center text-black"
            >
              Send via WhatsApp
            </a>
          )}
        </div>
      </div>
    </main>
  );
}