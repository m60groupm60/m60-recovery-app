"use client";

import { useMemo, useState } from "react";

type ServiceType = {
  id: string;
  name: string;
  slug: string;
  base_fare: number;
  per_mile: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export default function ServicesAdminClient({
  initialServices,
}: {
  initialServices: ServiceType[];
}) {
  const [services, setServices] = useState<ServiceType[]>(initialServices);
  const [toast, setToast] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [newService, setNewService] = useState({
    name: "",
    slug: "",
    base_fare: "",
    per_mile: "",
    is_active: true,
    sort_order: "",
  });

  const totals = useMemo(() => {
    return {
      total: services.length,
      active: services.filter((s) => s.is_active).length,
      inactive: services.filter((s) => !s.is_active).length,
    };
  }, [services]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newService.name.trim() || !newService.slug.trim()) {
      showToast("Name and slug are required");
      return;
    }

    const res = await fetch("/api/service-types", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newService.name.trim(),
        slug: newService.slug.trim(),
        base_fare: Number(newService.base_fare || 0),
        per_mile: Number(newService.per_mile || 0),
        is_active: newService.is_active,
        sort_order: Number(newService.sort_order || 0),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Failed to create service");
      return;
    }

    setServices((prev) =>
      [...prev, data.service].sort((a, b) => a.sort_order - b.sort_order)
    );

    setNewService({
      name: "",
      slug: "",
      base_fare: "",
      per_mile: "",
      is_active: true,
      sort_order: "",
    });

    showToast("Service created");
  };

  const updateField = (
    id: string,
    field: keyof ServiceType,
    value: string | number | boolean
  ) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const handleSave = async (service: ServiceType) => {
    setSavingId(service.id);

    const res = await fetch(`/api/service-types/${service.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: service.name,
        slug: service.slug,
        base_fare: Number(service.base_fare),
        per_mile: Number(service.per_mile),
        is_active: service.is_active,
        sort_order: Number(service.sort_order),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Failed to save service");
      setSavingId(null);
      return;
    }

    setServices((prev) =>
      prev
        .map((s) => (s.id === service.id ? data.service : s))
        .sort((a, b) => a.sort_order - b.sort_order)
    );

    setSavingId(null);
    showToast("Service updated");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this service type?")) return;

    setDeletingId(id);

    const res = await fetch(`/api/service-types/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Failed to delete service");
      setDeletingId(null);
      return;
    }

    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
    showToast("Service deleted");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.14),transparent_28%),linear-gradient(180deg,#050816_0%,#0B1220_55%,#050816_100%)] px-6 py-10 pt-28 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">
              M60 Recovery & Rescue
            </p>
            <h1 className="mt-2 text-4xl font-semibold">
              Services & Pricing
            </h1>
            <p className="mt-2 text-slate-300">
              Add, edit, disable, or delete service types and pricing rules.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/portal-x7k9a2"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Dashboard
            </a>

            <form action="/api/admin-logout" method="post">
              <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-white transition hover:bg-white/[0.08]">
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <div className="text-sm text-slate-400">Total Services</div>
            <div className="mt-2 text-3xl font-semibold">{totals.total}</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <div className="text-sm text-slate-400">Active</div>
            <div className="mt-2 text-3xl font-semibold">{totals.active}</div>
          </div>

          <div className="rounded-3xl border border-orange-500/20 bg-[#FF6A00]/10 p-5 shadow-[0_0_30px_rgba(255,106,0,0.08)]">
            <div className="text-sm text-orange-200">Inactive</div>
            <div className="mt-2 text-3xl font-semibold text-white">
              {totals.inactive}
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)] backdrop-blur">
          <h2 className="text-2xl font-semibold">Add new service</h2>

          <form onSubmit={handleCreate} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <input
              value={newService.name}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Service name"
              className="rounded-2xl border border-white/10 bg-slate-100 px-4 py-3 text-slate-950 outline-none"
            />

            <input
              value={newService.slug}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="Slug (e.g. vehicle_recovery)"
              className="rounded-2xl border border-white/10 bg-slate-100 px-4 py-3 text-slate-950 outline-none"
            />

            <input
              type="number"
              step="0.01"
              value={newService.base_fare}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, base_fare: e.target.value }))
              }
              placeholder="Base fare"
              className="rounded-2xl border border-white/10 bg-slate-100 px-4 py-3 text-slate-950 outline-none"
            />

            <input
              type="number"
              step="0.01"
              value={newService.per_mile}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, per_mile: e.target.value }))
              }
              placeholder="Per mile"
              className="rounded-2xl border border-white/10 bg-slate-100 px-4 py-3 text-slate-950 outline-none"
            />

            <input
              type="number"
              value={newService.sort_order}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, sort_order: e.target.value }))
              }
              placeholder="Sort order"
              className="rounded-2xl border border-white/10 bg-slate-100 px-4 py-3 text-slate-950 outline-none"
            />

            <button
              type="submit"
              className="rounded-2xl bg-[#FF6A00] px-4 py-3 font-semibold text-white shadow-[0_0_25px_rgba(255,106,0,0.18)] transition hover:bg-[#ff7b24]"
            >
              Add service
            </button>
          </form>

          <label className="mt-4 inline-flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={newService.is_active}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, is_active: e.target.checked }))
              }
            />
            Active
          </label>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur">
          <table className="w-full text-left">
            <thead className="bg-white/[0.04] text-sm text-slate-300">
              <tr>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Slug</th>
                <th className="px-4 py-4">Base Fare</th>
                <th className="px-4 py-4">Per Mile</th>
                <th className="px-4 py-4">Order</th>
                <th className="px-4 py-4">Active</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-t border-white/10 transition hover:bg-white/[0.05]"
                >
                  <td className="px-4 py-4">
                    <input
                      value={service.name}
                      onChange={(e) =>
                        updateField(service.id, "name", e.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-100 px-3 py-2 text-slate-950 outline-none"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <input
                      value={service.slug}
                      onChange={(e) =>
                        updateField(service.id, "slug", e.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-100 px-3 py-2 text-slate-950 outline-none"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <input
                      type="number"
                      step="0.01"
                      value={service.base_fare}
                      onChange={(e) =>
                        updateField(service.id, "base_fare", Number(e.target.value))
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-100 px-3 py-2 text-slate-950 outline-none"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <input
                      type="number"
                      step="0.01"
                      value={service.per_mile}
                      onChange={(e) =>
                        updateField(service.id, "per_mile", Number(e.target.value))
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-100 px-3 py-2 text-slate-950 outline-none"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={service.sort_order}
                      onChange={(e) =>
                        updateField(service.id, "sort_order", Number(e.target.value))
                      }
                      className="w-24 rounded-xl border border-white/10 bg-slate-100 px-3 py-2 text-slate-950 outline-none"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={service.is_active}
                        onChange={(e) =>
                          updateField(service.id, "is_active", e.target.checked)
                        }
                      />
                      <span className="text-sm">{service.is_active ? "Yes" : "No"}</span>
                    </label>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleSave(service)}
                        disabled={savingId === service.id}
                        className="rounded-xl bg-[#FF6A00] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#ff7b24] disabled:opacity-50"
                      >
                        {savingId === service.id ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={deletingId === service.id}
                        className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                      >
                        {deletingId === service.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {services.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="fixed right-5 top-24 z-50 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white shadow-2xl">
          {toast}
        </div>
      )}
    </main>
  );
}