"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Film, Star, Tag } from "lucide-react";
import { motion } from "framer-motion";

const merch = [
  { 
    name: "Logo Hoodie", 
    detail: "Heavyweight black fleece with Cine-Tube mark.", 
    price: "$55.00",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"
  },
  { 
    name: "Premiere Tee", 
    detail: "Soft cotton tee inspired by midnight screenings.", 
    price: "$32.00",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop"
  },
  { 
    name: "Collector Poster", 
    detail: "Minimalist wall print for the home theater corner.", 
    price: "$25.00",
    image: "https://m.media-amazon.com/images/I/712Ymw7p-4L.jpg"
  },
  { 
    name: "Watch Party Pass", 
    detail: "Giftable merch bundle for ultimate movie nights.", 
    price: "$85.00",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop"
  },
];

export default function MerchPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:px-12 lg:px-20">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[20s] scale-105"
          style={{
            backgroundImage:
              "linear-gradient(to top, #0b0b0b 5%, rgba(11,11,11,0.6) 40%, rgba(11,11,11,0.2)), url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2200&auto=format&fit=crop')",
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
              <ShoppingBag className="h-4 w-4" />
              Cine-Tube Originals
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-6xl font-normal leading-[1.1] tracking-wider md:text-8xl lg:text-9xl"
          >
            Wear The <br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">Watchlist</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl md:leading-9"
          >
            A curated collection of gear, gifts, and home cinema essentials 
            for the ultimate film lover.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-5"
          >
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="#store">Browse Store</Link>
            </Button>
          </motion.div>
        </div>

        {/* Center bottom scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Merch Grid */}
      <section id="store" className="relative container mx-auto px-6 py-32 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-primary">Storefront</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-normal tracking-wider md:text-6xl uppercase">Exclusive Gear</h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {merch.map((item, i) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all hover:bg-white/[0.06] hover:border-primary/40"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/80 via-transparent to-transparent opacity-60" />
                <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                  {item.price}
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-8">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-3xl font-normal tracking-wide text-white uppercase leading-tight">
                    {item.name}
                  </h3>
                  <Star className="h-4 w-4 text-primary shrink-0 mt-2" />
                </div>
                <p className="mb-8 text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {item.detail}
                </p>
                <Button className="mt-auto w-full rounded-2xl bg-white/5 font-black uppercase tracking-widest text-white transition-colors hover:bg-primary hover:text-white">
                  Add to Cart
                </Button>
              </div>
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
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
          
          <div className="relative flex flex-col items-center gap-8">
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.3em] text-primary">
                <Tag className="h-5 w-5" />
                Member Exclusive
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal tracking-wide md:text-7xl">
                Ready to <span className="text-primary">Gear Up</span>?
              </h2>
              <p className="mt-6 text-base text-zinc-400 md:text-lg">
                Our limited edition items drop seasonally. Sign in to your account 
                to access member-only pricing and early releases.
              </p>
            </div>
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="/movies">Go to Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
