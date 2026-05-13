"use client";

import { motion } from "framer-motion";
import { Compass, Heart, Users, ShieldCheck, ArrowRight, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const values = [
  {
    title: "Curated Discovery",
    desc: "We make it easier to find a title that fits the night, not just the algorithm. Our human-centric approach ensures you always find the soul in every story.",
    icon: Compass,
  },
  {
    title: "Creator Respect",
    desc: "Our platform is built around clear access, visible context, and responsible presentation. We celebrate the artists who bring these worlds to life.",
    icon: Heart,
  },
  {
    title: "Community Trust",
    desc: "Reviews, moderation, and account controls help keep the experience useful and human. We are building a space where cinema lovers feel at home.",
    icon: Users,
  },
];

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:px-12 lg:px-20">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[20s] scale-105"
          style={{
            backgroundImage:
              "linear-gradient(to top, #0b0b0b 5%, rgba(11,11,11,0.6) 40%, rgba(11,11,11,0.2)), url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2200&auto=format&fit=crop')",
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
              Our Foundations
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-6xl font-normal leading-[1.1] tracking-wider md:text-8xl lg:text-9xl"
          >
            Built On <br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">Core Values</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl md:leading-9"
          >
            Cine-Tube was born from a simple idea: that everyone deserves 
            access to stories that matter, delivered with the respect and 
            quality they deserve.
          </motion.p>
        </div>

        {/* Center bottom scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Values Grid */}
      <section className="relative container mx-auto px-6 py-32 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
        
        <div className="grid gap-12 md:grid-cols-3">
          {values.map((value, i) => (
            <motion.article
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl transition-all hover:bg-white/[0.06] hover:border-primary/40"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-colors group-hover:bg-primary/20">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="mb-4 text-3xl font-normal tracking-wide text-white uppercase">
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {value.desc}
              </p>
              
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
            </motion.article>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white/[0.01] py-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] overflow-hidden rounded-[3rem] border border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop" 
                alt="Cinema Philosophy" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-primary">
                <ShieldCheck className="h-4 w-4" />
                Our Commitment
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl uppercase">
                A Platform For <br /><span className="text-primary">True Cinema</span>
              </h2>
              <p className="mt-8 text-lg leading-8 text-zinc-400">
                We are more than just a streaming service. We are a digital sanctuary 
                for the art of film. By prioritizing quality over quantity and 
                human connection over algorithms, we ensure that every viewing 
                experience is meaningful.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center">
                  <Film className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-zinc-300">Infinite Stories. One Vision.</p>
              </div>
            </motion.div>
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
                Experience The <span className="text-primary">Difference</span>
              </h2>
              <p className="mt-6 text-base text-zinc-400 md:text-lg">
                Join a community that values cinematic excellence and discover 
                the catalog in a whole new light.
              </p>
            </div>
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="/movies">Explore Movies <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
