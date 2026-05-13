"use client";

import {
  Clapperboard,
  MessageCircle,
  Radio,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────── */
interface StatsSectionProps {
  totalMovies?: number;
  activeUsers?: number;
  reviewsCount?: number;
  subscriptionUsers?: number;
}

/* ─── Scroll-triggered animated counter ─────────────────────── */
function AnimatedValue({
  raw,
  formatted,
}: {
  raw: number;
  formatted: string;
}) {
  const [display, setDisplay] = useState("0");
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
          const step = Math.ceil(raw / 60);
          const timer = setInterval(() => {
            current += step;
            if (current >= raw) {
              setDisplay(formatted);
              clearInterval(timer);
            } else {
              setDisplay(current.toLocaleString());
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [raw, formatted]);

  return <span ref={ref}>{display}</span>;
}

/* ─── Scrolling ticker strip ─────────────────────────────────── */
const TICKER_ITEMS = [
  "18,400 viewers active now",
  "1,250 titles in catalog",
  "26,300 reviews posted",
  "6,200 premium subscribers",
  "4,800 watchlist adds today",
  "312 new arrivals this week",
  "98% uptime this quarter",
];

function Ticker() {
  // duplicate for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.07] py-2.5">
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#060606] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#060606] to-transparent" />

      <ul
        className="flex gap-0 whitespace-nowrap"
        style={{
          animation: "ticker-scroll 30s linear infinite",
        }}
      >
        {items.map((item, i) => (
          <li
            key={i}
            className="inline-flex items-center gap-3 px-6 text-[11px] font-bold uppercase tracking-widest text-zinc-500"
          >
            <span className="h-1 w-1 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export function StatsSection({
  totalMovies,
  activeUsers,
  reviewsCount,
  subscriptionUsers,
}: StatsSectionProps) {
  const raw = {
    active: activeUsers ?? 18400,
    titles: totalMovies ?? 1250,
    reviews: reviewsCount ?? 26300,
    premium: subscriptionUsers ?? 6200,
  };

  const activity = [
    {
      icon: Radio,
      label: "Viewer pulse",
      raw: raw.active,
      value: raw.active.toLocaleString(),
      note: "members browsing and watching across the platform",
    },
    {
      icon: Clapperboard,
      label: "Fresh releases",
      raw: raw.titles,
      value: raw.titles.toLocaleString(),
      note: "titles available for discovery and curation",
    },
    {
      icon: MessageCircle,
      label: "Reviews posted",
      raw: raw.reviews,
      value: raw.reviews.toLocaleString(),
      note: "community reactions shaping confidence",
    },
    {
      icon: Star,
      label: "Premium viewers",
      raw: raw.premium,
      value: raw.premium.toLocaleString(),
      note: "watching deeper collections and spotlight picks",
    },
  ];

  return (
    <section className="container mx-auto px-6 py-24 md:px-12 lg:px-20">
      <div className="space-y-20">
        {/* Heading Block */}
        <div className="flex flex-col items-center text-center space-y-6">
          <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            <TrendingUp className="h-4 w-4" />
            Live Ecosystem
          </p>

          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="max-w-4xl text-5xl font-normal leading-[0.9] tracking-wider text-white md:text-8xl uppercase">
            The library feels <span className="text-primary">active</span> because people keep moving through it.
          </h2>

          <div className="max-w-2xl border-l-2 border-primary/40 pl-6 text-center mx-auto">
             <p className="text-lg leading-relaxed text-zinc-500">
              Watch momentum, release depth, community reviews, and premium engagement — updated in real time for effortless discovery.
            </p>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activity.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.04]"
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary">
                      <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="mt-8 space-y-2">
                    <p className="text-4xl font-black tracking-tighter text-white tabular-nums lg:text-5xl">
                      <AnimatedValue raw={item.raw} formatted={item.value} />
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-primary transition-colors">
                      {item.label}
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                    {item.note}
                  </p>
                </div>

                {/* Subtle Hover Glow */}
                <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>

        {/* Live Signal Indicator */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-6 py-2.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Platform heartbeat — updated every 16ms
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

