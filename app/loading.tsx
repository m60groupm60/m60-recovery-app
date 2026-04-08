import Image from "next/image";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center">
        <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4">
          <Image
            src="/logo.png"
            alt="M60 Recovery & Rescue"
            width={180}
            height={60}
            className="h-14 w-auto"
            priority
          />
        </div>

        <p className="mt-4 text-sm uppercase tracking-[0.25em] text-orange-300">
          Loading
        </p>
      </div>
    </main>
  );
}