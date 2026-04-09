"use client";

import { useState } from "react";

type PricingSettings = {
  id: string;
  weekday_start_hour: number;
  weekday_end_hour: number;
  weekend_enabled: boolean;
};

export default function PricingAdminClient({
  initialSettings,
}: {
  initialSettings: PricingSettings;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const saveSettings = async () => {
    setSaving(true);

    try {
      const res = await fetch("/api/pricing-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to save settings");
        setSaving(false);
        return;
      }

      setSettings(data.settings);
      showToast("Pricing settings updated");
    } catch {
      showToast("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.14),transparent_28%),linear-gradient(180deg,#050816_0%,#0B1220_55%,#050816_100%)] px-6 py-10 pt-28 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">
              M60 Recovery & Rescue
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Pricing Settings</h1>
            <p className="mt-2 text-slate-300">
              Control out-of-hours rules used by the quote engine.
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

            <form action="/api/admin-logout" method="post">
              <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-white transition hover:bg-white/[0.08]">
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Weekday out-of-hours starts at
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={settings.weekday_start_hour}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    weekday_start_hour: Number(e.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-100 px-4 py-3 text-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Weekday out-of-hours ends at
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={settings.weekday_end_hour}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    weekday_end_hour: Number(e.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-100 px-4 py-3 text-slate-950"
              />
            </div>
          </div>

          <label className="mt-5 inline-flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={settings.weekend_enabled}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  weekend_enabled: e.target.checked,
                }))
              }
            />
            Treat weekends as out-of-hours
          </label>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="mt-6 rounded-2xl bg-[#FF6A00] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
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