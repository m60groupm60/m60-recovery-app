import { supabase } from "../../../lib/supabase";
import ServicesAdminClient from "./ServicesAdminClient";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const { data, error } = await supabase
    .from("service_types")
    .select("id, name, slug, base_fare, per_mile, is_active, sort_order, created_at")
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 pt-28 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-red-500/20 bg-red-500/10 p-6 text-red-200">
            Failed to load services
          </div>
        </div>
      </main>
    );
  }

  return <ServicesAdminClient initialServices={data || []} />;
}