"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartHandshake, ShieldCheck, Lock, Globe, ArrowRight, Film } from "lucide-react";
import { motion } from "framer-motion";

const commitments = [
  {
    title: "Safer Access",
    desc: "Clear account states, moderated reviews, and premium prompts keep the experience predictable and secure for every user.",
    icon: ShieldCheck,
  },
  {
    title: "Responsible Cataloging",
    desc: "Titles are presented with helpful context and accurate metadata so viewers can choose with confidence and clarity.",
    icon: HeartHandshake,
  },
  {
    title: "Data Privacy",
    desc: "We prioritize your data security with end-to-end protection and transparent privacy controls across the entire platform.",
    icon: Lock,
  },
  {
    title: "Global Standards",
    desc: "Adhering to international broadcasting and streaming standards to ensure a high-quality experience for our global audience.",
    icon: Globe,
  },
];

export default function ResponsibilitiesPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:px-12 lg:px-20">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[20s] scale-105"
          style={{
            backgroundImage:
              "linear-gradient(to top, #0b0b0b 5%, rgba(11,11,11,0.6) 40%, rgba(11,11,11,0.2)), url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2200&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-[#0b0b0b]" />

        <div className="relative max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-6 text-xs font-black uppercase tracking-[0.4em] text-primary">
              Ethical Streaming
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-6xl font-normal leading-[1.1] tracking-wider md:text-8xl lg:text-9xl"
          >
            Built With <br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">True Care</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl md:leading-9"
          >
            We are committed to creating a responsible platform that empowers 
            viewers and protects creators through transparency and security.
          </motion.p>
        </div>

        {/* Center bottom scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Commitment Section */}
      <section className="relative container mx-auto px-6 py-32 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-primary">Our Promise</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl uppercase">The Cine-Tube Standard</h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl transition-all hover:bg-white/[0.06] hover:border-primary/40"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-colors group-hover:bg-primary/20">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="mb-4 text-2xl font-normal tracking-wide text-white uppercase">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {item.desc}
              </p>
              
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
            </motion.article>
          ))}
        </div>
      </section>

      {/* Global Explorer CTA */}
      <section className="container mx-auto px-6 py-32 md:px-12 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-12 backdrop-blur-xl md:p-20"
        >
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
          
          <div className="relative flex flex-col items-center gap-8">
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.3em] text-primary">
                <Film className="h-5 w-5" />
                Trusted Platform
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal tracking-wide md:text-7xl">
                Start Browsing <span className="text-primary">Responsibly</span>
              </h2>
              <p className="mt-6 text-base text-zinc-400 md:text-lg">
                Explore a library where safety, privacy, and quality are never 
                compromised. Your premium experience starts here.
              </p>
            </div>
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="/movies">Start Exploring <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
