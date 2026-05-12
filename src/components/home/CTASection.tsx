import Link from "next/link";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";

/* eslint-disable @next/next/no-img-element */

export function CTASection() {
  return (
    <section className="pb-16 pt-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="relative min-h-[360px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#060606] p-6 shadow-[0_32px_80px_-50px_rgba(0,0,0,0.9)] md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,0.04),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.96),rgba(0,0,0,0.72)_55%,rgba(0,0,0,0.96))]" />

          <div className="relative flex min-h-[420px] max-w-3xl flex-col justify-end">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-white">
              <Play className="h-3.5 w-3.5 fill-current text-primary" />
              Browse faster
            </p>
            <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-tighter text-white md:text-5xl">
              Start watching with less searching.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
              Browse free titles, premium collections, and save picks for later.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-black text-black outline-none transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/movies"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-sm font-black text-white outline-none backdrop-blur-md transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary/35"
              >
                Browse first
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-zinc-400">
              {["Free browsing", "Premium collections", "Cancel anytime"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
