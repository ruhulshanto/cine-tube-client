"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  MonitorPlay, 
  ArrowRight, 
  Film, 
  Layers, 
  Heart, 
  Fingerprint, 
  Laugh, 
  Calendar, 
  Globe 
} from "lucide-react";
import { motion } from "framer-motion";

const shelves = [
  { 
    title: "Limited Series", 
    desc: "Complete stories told in a single, high-impact season.", 
    icon: Layers 
  },
  { 
    title: "K-Drama Picks", 
    desc: "Top-tier emotional journeys from the world of Korean television.", 
    icon: Heart 
  },
  { 
    title: "Crime Chapters", 
    desc: "Deep dives into the darkest mysteries and procedural drama.", 
    icon: Fingerprint 
  },
  { 
    title: "Comedy Bites", 
    desc: "Short-form laughs and sitcom favorites for quick watching.", 
    icon: Laugh 
  },
  { 
    title: "Weekly Originals", 
    desc: "Exclusive productions updated every week for our members.", 
    icon: Calendar 
  },
  { 
    title: "Docu-Series", 
    desc: "Real-world stories captured with cinematic precision.", 
    icon: Globe 
  },
];

export default function WebShowsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:px-12 lg:px-20">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[20s] scale-105"
          style={{
            backgroundImage:
              "linear-gradient(to top, #0b0b0b 5%, rgba(11,11,11,0.6) 40%, rgba(11,11,11,0.2)), url('https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2200&auto=format&fit=crop')",
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
            <p className="mb-6 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-primary">
              <MonitorPlay className="h-4 w-4" />
              Serialized Excellence
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-6xl font-normal leading-[1.1] tracking-wider md:text-8xl lg:text-9xl"
          >
            Built For One <br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">More Episode</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl md:leading-9"
          >
            Browse serialized stories, short seasons, and streaming-first favorites 
            from our curated shelves. Your next binge-watch starts here.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-5"
          >
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)] hover:shadow-[0_0_50px_rgba(229,9,20,0.5)]">
              <Link href="#shelves">Browse Shelves</Link>
            </Button>
          </motion.div>
        </div>

        {/* Center bottom scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Shelves Grid */}
      <section id="shelves" className="relative container mx-auto px-6 py-32 md:px-12 lg:px-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-primary">Originals & Picks</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl uppercase">Serialized Stories</h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shelves.map((shelf, i) => {
            const Icon = shelf.icon;
            return (
              <motion.div
                key={shelf.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={`/movies?q=${encodeURIComponent(shelf.title)}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-10 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08]"
                >
                  {/* Icon with hover color transition */}
                  <div className="mb-10 flex h-16 w-16 items-center justify-start transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-10 w-10 text-white transition-colors duration-300 group-hover:text-primary" />
                  </div>

                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="mb-4 text-3xl font-normal tracking-wide text-white uppercase">
                    {shelf.title}
                  </h3>
                  
                  <p className="mb-10 text-sm leading-relaxed text-zinc-400">
                    {shelf.desc}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    Browse Shelf <ArrowRight className="h-3 w-3" />
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/20" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Global Explorer CTA */}
      <section className="container mx-auto px-6 pb-32 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-12 backdrop-blur-xl md:p-20 text-center"
        >
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/10 blur-[80px]" />
          
          <div className="relative flex flex-col items-center gap-8">
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.3em] text-primary">
                <Film className="h-5 w-5" />
                Streaming Universe
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal tracking-wide md:text-7xl">
                Ready for a <span className="text-primary">binge</span> session?
              </h2>
              <p className="mt-6 text-base text-zinc-400 md:text-lg">
                Discover our full range of web shows, series, and limited runs. 
                Filter by genre and rating to find your next obsession.
              </p>
            </div>
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="/movies">Explore All Content</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Decorative footer element */}
      <div className="flex justify-center pb-12">
        <Film className="h-5 w-5 text-primary/40 animate-pulse" />
      </div>
    </main>
  );
}
