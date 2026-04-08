"use client";

import { useMemo, useState } from "react";

type Quote = {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  dropoff_address: string;
  quoted_amount: number;
  distance_miles: number;
  status: string;
  created_at: string;
};

type Props = {
  initialQuotes: Quote[];
};

export default function AdminDashboardClient({ initialQuotes }: Props) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [toast, setToast] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredQuotes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return quotes;

    return quotes.filter((q) => {
      return (
        q.customer_name?.toLowerCase().includes(term) ||
        q.customer_phone?.toLowerCase().includes(term) ||
        q.pickup_address?.toLowerCase().includes(term) ||
        q.dropoff_address?.toLowerCase().includes(term) ||
        q.status?.toLowerCase().includes(term)
      );
    });
  }, [quotes, search]);

  const totalQuotes = filteredQuotes.length;
  const totalRevenue = filteredQuotes.reduce(
    (sum, q) => sum + Number(q.quoted_amount || 0),
    0
  );
  const newLeads = filteredQuotes.filter((q) => q.status === "new").length;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this quote?");
    if (!confirmed) return;

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_28%),linear-gradient(180deg,#020617_0%,#081133_55%,#020617_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">
              M60 Recovery & Rescue
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Admin Dashboard</h1>
            <p className="mt-2 text-slate-300">
              Manage quotes, leads, WhatsApp contact, and exports.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/api/admin-export"
              className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-400"
            >
              Export leads CSV
            </a>

            <form action="/api/admin-logout" method="post">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10">
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="text-sm text-slate-400">Total Quotes</div>
            <div className="mt-2 text-3xl font-semibold">{totalQuotes}</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="text-sm text-slate-400">Total Revenue</div>
            <div className="mt-2 text-3xl font-semibold">
              £{totalRevenue.toFixed(0)}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="text-sm text-slate-400">New Leads</div>
            <div className="mt-2 text-3xl font-semibold">{newLeads}</div>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone, route or status"
            className="w-full rounded-2xl border border-white/10 bg-slate-100 px-4 py-3 text-slate-950 outline-none"
          />
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-sm text-slate-300">
              <tr>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Route</th>
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
                  `Hi ${q.customer_name}, your recovery quote is £${q.quoted_amount}. Pickup: ${q.pickup_address}. Drop-off: ${q.dropoff_address}.`
                );

                return (
                  <tr
                    key={q.id}
                    className="border-t border-white/10 transition hover:bg-white/5"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium">{q.customer_name}</div>
                      <div className="text-sm text-slate-400">
                        {q.customer_phone}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm">
                      <div>{q.pickup_address}</div>
                      <div className="text-slate-400">to {q.dropoff_address}</div>
                    </td>

                    <td className="px-4 py-4">{q.distance_miles}</td>
                    <td className="px-4 py-4 font-medium">£{q.quoted_amount}</td>

                    <td className="px-4 py-4">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
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
                    colSpan={7}
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
          WhatsApp buttons open a pre-filled message. Full automatic sending
          needs WhatsApp Business API.
        </p>
      </div>

      {toast && (
        <div className="fixed right-5 top-5 z-50 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white shadow-2xl">
          {toast}
        </div>
      )}
    </main>
  );
}