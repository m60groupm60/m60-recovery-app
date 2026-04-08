import Link from "next/link";

const featureCards = [
  {
    title: "Fast response",
    text: "Quick roadside assistance and recovery bookings across Manchester.",
  },
  {
    title: "Live pricing",
    text: "Distance-based quotes generated instantly from your postcodes.",
  },
  {
    title: "WhatsApp handoff",
    text: "Customers can send their quote details straight to your team.",
  },
  {
    title: "24/7 service",
    text: "Built for urgent breakdowns, day or night.",
  },
];

const serviceCards = [
  "Vehicle Recovery",
  "Off-Road Rescue",
  "Vehicle Transportation",
  "New Car Purchases",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] px-6 pb-12 pt-28 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[8%] h-72 w-72 rounded-full bg-[#ff6a00]/10 blur-3xl" />
        <div className="absolute right-[8%] top-[18%] h-80 w-80 rounded-full bg-[#ff6a00]/12 blur-3xl" />
        <div className="absolute bottom-[12%] left-[20%] h-64 w-64 rounded-full bg-[#ff6a00]/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,106,0,0.05))] p-8 shadow-[0_0_60px_rgba(0,0,0,0.35)] backdrop-blur md:p-10">
            <div className="inline-flex rounded-full border border-[#ff6a00]/30 bg-[#ff6a00]/10 px-5 py-2 text-sm uppercase tracking-[0.22em] text-orange-300">
              24/7 Manchester Breakdown
            </div>

            <h1 className="mt-8 max-w-4xl text-6xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">
              Get a live distance-based quote in seconds, then send your details
              straight to M60 Recovery &amp; Rescue for rapid response.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-2xl bg-[#ff6a00] px-7 py-4 text-lg font-semibold text-white shadow-[0_0_35px_rgba(255,106,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ff7d1f]"
              >
                Get your quote
              </Link>

              <a
                href="https://wa.me/447908831617"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-lg font-semibold text-white transition hover:bg-white/[0.08]"
              >
                WhatsApp us
              </a>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map((item, idx) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-[#0e1526]/90 p-5 shadow-[0_0_25px_rgba(0,0,0,0.2)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#ff6a00]/60 text-sm font-semibold text-orange-300 shadow-[0_0_20px_rgba(255,106,0,0.12)]">
                      0{idx + 1}
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[36px] border border-white/10 bg-[#0b1220]/95 p-8 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-300">
              Why choose us
            </p>

            <h2 className="mt-5 text-5xl font-semibold leading-tight">
              Built for fast roadside bookings and real customer trust.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              A cleaner, faster way for customers to request help without
              back-and-forth calls. Ideal for urgent breakdowns and recovery
              jobs across Manchester and nearby areas.
            </p>

            <div className="mt-8 space-y-5">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm text-slate-400">Coverage</p>
                <p className="mt-3 text-3xl font-semibold">
                  Manchester &amp; surrounding areas
                </p>
              </div>

              <div className="rounded-[28px] bg-[#ff6a00] p-6 text-white shadow-[0_0_35px_rgba(255,106,0,0.25)]">
                <p className="text-sm opacity-90">Availability</p>
                <p className="mt-3 text-4xl font-semibold">24/7 response</p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                <p className="font-medium text-white"></p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p>• </p>
                  <p>• </p>
                  <p>• </p>
                  <p>• </p>
                </div>
              </div>
            </div>

            <Link
              href="/quote"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Start quote now
            </Link>
          </aside>
        </section>

        <section className="mt-8 rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,106,0,0.04))] p-8 shadow-[0_0_60px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-300">
                Our Services
              </p>
              <h3 className="mt-3 text-4xl font-semibold">
                From Mud to Motorway, We Pull Through
              </h3>
            </div>

            <Link
              href="/quote"
              className="inline-flex items-center justify-center rounded-2xl bg-[#ff6a00] px-5 py-3 font-semibold text-white shadow-[0_0_25px_rgba(255,106,0,0.22)] transition hover:bg-[#ff7d1f]"
            >
              Get a quote
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {serviceCards.map((service, idx) => (
              <div
                key={service}
                className="group rounded-[28px] border border-white/10 bg-[#0f1727]/90 p-6 transition hover:-translate-y-1 hover:border-[#ff6a00]/30 hover:shadow-[0_0_25px_rgba(255,106,0,0.14)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#ff6a00]/60 text-lg font-semibold text-orange-300 shadow-[0_0_20px_rgba(255,106,0,0.1)]">
                  {idx + 1}
                </div>

                <h4 className="mt-5 text-2xl font-semibold transition group-hover:text-orange-200">
                  {service}
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Fast support, clean booking flow, and customer-friendly quote
                  handoff built into your site.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}