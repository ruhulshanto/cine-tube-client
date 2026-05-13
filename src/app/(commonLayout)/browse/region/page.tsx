"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe2, MapPinned, Compass, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const regions = [
  { 
    name: "Hollywood", 
    tag: "Big-screen hits, franchises, and prestige drama",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
  },
  { 
    name: "Korea", 
    tag: "K-dramas, thrillers, romance, and web originals",
    image: "https://images.unsplash.com/photo-1583833008338-31a6657917ab?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    name: "Japan", 
    tag: "Anime, action, mystery, and festival favorites",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop"
  },
  { 
    name: "India", 
    tag: "Hindi, Bangla, Tamil, and Telugu crowd-pleasers",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop"
  },
  { 
    name: "Europe", 
    tag: "Crime stories, arthouse cinema, and bold originals",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop"
  },
  { 
    name: "Global", 
    tag: "Handpicked international titles from every shelf",
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800&auto=format&fit=crop"
  },
];

export default function BrowseRegionPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:px-12 lg:px-20">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[15s] scale-110 animate-[pulse_25s_infinite]"
          style={{
            backgroundImage:
              "linear-gradient(to top, #0b0b0b 5%, rgba(11,11,11,0.6) 40%, rgba(11,11,11,0.2)), url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2200&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#e50914]/10 via-transparent to-[#0b0b0b]" />

        <div className="relative max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-6 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-primary">
              <Globe2 className="h-5 w-5" />
              CineTube Without Borders
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-6xl font-normal leading-[1.1] tracking-wider md:text-8xl lg:text-9xl"
          >
            Stories From <br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">Everywhere</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl md:leading-9"
          >
            Travel the world through the lens of local creators. From Hollywood blockbusters 
            to Seoul&apos;s finest thrillers, the global stage is yours.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-5"
          >
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-10 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="#regions">Explore Shelves</Link>
            </Button>
          </motion.div>
        </div>

        {/* Center bottom pulse decoration */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Regions Grid */}
      <section id="regions" className="relative container mx-auto px-6 py-32 md:px-12 lg:px-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-primary">Discover</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl uppercase">Regional Collections</h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region, i) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                href={`/movies?streamingPlatform=&q=${encodeURIComponent(region.name)}`}
                className="group relative flex aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(11,11,11,0.95) 0%, rgba(11,11,11,0.4) 50%, rgba(11,11,11,0.2) 100%), url('${region.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                
                {/* Content */}
                <div className="relative flex w-full flex-col justify-end p-8">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md transition-colors group-hover:bg-primary/20">
                    <MapPinned className="h-5 w-5 text-primary" />
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-3xl font-normal tracking-wide text-white transition-transform duration-300 group-hover:translate-x-2">
                    {region.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {region.tag}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    Browse catalog <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

                {/* Top glow */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global CTA */}
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
                <Compass className="h-5 w-5" />
                The Full Horizon
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal tracking-wide md:text-7xl">
                Ready to explore <span className="text-primary">everything</span>?
              </h2>
              <p className="mt-6 text-base text-zinc-400 md:text-lg">
                Can&apos;t decide on a region? Browse our entire library of thousands of titles 
                across all genres and countries.
              </p>
            </div>
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="/movies">Explore All Titles</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Decorative footer */}
      <div className="flex justify-center pb-12">
        <Sparkles className="h-5 w-5 text-primary/40 animate-pulse" />
      </div>
    </main>
  );
}
