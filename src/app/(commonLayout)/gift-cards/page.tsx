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
      <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:px-12 lg:px-20 lg:pt-32 lg:pb-32">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[10s] scale-110 animate-[pulse_20s_infinite]"
          style={{
            backgroundImage:
              "linear-gradient(to top, #0b0b0b 5%, rgba(11,11,11,0.6) 40%, rgba(11,11,11,0.2)), url('https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2200&auto=format&fit=crop')",
          }}
        />
        {/* Vignette overlays */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(11,11,11,0.8)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#e50914]/10 via-transparent to-[#0b0b0b]" />

        <div className="relative max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-6 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-primary">
              <Gift className="h-5 w-5" />
              Gift the Cinema Experience
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-5xl font-normal leading-[1.1] tracking-wider md:text-7xl lg:text-8xl"
          >
            Give Someone Their <br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(229,9,20,0.35)]">Next Favorite Story</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg md:leading-8"
          >
            Unlock the magic of unlimited movies, live TV, and exclusive premium content. 
            A Cine-Tube gift card is the ultimate backstage pass for every film lover.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-5"
          >
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-10 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)] hover:shadow-[0_0_50px_rgba(229,9,20,0.5)]">
              <Link href="#amounts">Choose an amount</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-full border-white/20 bg-white/5 px-10 text-base font-bold backdrop-blur-md hover:bg-white/10 hover:border-white/40">
              <Link href="/pricing" className="flex items-center">View plans <ArrowRight className="ml-3 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>

        {/* Center bottom pulse decoration */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Gift Card Amounts */}
      <section id="amounts" className="relative container mx-auto px-6 py-32 md:px-12 lg:px-20">
        {/* Subtle top separator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-primary">Instant Delivery</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl">Pick the Perfect Amount</h2>
          <p className="mx-auto mt-6 max-w-xl text-zinc-400">Choose a value that fits your budget. Every card unlocks the full experience.</p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {amounts.map((amount, i) => (
            <motion.article
              key={amount}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08]"
            >
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <motion.div
                initial={false}
                whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
              >
                <Gift className="mx-auto mb-6 h-10 w-10 text-primary/40 transition-colors group-hover:text-primary" />
              </motion.div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal tracking-tight text-white md:text-6xl">
                ${amount}
              </div>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors">Gift card</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Perks Strip */}
      <section className="relative overflow-hidden border-y border-white/5 bg-white/[0.02] py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                <Check className="h-4 w-4 text-primary" />
                {perk}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-32 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-primary">Simple process</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl">How It Works</h2>
          <p className="mx-auto mt-6 max-w-xl text-zinc-400">Gift the joy of cinematic streaming in three easy steps.</p>
        </motion.div>

        <div className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.08]"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="mb-5 flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-black text-primary">
                    {i + 1}
                  </span>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-2xl font-normal tracking-wide">{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">{step.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent py-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8 flex justify-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-2xl font-medium leading-relaxed text-zinc-200 md:text-3xl">
                &ldquo;My best friend gifted me a Cine-Tube card and it was the best present ever. Binge-watched an entire season in one weekend.&rdquo;
              </blockquote>
              <div className="mt-10">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-sm font-black text-primary">
                    S
                  </div>
                  <div className="text-left">
                    <p className="text-base font-black text-white">Sarah M.</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Verified Recipient</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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
                <Sparkles className="h-5 w-5" />
                Special Celebration
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal tracking-wide md:text-7xl">
                Ready to make <span className="text-primary">someone&apos;s</span> night?
              </h2>
              <p className="mt-6 text-base text-zinc-400 md:text-lg">
                A Cine-Tube gift card works on any plan. Instant delivery. No hidden fees. No expiration.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-4 sm:flex-row">
              <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest">
                <Link href="#amounts">Buy a gift card</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 rounded-full border-white/20 bg-white/5 px-12 text-base font-bold backdrop-blur-md">
                <Link href="/pricing" className="flex items-center">Explore plans <ArrowRight className="ml-3 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer decorative */}
      <div className="flex justify-center pb-12">
        <Heart className="h-5 w-5 text-primary/40 animate-pulse" />
      </div>
    </main>
  );
}
