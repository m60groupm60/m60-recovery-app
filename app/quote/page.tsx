"use client";

import { useState } from "react";

export default function QuotePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const [distance, setDistance] = useState<number | null>(null);
  const [quote, setQuote] = useState<number | null>(null);

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
        return;
      }

      setDistance(data.distance);
      setQuote(data.quote);
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-2">Get your quote</h1>
      <p className="mb-6">Fill in the details below to get a quote.</p>

      <div className="space-y-4">
        <input
          className="w-full p-3 rounded text-black"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 rounded text-black"
          placeholder="Your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="w-full p-3 rounded text-black"
          placeholder="Pickup postcode (e.g. M11 4JG)"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />

        <input
          className="w-full p-3 rounded text-black"
          placeholder="Dropoff postcode (e.g. OL10 2EF)"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 p-3 rounded font-semibold"
        >
          Calculate quote
        </button>
      </div>

      {distance !== null && quote !== null && (
        <div className="mt-6 p-4 border rounded">
          <p>Distance: {distance} miles</p>
          <h2 className="text-xl font-bold">Quote: £{quote}</h2>
        </div>
      )}
    </div>
  );
}