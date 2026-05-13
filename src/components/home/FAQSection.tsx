"use client";

import {
  CircleHelp,
  CreditCard,
  LogIn,
  MessageCircleQuestion,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";

/* ─── Data ───────────────────────────────────────────────────── */
const FAQS = [
  {
    id: "01",
    icon: LogIn,
    question: "Can I browse before creating an account?",
    answer:
      "Yes. Explore the full library first — create an account only when you want to save picks, write reviews, subscribe, rent, or resume watching across devices.",
    tag: "Getting started",
  },
  {
    id: "02",
    icon: ShieldCheck,
    question: "What unlocks with premium access?",
    answer:
      "Premium opens deeper collections, personalised recommendation rails, and eligible premium titles — while free browsing stays available to everyone, no card required.",
    tag: "Premium",
  },
  {
    id: "03",
    icon: CreditCard,
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Cancellation is available from account settings at any time. You keep full access through the end of your current billing period — no questions asked.",
    tag: "Billing",
  },
  {
    id: "04",
    icon: ShieldCheck,
    question: "Can I watch on multiple devices?",
    answer:
      "Yes, CineTube supports simultaneous streaming on up to 4 devices for premium members, and 2 devices for standard members. Your watchlist and progress sync instantly.",
    tag: "Device Support",
  },
  {
    id: "05",
    icon: CircleHelp,
    question: "Is there a download feature for offline viewing?",
    answer:
      "Currently, we focus on providing the highest quality streaming experience. Offline downloads are in our roadmap for the upcoming mobile app release.",
    tag: "Features",
  },
  {
    id: "06",
    icon: MessageCircleQuestion,
    question: "Do you offer student or family discounts?",
    answer:
      "We offer a highly competitive Family Plan that covers up to 6 members. Student verifications are processed through SheerID for an additional 40% discount.",
    tag: "Pricing",
  },
];

/* ─── Floating tag chips shown in the left panel ─────────────── */
const TAGS = ["Free browsing", "Premium picks", "Cancel anytime", "No lock-in", "Community reviews"];

/* ─── Single accordion item ──────────────────────────────────── */
function FAQItem({
  item,
  open,
  onToggle,
}: {
  item: (typeof FAQS)[number];
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        open
          ? "border-primary/35 bg-black/40 shadow-[0_0_40px_-20px_rgba(229,9,20,0.25)]"
          : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"
      }`}
    >
      {/* top accent line — visible only when open */}
      <span
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <button
        className="flex w-full items-center gap-4 px-5 py-5 text-left"
        onClick={onToggle}
        aria-expanded={open}
      >
        {/* number + icon stack */}
        <div className="relative shrink-0">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300 ${
              open
                ? "border-primary/40 bg-primary/10"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <Icon
              className={`h-5 w-5 transition-colors duration-300 ${
                open ? "text-primary" : "text-zinc-400"
              }`}
            />
          </div>
          {/* decorative index number */}
          <span className="absolute -right-1 -top-2 text-[9px] font-black tabular-nums text-zinc-700">
            {item.id}
          </span>
        </div>

        {/* question */}
        <div className="flex-1 min-w-0">
          <span
            className={`block text-sm font-bold leading-snug transition-colors duration-200 ${
              open ? "text-white" : "text-zinc-300 group-hover:text-white"
            }`}
          >
            {item.question}
          </span>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest transition-colors duration-200 ${
              open
                ? "bg-primary/10 text-primary"
                : "bg-white/5 text-zinc-600"
            }`}
          >
            {item.tag}
          </span>
        </div>

        {/* toggle indicator */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            open
              ? "border-primary/40 bg-primary/10 rotate-0"
              : "border-white/10 bg-white/[0.04]"
          }`}
        >
          {open ? (
            <X className="h-3.5 w-3.5 text-primary" />
          ) : (
            <span className="text-sm font-black text-zinc-500">+</span>
          )}
        </div>
      </button>

      {/* answer — animated height via grid trick */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 pl-20 text-sm leading-7 text-zinc-400">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="container mx-auto px-6 py-32 md:px-12 lg:px-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-[0_32px_80px_-50px_rgba(0,0,0,0.9)]">

        {/* top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* ambient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_80%,rgba(229,9,20,0.07),transparent_36%),radial-gradient(circle_at_88%_10%,rgba(255,255,255,0.04),transparent_30%)]" />

        <div className="relative grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">

          {/* ── LEFT PANEL ──────────────────────────────────────── */}
          <div className="flex flex-col justify-between gap-8 border-b border-white/[0.07] p-7 lg:border-b-0 lg:border-r lg:p-10">

            {/* label + heading */}
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                <MessageCircleQuestion className="h-4 w-4" />
                Support Center
              </p>

              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal leading-[0.9] tracking-wider text-white md:text-6xl lg:text-7xl uppercase">
                Quick answers <br />
                <span className="text-primary">before</span> you watch.
              </h2>

              <p className="max-w-md text-base leading-relaxed text-zinc-500">
                Everything here is about browsing, premium access, and the
                first steps into the CineTube universe.
              </p>
            </div>

            {/* floating tag chips */}
            <div className="flex flex-wrap gap-2.5">
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary ring-1 ring-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* decorative large question mark watermark */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -left-4 select-none text-[160px] font-black leading-none text-white/[0.02] lg:text-[200px]"
            >
              ?
            </div>

            {/* help pill */}
            <div className="relative group/help inline-flex items-center gap-4 self-start rounded-[2rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-white/[0.04]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] group-hover/help:bg-primary/10 transition-colors">
                <CircleHelp className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  Still have questions?
                </p>
                <p className="text-[10px] font-bold text-zinc-500">
                  Our library speaks for itself.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL — accordion ─────────────────────────── */}
          <div className="flex flex-col gap-3.5 p-7 lg:p-10">

            {/* progress indicator */}
            <div className="mb-2 flex items-center gap-2">
              {FAQS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    openIdx === i
                      ? "w-8 bg-primary"
                      : "w-4 bg-white/10 hover:bg-white/20"
                  }`}
                  aria-label={`Go to question ${i + 1}`}
                />
              ))}
            </div>

            {FAQS.map((item, i) => (
              <FAQItem
                key={item.id}
                item={item}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}

            {/* bottom note */}
            <p className="mt-2 text-center text-[11px] leading-5 text-zinc-700">
              {FAQS.length} questions · answers written for first-time visitors
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
