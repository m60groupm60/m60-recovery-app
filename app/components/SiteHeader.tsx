import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <Image
              src="/logo.png"
              alt="M60 Recovery & Rescue"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </div>

          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.25em] text-orange-300">
              M60 Recovery & Rescue
            </p>
            <p className="text-sm text-slate-300">24/7 Manchester recovery</p>
          </div>
        </a>

        <div className="flex items-center gap-3">
          <a
            href="/quote"
            className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            Get quote
          </a>

          <a
            href="https://wa.me/447908831617"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}