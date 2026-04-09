"use client";

import { useMemo, useState } from "react";

type Quote = {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  dropoff_address: string;
  service_type: string;
  quoted_amount: number;
  distance_miles: number;
  status: string;
  created_at: string;
  out_of_hours?: boolean;
};

export default function AdminDashboardClient({
  initialQuotes,
}: {
  initialQuotes: Quote[];
}) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [toast, setToast] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const serviceLabels: Record<string, string> = {
    vehicle_recovery: "Vehicle Recovery",
    off_road_rescue: "Off-Road Rescue",
    vehicle_transportation: "Vehicle Transportation",
    new_car_purchases: "New Car Purchases",
    emergency_breakdown: "Emergency Breakdown",
  };

  const filteredQuotes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return quotes;

    return quotes.filter((q) =>
      [
        q.customer_name,
        q.customer_phone,
        q.pickup_address,
        q.dropoff_address,
        q.service_type,
        q.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [quotes, search]);

  const totalQuotes = filteredQuotes.length;
  const totalRevenue = filteredQuotes.reduce(
    (sum, q) => sum + Number(q.quoted_amount || 0),
    0
  );
  const newLeads = filteredQuotes.filter((q) => q.status === "new").length;
  const emergencyJobs = filteredQuotes.filter(
    (q) => q.service_type === "emergency_breakdown"
  ).length;

  const revenueByService = filteredQuotes.reduce<Record<string, number>>(
    (acc, q) => {
      const key = serviceLabels[q.service_type] || q.service_type;
      acc[key] = (acc[key] || 0) + Number(q.quoted_amount || 0);
      return acc;
    },
    {}
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this quote?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to delete quote");
        return;
      }

      setQuotes((prev) => prev.filter((q) => q.id !== id));
      showToast("Quote deleted");
    } catch {
      showToast("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.14),transparent_28%),linear-gradient(180deg,#050816_0%,#0B1220_55%,#050816_100%)] px-6 py-10 pt-28 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">
              M60 Recovery & Rescue
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Admin Dashboard</h1>
            <p className="mt-2 text-slate-300">
              Manage leads, quotes, exports, and customer follow-up.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/portal-x7k9a2"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Dashboard
            </a>

            <a
              href="/portal-x7k9a2/services"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Services
            </a>

            <a
              href="/api/admin-export"
              className="rounded-2xl bg-[#FF6A00] px-4 py-3 font-semibold text-white shadow-[0_0_25px_rgba(255,106,0,0.18)] transition hover:bg-[#ff7b24]"
            >
              Export leads CSV
            </a>

            <form action="/api/admin-logout" method="post">
              <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-white transition hover:bg-white/[0.08]">
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <div className="text-sm text-slate-400">Total Quotes</div>
            <div className="mt-2 text-3xl font-semibold">{totalQuotes}</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <div className="text-sm text-slate-400">Total Revenue</div>
            <div className="mt-2 text-3xl font-semibold">
              £{totalRevenue.toFixed(0)}
            </div>
          </div>

          <div className="rounded-3xl border border-orange-500/20 bg-[#FF6A00]/10 p-5 shadow-[0_0_30px_rgba(255,106,0,0.08)]">
            <div className="text-sm text-orange-200">New Leads</div>
            <div className="mt-2 text-3xl font-semibold text-white">
              {newLeads}
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 shadow-[0_0_30px_rgba(255,0,0,0.08)]">
            <div className="text-sm text-red-200">Emergency Jobs</div>
            <div className="mt-2 text-3xl font-semibold text-white">
              {emergencyJobs}
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(revenueByService).map(([service, value]) => (
            <div
              key={service}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
            >
              <div className="text-sm text-slate-400">{service}</div>
              <div className="mt-2 text-2xl font-semibold">
                £{value.toFixed(0)}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone, route, service or status"
            className="w-full rounded-2xl border border-white/10 bg-slate-100 px-4 py-3 text-slate-950 outline-none"
          />
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur">
          <table className="w-full text-left">
            <thead className="bg-white/[0.04] text-sm text-slate-300">
              <tr>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Route</th>
                <th className="px-4 py-4">Service</th>
                <th className="px-4 py-4">Miles</th>
                <th className="px-4 py-4">Quote</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredQuotes.map((q) => {
                const cleanedPhone = String(q.customer_phone || "").replace(
                  /\D/g,
                  ""
                );

                const whatsappPhone = cleanedPhone.startsWith("0")
                  ? `44${cleanedPhone.slice(1)}`
                  : cleanedPhone;

                const whatsappText = encodeURIComponent(
                  `Hi ${q.customer_name}, your ${
                    serviceLabels[q.service_type] || q.service_type
                  } quote is £${q.quoted_amount}. Pickup: ${q.pickup_address}. Drop-off: ${q.dropoff_address}.`
                );

                const isEmergency = q.service_type === "emergency_breakdown";
                const isHotLead = isEmergency || Number(q.quoted_amount || 0) > 100;

                return (
                  <tr
                    key={q.id}
                    className={`border-t border-white/10 transition hover:bg-white/[0.05] ${
                      isEmergency ? "bg-red-500/10" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium">{q.customer_name}</div>
                      <div className="text-sm text-slate-400">
                        {q.customer_phone}
                      </div>
                      {isHotLead && (
                        <div className="mt-2 inline-flex rounded-full bg-orange-500/20 px-2 py-1 text-xs font-semibold text-orange-200">
                          🔥 HIGH VALUE
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      <div>{q.pickup_address}</div>
                      <div className="text-slate-400">to {q.dropoff_address}</div>
                      {q.out_of_hours && (
                        <div className="mt-2 inline-flex rounded-full bg-yellow-500/15 px-2 py-1 text-xs font-semibold text-yellow-200">
                          Out of hours
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {serviceLabels[q.service_type] || q.service_type}
                    </td>

                    <td className="px-4 py-4">{q.distance_miles}</td>
                    <td className="px-4 py-4 font-medium">£{q.quoted_amount}</td>

                    <td className="px-4 py-4">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm">
                        {q.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-300">
                      {new Date(q.created_at).toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-500"
                        >
                          WhatsApp
                        </a>

                        <button
                          onClick={() => handleDelete(q.id)}
                          disabled={deletingId === q.id}
                          className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                        >
                          {deletingId === q.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredQuotes.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    No quotes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          WhatsApp buttons open automatically after quote on the customer page, and admin can still open each lead manually here.
        </p>
      </div>

      {toast && (
        <div className="fixed right-5 top-24 z-50 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white shadow-2xl">
          {toast}
        </div>
      )}
    </main>
  );
}