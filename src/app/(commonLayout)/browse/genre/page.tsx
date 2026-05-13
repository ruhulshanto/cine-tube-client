"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GENRE_OPTIONS } from "@/lib/adminMovie.schemas";
import { Clapperboard, ArrowRight, Film } from "lucide-react";
import { motion } from "framer-motion";

const genreImages: Record<string, string> = {
  Action: "https://static0.moviewebimages.com/wordpress/wp-content/uploads/2022/07/Extraction-2020-Chris-Hemsworth.jpg?q=50&fit=crop&w=825&dpr=1.5",
  Adventure: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800&auto=format&fit=crop",
  Animation: "https://res.cloudinary.com/dtph8gqgi/image/upload/v1778009878/2GVAsO_fvcd3l.jpg",
  Comedy: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Crime: "https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Documentary: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=800&auto=format&fit=crop",
  Drama: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
  Fantasy: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
  Horror: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop",
  "K-Drama": "https://plus.unsplash.com/premium_photo-1723650939880-beafd49c1d63?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Mystery: "https://images.unsplash.com/photo-1587245767337-17e4011e8c90?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Romance: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Sci-Fi": "https://wallpaperaccess.com/full/535090.jpg",
  Thriller: "https://images.unsplash.com/photo-1633266841047-719b5f737149?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Western: "https://images.unsplash.com/photo-1624125278758-c0572f6ebc55?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function BrowseGenrePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:px-12 lg:px-20">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[20s] scale-105 animate-[pulse_30s_infinite]"
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
            <p className="mb-6 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-primary">
              Endless Categories
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-6xl font-normal leading-[1.1] tracking-wider md:text-8xl lg:text-9xl"
          >
            Pick a Mood, <br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">Start Watching</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl md:leading-9"
          >
            Explore our diverse collection organized by genre. Every category opens 
            a personalized view of the catalog designed for your current vibe.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-5"
          >
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)] hover:shadow-[0_0_50px_rgba(229,9,20,0.5)]">
              <Link href="#genres">Browse Genres</Link>
            </Button>
          </motion.div>
        </div>

        {/* Center bottom scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Genres Grid */}
      <section id="genres" className="relative container mx-auto px-6 py-32 md:px-12 lg:px-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-primary">Collections</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl uppercase">Our Movie Genres</h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {GENRE_OPTIONS.map((genre, i) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/movies?genre=${encodeURIComponent(genre)}&sortBy=createdAt&sortOrder=desc`}
                className="group relative flex aspect-video sm:aspect-square flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Image Overlay */}
                <div 
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0.4) 60%, rgba(11,11,11,0.1) 100%), url('${genreImages[genre] || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop"}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                
                {/* Content */}
                <div className="relative p-6">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md transition-colors group-hover:bg-primary/20">
                    <Clapperboard className="h-4 w-4 text-primary" />
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-2xl font-normal tracking-wide text-white transition-transform duration-300 group-hover:translate-x-1">
                    {genre}
                  </h3>
                  
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
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
                The Cinematic Horizon
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal tracking-wide md:text-7xl">
                Can&apos;t decide <span className="text-primary">what</span> to watch?
              </h2>
              <p className="mt-6 text-base text-zinc-400 md:text-lg">
                Sometimes the best stories are the ones you didn&apos;t know you were looking for. 
                Browse our entire library and let fate decide.
              </p>
            </div>
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="/movies">View Full Catalog</Link>
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
