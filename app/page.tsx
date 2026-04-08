import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_30%),linear-gradient(180deg,#020617_0%,#081133_55%,#020617_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">
              M60 Recovery & Rescue
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              24/7 recovery across Manchester & surrounding areas
            </h2>
          </div>
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:block">
            Fast response
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
            <div className="inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
              Instant online quote
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-6xl">
              Vehicle recovery quotes with WhatsApp follow-up.
            </h1>

            <p className="mt-5 max-w-2xl text-lg text-slate-300">
              Enter your pickup and drop-off postcodes, get a live quote in
              seconds, and send the details straight to M60 Recovery & Rescue.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-orange-400"
              >
                Get your quote
              </Link>

              <a
                href="https://wa.me/447908831617"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
              >
                WhatsApp us
              </a>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-orange-300">Step 1</p>
                <h3 className="mt-2 text-lg font-semibold">Enter postcodes</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Add your pickup and drop-off locations in seconds.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-orange-300">Step 2</p>
                <h3 className="mt-2 text-lg font-semibold">Get live pricing</h3>
                <p className="mt-2 text-sm text-slate-300">
                  We calculate mileage and generate your quote instantly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-orange-300">Step 3</p>
                <h3 className="mt-2 text-lg font-semibold">Send to WhatsApp</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Send your quote details directly for fast follow-up.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-[#071538] p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">
              Why choose us
            </p>
            <h3 className="mt-4 text-3xl font-semibold">
              Built for quick roadside bookings
            </h3>
            <p className="mt-3 text-slate-300">
              A faster way for customers to request help without long phone
              calls or back-and-forth messages.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Coverage</p>
                <p className="mt-2 text-2xl font-semibold">
                  Manchester & nearby areas
                </p>
              </div>

              <div className="rounded-2xl bg-orange-500 p-5 text-white">
                <p className="text-sm opacity-90">Availability</p>
                <p className="mt-2 text-3xl font-semibold">24/7 response</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              <p className="font-medium text-white">What this site does</p>
              <div className="mt-3 space-y-2">
                <p>• Live distance-based pricing</p>
                <p>• Quote saved to your system</p>
                <p>• WhatsApp handoff for fast contact</p>
              </div>
            </div>

            <Link
              href="/quote"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Start quote
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}