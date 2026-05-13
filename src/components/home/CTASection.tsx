"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Star,
} from "lucide-react";

/* ─── Joker poster (Cloudinary) ─────────────────────────────── */
const JOKER_POSTER =
  "https://res.cloudinary.com/dtph8gqgi/image/upload/v1778543534/joker-2019-taxi-driver-b-style_q2ptsc.webp";

/* ─── Joker movie detail page ───────────────────────────────── */
const JOKER_HREF = "/movies/cmnfz0848000818vex6rg26mi";

const FEATURED = {
  poster: JOKER_POSTER,
  title: "Joker",
  year: "2019",
  genre: "Crime · Drama · Thriller",
  rating: "8.4",
  runtime: "2h 2m",
  director: "Todd Phillips",
  badge: "Now Trending",
};

export function CTASection() {
  return (
    <section className="pb-40 pt-20">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.95)]">

          {/* ── BACKGROUND — Joker poster ──────────────────────── */}
          <div className="absolute inset-0">
            <Image
              src={JOKER_POSTER}
              alt="Joker 2019 backdrop"
              fill
              sizes="100vw"
              className="object-cover object-[center_20%]"
              priority
            />
            {/* dark vignette — left heavy, fading right */}
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(4,4,4,0.98)_0%,rgba(4,4,4,0.94)_40%,rgba(4,4,4,0.70)_70%,rgba(4,4,4,0.40)_100%)]" />
            {/* bottom page blend */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#060606] to-transparent" />
            {/* top blend */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#060606]/70 to-transparent" />
          </div>

          {/* top red accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

          {/* ── MAIN BODY ─────────────────────────────────────── */}
          <div className="relative grid min-h-[700px] items-center gap-12 py-20 px-8 sm:py-28 sm:px-12 md:py-36 md:px-16 lg:grid-cols-[1fr_400px] lg:gap-16 xl:grid-cols-[1fr_440px]">

            {/* ── LEFT — editorial CTA ─────────────────────────── */}
            <div className="max-w-xl">

              <h2 className="mt-8 text-4xl font-black leading-[0.96] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-[4.5rem]">
                Start watching <br className="hidden sm:block" />
                with <span className="text-primary">less</span> searching.
              </h2>

              {/* CTAs */}
              <div className="mt-12 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="group inline-flex h-16 items-center gap-3 rounded-full bg-primary px-10 text-lg font-black text-white shadow-[0_0_30px_rgba(229,9,20,0.4)] outline-none transition-all hover:bg-[#ff1f1f] hover:shadow-[0_0_40px_rgba(229,9,20,0.6)] focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  Create account
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/movies"
                  className="inline-flex h-16 items-center gap-3 rounded-full border border-white/20 bg-white/10 px-10 text-lg font-black text-white outline-none backdrop-blur transition hover:border-white/30 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-primary/35"
                >
                  Browse first
                </Link>
              </div>
            </div>

            {/* ── RIGHT — Simplified Showcase ─────────────────── */}
            <div className="flex flex-col gap-6">

              {/* Featured Card */}
              <Link
                href={JOKER_HREF}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_-10px_rgba(229,9,20,0.3)]"
              >
                <div className="flex flex-col gap-6 sm:flex-row lg:flex-col xl:flex-row">
                  {/* Poster */}
                  <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:w-44 lg:w-full xl:w-44">
                    <Image
                      src={FEATURED.poster}
                      alt={FEATURED.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 176px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                            {FEATURED.title}
                          </p>
                          <p className="mt-1 text-xs font-bold text-zinc-500">
                            {FEATURED.year} · {FEATURED.runtime}
                          </p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-sm font-black text-white">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {FEATURED.rating}
                        </span>
                      </div>

                      <p className="mt-4 text-xs font-medium text-zinc-400">
                        {FEATURED.genre}
                      </p>
                      <p className="mt-1 text-xs text-zinc-600">
                        Dir. {FEATURED.director}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                        {FEATURED.badge}
                      </span>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-transform group-hover:scale-110 group-hover:bg-[#ff1f1f]">
                        <Play className="h-6 w-6 fill-white text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 transition-colors group-hover:text-primary">
                  Click for movie details & reviews
                </div>
              </Link>
            </div>
          </div>

          {/* ── BOTTOM STRIP ──────────────────────────────────────── */}
          <div className="relative flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] px-10 py-6 sm:flex-row sm:gap-6 md:px-16">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
              No credit card required
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {[
                { val: "18K+", label: "Watching" },
                { val: "1.2K", label: "New Hits" },
                { val: "26K+", label: "Reviews" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <span className="text-sm font-black text-white">{s.val}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
