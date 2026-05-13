"use client";

import {
  Clapperboard,
  Film,
  Heart,
  History,
  Layers,
  Radar,
  SearchCheck,
  TrendingUp,
  Tv2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─── Feature cards ─────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Layers,
    label: "Streamlined Browsing",
    value: "Clean categories and fast navigation — no clutter, no confusion",
  },
  {
    icon: History,
    label: "Easy Return",
    value: "Jump back into any title exactly where you left off",
  },
  {
    icon: Heart,
    label: "Saved Picks",
    value: "Your watchlist stays front and center, always easy to find",
  },
  {
    icon: SearchCheck,
    label: "Relevant Search",
    value: "Results stay focused, concise, and instantly actionable",
  },
];

/* ─── Right-panel feed rows ─────────────────────────────────── */
const FEED = [
  {
    label: "Browse First",
    copy: "Move quickly between categories and top titles",
    badge: "Fast Access",
    icon: Clapperboard,
  },
  {
    label: "Start Watching",
    copy: "A few strong titles are only one tap away",
    badge: "Ready Now",
    icon: Tv2,
  },
  {
    label: "Fresh Arrivals",
    copy: "Recent releases stay visible in the lineup",
    badge: "New",
    icon: Film,
  },
  {
    label: "Trending Now",
    copy: "What the community is watching and rewatching",
    badge: "Trending",
    icon: TrendingUp,
  },
];

/* ─── Animated counter ──────────────────────────────────────── */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = Math.ceil(end / 55);
          const timer = setInterval(() => {
            current += step;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else setCount(current);
          }, 16);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export function FeaturesSection() {
  return (
    <section className="container mx-auto px-6 py-24 md:px-12 lg:px-20">
      {/* ── SECTION HEADER ──────────────────────────────────────── */}
      <div className="mb-20 flex flex-col items-center gap-4 text-center">
        <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_#e50914]" />
          Platform Philosophy
        </p>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="max-w-3xl text-5xl font-normal leading-none tracking-wider text-white md:text-7xl uppercase">
          Built for <span className="text-primary">Effortless</span> Discovery
        </h2>

        <p className="max-w-2xl text-base leading-8 text-zinc-500">
          A clean homepage, simple labels, and quick access to what matters.
          Find a movie in seconds — no extra clicks, no confusion.
        </p>
      </div>

      {/* ── MAIN FEATURES GRID ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.04] hover:shadow-[0_20px_50px_-20px_rgba(229,9,20,0.2)]"
          >
            {/* Hover Glow */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/30">
                <Icon className="h-6 w-6 text-primary" />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-black tracking-tight text-white">
                  {label}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── SUBTLE STATS BAR ───────────────────────────────────────────── */}
      <div className="mt-20 rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-8 md:p-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: 50000, suffix: "+", label: "Curated Titles" },
            { value: 120, suffix: "+", label: "Unique Genres" },
            { value: 4000, suffix: "+", label: "New Monthly" },
            { value: 99.9, suffix: "%", label: "Server Uptime" },
          ].map(({ value, suffix, label }) => (
            <div key={label} className="text-center md:text-left">
              <p className="text-3xl font-black tabular-nums text-white lg:text-4xl">
                <Counter end={value} suffix={suffix} />
              </p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
