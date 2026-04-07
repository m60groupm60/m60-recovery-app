import Link from "next/link";
import { MessageCircle, CreditCard, ShieldCheck, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <div className="inline-flex items-center gap-3 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
            <Truck className="h-4 w-4" />
            M60 Recovery & Rescue · Manchester & surrounding areas
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Instant recovery quotes with full online payment.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Customers can enter pickup and drop-off addresses, get a quote,
            upload photos, pay online, and send the details to WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/quote"
              className="rounded-2xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-400"
            >
              Get a quote
            </Link>

            <a
              href="https://wa.me/44790883117"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/15 px-6 py-3 font-medium hover:bg-white/5"
            >
              WhatsApp us
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <MessageCircle className="mb-3 h-5 w-5 text-orange-300" />
            <h2 className="text-xl font-semibold">WhatsApp handoff</h2>
            <p className="mt-2 text-slate-300">
              Every enquiry can be pushed straight into WhatsApp.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <CreditCard className="mb-3 h-5 w-5 text-orange-300" />
            <h2 className="text-xl font-semibold">Full card payment</h2>
            <p className="mt-2 text-slate-300">
              Take full payment online after the quote is accepted.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <ShieldCheck className="mb-3 h-5 w-5 text-orange-300" />
            <h2 className="text-xl font-semibold">Hidden admin area</h2>
            <p className="mt-2 text-slate-300">
              Private portal for pricing, quotes, and uploaded photos.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}