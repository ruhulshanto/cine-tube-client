"use client";

import { ArrowRight, Flame, MessageSquareQuote, Quote, Star } from "lucide-react";
import Link from "next/link";

/* ─── Data ───────────────────────────────────────────────────── */
const COMMUNITY_REACTIONS = [
  {
    id: "cmng0uvt7000w18verl25hcft", // Vincenzo
    title: "Vincenzo",
    signal: "Replayed tonight",
    quote: "Sharp pacing, stylish tension, and exactly the kind of late-night pick I wanted.",
    rating: 9.1,
    genre: "Crime · Drama",
    reviewer: "Marcus D.",
    initials: "MD",
    replays: 3,
    spotlight: true,
    image: "https://image.tmdb.org/t/p/w500/8X998H6Tf9O9M9xN0X7O9u1qV.jpg" // Placeholder for backdrop
  },
  {
    id: "cmng0uvt7000w18verl25hcft", // Using same ID for demo
    title: "Titanic",
    signal: "Community classic",
    quote: "Still the title people return to when they want something emotional and familiar.",
    rating: 8.8,
    genre: "Romance · Drama",
    reviewer: "Priya S.",
    initials: "PS",
    replays: 7,
    spotlight: false,
    image: "https://image.tmdb.org/t/p/w500/96ZS9OaJ0Vf2O8S9O5X0O9X0.jpg"
  },
  {
    id: "cmng0uvt7000w18verl25hcft",
    title: "Shang-Chi",
    signal: "Rising action pick",
    quote: "Big-screen energy with enough heart to keep it from feeling empty.",
    rating: 8.6,
    genre: "Action · Adventure",
    reviewer: "Leo K.",
    initials: "LK",
    replays: 2,
    spotlight: false,
    image: "https://image.tmdb.org/t/p/w500/cin9O9X0O9X0O9X0O9X0O9X.jpg"
  },
];

/* ─── Star row ───────────────────────────────────────────────── */
function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating / 2);
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < full
              ? "fill-amber-400 text-amber-400"
              : "fill-white/10 text-white/10"
          }`}
        />
      ))}
    </span>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────── */
function Avatar({ initials }: { initials: string }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[10px] font-black uppercase tracking-widest text-zinc-300">
      {initials}
    </span>
  );
}

/* ─── Replay counter ─────────────────────────────────────────── */
function ReplayBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      ×{count} replay{count !== 1 ? "s" : ""}
    </span>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export function TestimonialsSection() {
  return (
    <section className="container mx-auto px-6 py-24 md:px-12 lg:px-20">
      <div className="space-y-16">
        {/* ── HEADER ────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-6">
          <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            <MessageSquareQuote className="h-4 w-4" />
            Viewer Insights
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="max-w-4xl text-5xl font-normal leading-none tracking-wider text-white md:text-8xl uppercase">
            Reactions should point back to <span className="text-primary">movies</span>, not generic praise.
          </h2>
          <div className="max-w-2xl border-l-2 border-primary/40 pl-6 mx-auto">
            <p className="text-lg leading-relaxed text-zinc-500">
              Real activity creates confidence — verified ratings, authentic reactions, and the titles that keep our community coming back for more.
            </p>
          </div>
        </div>

        {/* ── CARDS ─────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {COMMUNITY_REACTIONS.map((item, idx) => (
            <Link
              key={item.title}
              href={`/movies/${item.id}`}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.04] hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
            >
              {/* Card Background Movie Glow */}
              <div className="absolute inset-0 z-0 opacity-10 grayscale transition-all duration-700 group-hover:opacity-20 group-hover:grayscale-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
              </div>

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      {item.genre}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-sm font-black text-white">
                    {item.rating}
                  </div>
                </div>

                <div className="mt-4">
                  <StarRow rating={item.rating} />
                </div>

                <div className="mt-6 flex-1">
                   <div className="relative">
                      <Quote className="absolute -left-1 -top-1 h-8 w-8 text-primary/10" />
                      <p className="pl-6 text-lg font-medium leading-relaxed text-zinc-300 italic">
                        "{item.quote}"
                      </p>
                   </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar initials={item.initials} />
                    <div>
                      <p className="text-xs font-black text-white">{item.reviewer}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-primary">
                        {item.signal}
                      </p>
                    </div>
                  </div>
                  <ReplayBadge count={item.replays} />
                </div>
              </div>

              {/* Hover Glow Accent */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* ── BOTTOM CTA ──────────────────────────────────── */}
        <div className="flex justify-center">
          <Link
            href="/movies"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-primary hover:border-primary hover:shadow-[0_15px_30px_-10px_rgba(229,9,20,0.5)] active:scale-95"
          >
            <MessageSquareQuote className="h-4 w-4" />
            Explore Community Reactions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

