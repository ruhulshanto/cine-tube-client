"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Film, Sparkles, Target, Users, Zap, ArrowRight, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:px-12 lg:px-20">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[20s] scale-105"
          style={{
            backgroundImage:
              "linear-gradient(to top, #0b0b0b 5%, rgba(11,11,11,0.6) 40%, rgba(11,11,11,0.2)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2200&auto=format&fit=crop')",
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
              The Cine-Tube Story
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-6xl font-normal leading-[1.1] tracking-wider md:text-8xl lg:text-9xl"
          >
            A Home For <br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">Infinite Stories</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl md:leading-9"
          >
            We help viewers discover movies, shows, and live entertainment 
            through a fast, polished catalog experience designed for the modern era.
          </motion.p>
        </div>

        {/* Center bottom scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative container mx-auto px-6 py-32 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
        
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-primary">
              <Target className="h-4 w-4" />
              Our Core Purpose
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl uppercase">
              Make Great Viewing <span className="text-primary">Easier</span> To Choose
            </h2>
            <p className="mt-8 text-lg leading-8 text-zinc-400">
              We believe discovery should feel quick, cinematic, and personal. Our 
              mission is to bring the catalog, filters, reviews, and premium access 
              into one steady experience that helps every viewer move from browsing 
              to watching.
            </p>
            
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[
                { icon: Zap, title: "Speed", desc: "No more endless scrolling. Find what you love instantly." },
                { icon: Award, title: "Quality", desc: "Handpicked collections from global masterpieces." }
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
                  <item.icon className="mb-4 h-6 w-6 text-primary" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">{item.title}</h4>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative aspect-square overflow-hidden rounded-[3rem] border border-white/10"
          >
            <img 
              src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop" 
              alt="Cinematic Experience" 
              className="h-full w-full object-cover transition-transform duration-[10s] hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent opacity-60" />
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-white/[0.01] py-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <p className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-primary">Foundations</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl uppercase">What Drives Us</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Film, title: "Cinematic Pride", desc: "Every interface element is designed to respect the art of filmmaking." },
              { icon: Users, title: "Viewer First", desc: "Your experience, your mood, and your time are our top priorities." },
              { icon: Zap, title: "Global Access", desc: "Breaking regional barriers to bring stories from every corner of the world." }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl transition-all hover:bg-white/[0.06] hover:border-primary/40"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-colors group-hover:bg-primary/20">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="mb-4 text-2xl font-normal tracking-wide text-white uppercase">{value.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">{value.desc}</p>
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
              </motion.div>
            ))}
          </div>
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
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal tracking-wide md:text-7xl">
                Start Your <span className="text-primary">Journey</span> Now
              </h2>
              <p className="mt-6 text-base text-zinc-400 md:text-lg">
                The world of cinema is vast and ever-expanding. Join thousands of viewers 
                discovering their next favorite story today.
              </p>
            </div>
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="/movies">Browse Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
