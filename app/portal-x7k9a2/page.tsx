import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { data: quotes, error } = await supabase
    .from("quotes")
    .select(
      "id, customer_name, customer_phone, pickup_address, dropoff_address, quoted_amount, distance_miles, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        Failed to load quotes
      </main>
    );
  }

  const allQuotes = quotes || [];
  const totalQuotes = allQuotes.length;
  const totalRevenue = allQuotes.reduce(
    (sum, q) => sum + Number(q.quoted_amount || 0),
    0
  );
  const newLeads = allQuotes.filter((q) => q.status === "new").length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-4xl font-semibold">Admin Dashboard</h1>

          <div className="flex items-center gap-3">
            <a
              href="/api/admin-export"
              className="rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white"
            >
              Export leads CSV
            </a>

            <form action="/api/admin-logout" method="post">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white">
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Total Quotes</div>
            <div className="mt-2 text-3xl font-semibold">{totalQuotes}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Total Revenue</div>
            <div className="mt-2 text-3xl font-semibold">
              £{totalRevenue.toFixed(0)}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">New Leads</div>
            <div className="mt-2 text-3xl font-semibold">{newLeads}</div>
          </div>
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
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {allQuotes.map((q) => {
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
                  <tr key={q.id} className="border-t border-white/10">
                    <td className="px-4 py-3">
                      <div className="font-medium">{q.customer_name}</div>
                      <div className="text-sm text-slate-400">
                        {q.customer_phone}
                      </div>
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

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white"
                        >
                          WhatsApp
                        </a>

                        <form action={`/api/quotes/${q.id}`} method="post">
                          <input type="hidden" name="_method" value="DELETE" />
                          <button className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          WhatsApp buttons open a pre-filled message. Full automatic sending
          needs WhatsApp Business API.
        </p>
      </div>
    </main>
  );
}