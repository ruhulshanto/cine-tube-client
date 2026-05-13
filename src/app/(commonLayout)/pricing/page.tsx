"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Check,
  Crown,
  Play,
  Sparkles,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  Monitor,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    note: "Browse and watch free titles",
    features: ["Free catalog access", "Search and filters", "Community reviews"],
    icon: Play,
  },
  {
    name: "Monthly",
    price: "$9.99",
    period: "/month",
    note: "Premium access with flexible billing",
    features: ["Premium movies", "Live entertainment", "Cancel anytime", "HD streaming", "No ads"],
    icon: Crown,
    featured: true,
  },
  {
    name: "Yearly",
    price: "$99.99",
    period: "/year",
    note: "Best value for regular viewers",
    features: [
      "All monthly features",
      "2 months free vs monthly",
      "Priority releases",
      "4K Ultra HD",
      "Family sharing (up to 4)",
    ],
    icon: Star,
    badge: "Best value",
  },
];

const compareFeatures = [
  { label: "Catalog access", free: "Limited", monthly: "Full", yearly: "Full" },
  { label: "HD streaming", free: "—", monthly: "✓", yearly: "✓" },
  { label: "4K Ultra HD", free: "—", monthly: "—", yearly: "✓" },
  { label: "Live TV", free: "—", monthly: "✓", yearly: "✓" },
  { label: "No ads", free: "—", monthly: "✓", yearly: "✓" },
  { label: "Family sharing", free: "—", monthly: "—", yearly: "Up to 4" },
  { label: "Priority releases", free: "—", monthly: "—", yearly: "✓" },
  { label: "Cancel anytime", free: "—", monthly: "✓", yearly: "✓" },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:px-12 lg:px-20 lg:pt-32 lg:pb-32">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[12s] scale-105 animate-[pulse_24s_infinite]"
          style={{
            backgroundImage:
              "linear-gradient(to top, #0b0b0b 5%, rgba(11,11,11,0.6) 40%, rgba(11,11,11,0.2)), url('https://res.cloudinary.com/dtph8gqgi/image/upload/v1778621304/pricing2_bl11ua.jpg')",
          }}
        />
        {/* Vignette overlays */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(48, 48, 48, 0)_0%,rgba(11,11,11,0.9)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-[#0b0b0b]" />
        

        <div className="relative max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-6 text-xs font-black uppercase tracking-[0.4em] text-primary">
              Simple, Honest Pricing
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-5xl font-normal leading-[1.1] tracking-wider md:text-7xl lg:text-8xl"
          >
            Choose the Access That Fits <br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(229,9,20,0.35)]">Your Nights</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg md:leading-8"
          >
            Start free, upgrade for premium titles, and keep your watchlist moving. 
            No hidden fees, no strings attached. Just unlimited stories.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-5"
          >
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)] hover:shadow-[0_0_50px_rgba(229,9,20,0.5)]">
              <Link href="#plans">Compare plans</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-full border-white/20 bg-white/5 px-10 text-base font-bold backdrop-blur-md hover:bg-white/10 hover:border-white/40">
              <Link href="/register">Get started free</Link>
            </Button>
          </motion.div>
        </div>

        {/* Center bottom pulse decoration */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="relative container mx-auto px-6 py-32 md:px-12 lg:px-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`group relative flex flex-col rounded-[2.5rem] border p-10 backdrop-blur-xl transition-all duration-200 ${
                  plan.featured
                    ? "border-primary/40 bg-white/[0.08] shadow-2xl shadow-primary/5"
                    : "border-white/10 bg-white/[0.03] hover:border-white/30"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-white shadow-xl shadow-primary/20">
                      <Sparkles className="h-3 w-3" /> Most popular
                    </span>
                  </div>
                )}
                {plan.badge && !plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300 backdrop-blur-md">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200 ${plan.featured ? "bg-primary/20 scale-110 shadow-lg shadow-primary/10" : "bg-white/5"}`}>
                  <Icon className={`h-8 w-8 ${plan.featured ? "text-primary" : "text-zinc-500"}`} />
                </div>

                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-3xl font-normal tracking-wide text-white">{plan.name}</h2>
                <p className="mt-2 text-sm font-medium text-zinc-500">{plan.note}</p>

                <div className="mt-8 flex items-baseline gap-1">
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl font-normal tracking-tight text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm font-black uppercase tracking-widest text-zinc-600">{plan.period}</span>
                  )}
                </div>

                <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <ul className="grow space-y-4 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-4 text-zinc-400">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.featured ? "netflix" : "outline"}
                  size="lg"
                  className={`mt-10 h-14 w-full rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-200 ${
                    !plan.featured ? "border-white/20 hover:bg-white/10 hover:border-white/40" : "shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:shadow-[0_0_35px_rgba(229,9,20,0.5)]"
                  }`}
                >
                  <Link href="/register">
                    {plan.name === "Free" ? "Get started" : "Join now"}
                  </Link>
                </Button>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="container mx-auto px-6 py-32 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-[15px] font-black uppercase tracking-[0.28em] text-primary">Comparison</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl uppercase">See What&apos;s Included</h2>
        </motion.div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="px-6 py-4 font-semibold text-zinc-400">Feature</th>
                <th className="px-6 py-4 text-center font-semibold text-zinc-400">Free</th>
                <th className="px-6 py-4 text-center font-semibold text-primary">Monthly</th>
                <th className="px-6 py-4 text-center font-semibold text-zinc-400">Yearly</th>
              </tr>
            </thead>
            <tbody>
              {compareFeatures.map((feat, i) => (
                <tr key={feat.label} className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                  <td className="px-6 py-4 font-medium text-white">{feat.label}</td>
                  <td className="px-6 py-4 text-center text-zinc-500">{feat.free}</td>
                  <td className="px-6 py-4 text-center text-zinc-300">{feat.monthly}</td>
                  <td className="px-6 py-4 text-center text-zinc-300">{feat.yearly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Perks Grid */}
      <section className="container mx-auto grid gap-8 px-6 pb-32 md:grid-cols-3 md:px-12 lg:px-20">
        {[
          { icon: RotateCcw, title: "Cancel anytime", text: "No penalties. No long-term commitments. Your account stays active until the next billing date." },
          { icon: Zap, title: "Instant access", text: "Sign up and start watching in seconds. Access premium movies immediately after payment." },
          { icon: ShieldCheck, title: "Secure billing", text: "Phone, tablet, laptop, smart TV — CineTube works on all your favorite devices." },
        ].map((perk, i) => {
          const Icon = perk.icon;
          return (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-start gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-10 backdrop-blur-md transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{perk.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-zinc-500">{perk.text}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-6 pb-32 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-12 backdrop-blur-xl md:p-20 text-center"
        >
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/10 blur-[80px]" />
          
          <div className="relative flex flex-col items-center gap-10">
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.3em] text-primary">
                Start your journey
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal tracking-wide md:text-7xl">
                Ready to find <span className="text-primary">your next</span> story?
              </h2>
              <p className="mt-6 text-base text-zinc-400 md:text-lg">
                Join thousands of movie lovers. Start with a free plan and upgrade for the ultimate experience.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-4 sm:flex-row">
              <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
                <Link href="/register">Get started free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 rounded-full border-white/20 bg-white/5 px-12 text-base font-bold backdrop-blur-md">
                <Link href="/movies" className="flex items-center">Browse catalog <ArrowRight className="ml-3 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer decorative */}
      <div className="flex justify-center pb-12">
        <Star className="h-5 w-5 text-primary/40 animate-pulse" />
      </div>
    </main>
  );
}
