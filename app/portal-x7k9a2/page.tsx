import { supabase } from "../../lib/supabase";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { data: quotes, error } = await supabase
    .from("quotes")
    .select(
      "id, customer_name, customer_phone, pickup_address, dropoff_address, service_type, quoted_amount, distance_miles, status, created_at, out_of_hours"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        Failed to load quotes
      </main>
    );
  }

  return <AdminDashboardClient initialQuotes={quotes || []} />;
}