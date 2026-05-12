"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Gift,
  Mail,
  PartyPopper,
  WalletCards,
  Star,
  Sparkles,
  ArrowRight,
  Check,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { title: "Pick a value", text: "Choose a gift amount for movie nights, premium access, or a watch-party surprise.", icon: WalletCards },
  { title: "Send the code", text: "Share a digital code with a friend, family member, or fellow film fan.", icon: Mail },
  { title: "Start watching", text: "The recipient signs in and uses the balance toward Cine-Tube access.", icon: PartyPopper },
];

const amounts = [15, 25, 50, 100];

const perks = [
  "No expiration date",
  "Redeem anytime",
  "Applies to any plan",
  "Stackable balances",
];

export default function GiftCardsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden px-6 pt-28 md:px-12 lg:px-20">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to top, #0b0b0b 6%, rgba(11,11,11,0.7) 50%, rgba(11,11,11,0.12)), url('https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2200&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#e50914]/20 to-transparent" />
        <div className="relative max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
              <Gift className="h-4 w-4" />
              Gift cards
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-black uppercase tracking-tighter md:text-7xl lg:text-8xl"
          >
            Give Someone Their
            <span className="block text-primary">Next Favorite Story</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300"
          >
            Give the magic of unlimited movies, live TV, and premium content. A Cine-Tube gift card unlocks endless entertainment for every taste.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button asChild variant="netflix" size="lg" className="rounded-2xl px-8 text-base font-black uppercase tracking-widest">
              <Link href="#amounts">Choose an amount</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/20 px-8 text-base font-semibold">
              <Link href="/pricing">View pricing <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Gift Card Amounts */}
      <section id="amounts" className="container mx-auto px-6 py-24 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">Choose your gift</p>
          <h2 className="text-3xl font-black uppercase tracking-tighter md:text-5xl">Pick the Perfect Amount</h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">Every gift card unlocks the full Cine-Tube experience.</p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {amounts.map((amount, i) => (
            <motion.article
              key={amount}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-white/10"
            >
              <motion.div
                initial={false}
                whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
              >
                <Gift className="mx-auto mb-4 h-8 w-8 text-primary/60 transition-colors group-hover:text-primary" />
              </motion.div>
              <div className="text-4xl font-black tracking-tighter">
                ${amount}
              </div>
              <p className="mt-2 text-sm text-zinc-500">Gift card</p>
              <div className="mt-4 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="netflix" size="sm" className="rounded-full text-xs font-bold uppercase tracking-widest">
                  Select <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Perks Strip */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 py-12 md:px-12 lg:px-20">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="h-4 w-4 text-primary" />
                {perk}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-24 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">Simple process</p>
          <h2 className="text-3xl font-black uppercase tracking-tighter md:text-5xl">How It Works</h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">Three easy steps to gift the joy of streaming.</p>
        </motion.div>

        <div className="relative mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {/* Connector line - only visible on md+ */}
          <div className="absolute left-1/2 top-16 hidden h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-black text-primary">
                    {i + 1}
                  </span>
                  <h3 className="text-xl font-black">{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">{step.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="border-t border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent">
        <div className="container mx-auto px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-xl font-medium leading-relaxed text-zinc-300 md:text-2xl">
                &ldquo;My best friend gifted me a Cine-Tube card and it was the best present ever. Binge-watched an entire season in one weekend.&rdquo;
              </blockquote>
              <div className="mt-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-black text-primary">
                    S
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Sarah M.</p>
                    <p className="text-xs text-zinc-500">Verified gift recipient</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-4 w-4" />
                Give the gift of stories
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter md:text-4xl">
                Ready to make <span className="text-primary">someone&apos;s</span> night?
              </h2>
              <p className="mt-4 text-zinc-400">
                A Cine-Tube gift card works on any plan. No hidden fees. No expiration.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild variant="netflix" size="lg" className="rounded-2xl px-8 text-base font-black uppercase tracking-widest">
                <Link href="#amounts">Buy a gift card</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/20 px-8 text-base font-semibold">
                <Link href="/pricing">Explore plans <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer decorative */}
      <div className="flex justify-center pb-8">
        <Heart className="h-4 w-4 text-primary/30" />
      </div>
    </main>
  );
}
