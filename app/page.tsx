import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.18),transparent_28%),linear-gradient(180deg,#050816_0%,#0B1220_55%,#050816_100%)] px-6 py-10 pt-28 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur md:p-10">
            <div className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm uppercase tracking-[0.18em] text-orange-300">
              24/7 Manchester Recovery
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
              Fast vehicle recovery quotes with a premium booking experience.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Get a live distance-based quote in seconds, then send your details
              straight to M60 Recovery &amp; Rescue on WhatsApp for rapid
              response.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-2xl bg-[#FF6A00] px-6 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(255,106,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ff7b24]"
              >
                Get your quote
              </Link>

              <a
                href="https://wa.me/447908831617"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/[0.08]"
              >
                WhatsApp us
              </a>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["01", "Enter postcodes", "Add pickup and drop-off details in seconds."],
                ["02", "Get live pricing", "Mileage and quote are generated instantly."],
                ["03", "Send job details", "Push the quote to WhatsApp for follow-up."],
              ].map(([num, title, text]) => (
                <div
                  key={num}
                  className="rounded-3xl border border-white/10 bg-[#0f1727]/90 p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/40 text-sm font-semibold text-orange-300 shadow-[0_0_20px_rgba(255,106,0,0.12)]">
                    {num}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[36px] border border-white/10 bg-[#0c1321]/95 p-8 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.22em] text-orange-300">
              Why choose us
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              Built for fast roadside bookings and real customer trust.
            </h2>

            <p className="mt-4 text-slate-300 leading-7">
              A cleaner, faster way for customers to request help without
              back-and-forth calls. Ideal for urgent breakdowns and recovery
              jobs across Manchester and nearby areas.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-slate-400">Coverage</p>
                <p className="mt-2 text-2xl font-semibold">
                  Manchester &amp; surrounding areas
                </p>
              </div>

              <div className="rounded-3xl bg-[#FF6A00] p-5 text-white shadow-[0_0_30px_rgba(255,106,0,0.25)]">
                <p className="text-sm opacity-90">Availability</p>
                <p className="mt-2 text-3xl font-semibold">24/7 response</p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="font-medium text-white">What this system does</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>• Live distance-based pricing</p>
                <p>• Quote saved to your dashboard</p>
                <p>• WhatsApp handoff for fast conversion</p>
                <p>• Admin panel for leads and exports</p>
              </div>
            </div>

            <Link
              href="/quote"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Start quote
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}