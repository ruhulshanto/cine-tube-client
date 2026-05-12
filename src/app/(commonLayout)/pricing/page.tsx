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
  Shield,
  Zap,
  Monitor,
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
      <section className="relative isolate overflow-hidden px-6 pb-6 pt-32 md:px-12 lg:px-20">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-40 top-40 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Pricing
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl lg:text-7xl">
            Choose the Access That Fits{" "}
            <span className="text-primary">Your Nights</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Start free, upgrade for premium titles, and keep your watchlist moving. No strings attached.
          </p>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="container mx-auto grid gap-5 px-6 pb-16 md:grid-cols-3 md:px-12 lg:px-20">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className={`group relative flex flex-col rounded-2xl border p-8 backdrop-blur-md transition-all duration-300 hover:shadow-xl ${
                plan.featured
                  ? "border-primary/40 bg-white/[0.08] hover:border-primary/60 hover:shadow-primary/10"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              {/* Badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white shadow-lg">
                    <Sparkles className="h-3 w-3" /> Most popular
                  </span>
                </div>
              )}
              {plan.badge && !plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300">
                    {plan.badge}
                  </span>
                </div>
              )}

              <Icon className={`mb-5 h-8 w-8 ${plan.featured ? "text-primary" : "text-primary/60"}`} />

              <h2 className="text-2xl font-black">{plan.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">{plan.note}</p>

              <div className="mt-6">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                {plan.period && (
                  <span className="ml-1 text-sm text-zinc-500">{plan.period}</span>
                )}
              </div>

              <ul className="mt-6 grow space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-zinc-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.featured ? "netflix" : "outline"}
                size="lg"
                className={`mt-8 w-full rounded-xl font-black uppercase tracking-widest ${
                  !plan.featured ? "border-white/20" : ""
                }`}
              >
                <Link href={plan.name === "Free" ? "/register" : "/register"}>
                  {plan.name === "Free" ? "Get started free" : "Subscribe"}
                </Link>
              </Button>
            </motion.article>
          );
        })}
      </section>

      {/* Feature Comparison Table */}
      <section className="container mx-auto px-6 py-16 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">Comparison</p>
          <h2 className="text-3xl font-black uppercase tracking-tighter md:text-4xl">See What&apos;s Included</h2>
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

      {/* Perks */}
      <section className="container mx-auto grid gap-6 px-6 pb-16 md:grid-cols-3 md:px-12 lg:px-20">
        {[
          { icon: Shield, title: "Cancel anytime", text: "No penalties. No questions. Your account stays until the period ends." },
          { icon: Zap, title: "Instant access", text: "Sign up and start streaming in under 60 seconds. No credit card required for Free." },
          { icon: Monitor, title: "Watch anywhere", text: "Phone, tablet, laptop, TV — your library goes wherever you do." },
        ].map((perk, i) => {
          const Icon = perk.icon;
          return (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white">{perk.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">{perk.text}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-6 pb-24 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-10 backdrop-blur-md md:p-16"
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-xl">
              <Sparkles className="mb-4 h-6 w-6 text-primary" />
              <h2 className="text-3xl font-black uppercase tracking-tighter md:text-4xl">
                Not sure yet?
              </h2>
              <p className="mt-4 text-zinc-400">
                Explore the catalog first and upgrade when premium calls. No commitment, no risk.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild variant="netflix" size="lg" className="rounded-2xl px-8 text-base font-black uppercase tracking-widest">
                <Link href="/register">Get started free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/20 px-8 text-base font-semibold">
                <Link href="/movies">Browse catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
