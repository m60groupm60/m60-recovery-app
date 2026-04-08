import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { data: quotes, error } = await supabase
    .from("quotes")
    .select("id, customer_name, customer_phone, pickup_address, dropoff_address, quoted_amount, distance_miles, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        Failed to load quotes
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-semibold">Admin Dashboard</h1>
          <a
            href="/api/admin-export"
            className="rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white"
          >
            Export leads CSV
          </a>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-sm text-slate-300">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Miles</th>
                <th className="px-4 py-3">Quote</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {quotes?.map((q) => (
                <tr key={q.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <div className="font-medium">{q.customer_name}</div>
                    <div className="text-sm text-slate-400">{q.customer_phone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>{q.pickup_address}</div>
                    <div className="text-slate-400">to {q.dropoff_address}</div>
                  </td>
                  <td className="px-4 py-3">{q.distance_miles}</td>
                  <td className="px-4 py-3">£{q.quoted_amount}</td>
                  <td className="px-4 py-3">{q.status}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(q.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}