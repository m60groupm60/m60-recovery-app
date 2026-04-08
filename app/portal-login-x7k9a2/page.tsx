"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    setLoading(true);

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/portal-x7k9a2");
    } else {
      alert("Wrong password");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-semibold">Admin login</h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="mt-6 w-full rounded-2xl bg-slate-100 px-4 py-3 text-slate-950"
        />

        <button
          onClick={login}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </main>
  );
}