"use client"

import { Movie } from "@/types/movie.types";
import { Play, Info, Star, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function HomeBillboard({ movie }: { movie: Movie }) {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[90vh] min-h-[700px] flex items-center overflow-hidden">
      {/* Background Cinematic Image - Pure Emotion */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src={movie.backdropUrl || movie.posterUrl || "https://images.unsplash.com/photo-1485846234645-a62644ef7467?q=80&w=2000"} 
          className="w-full h-full object-cover object-top opacity-80"
          alt={movie.title}
        />
        {/* Cinematic Netflix Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-full md:w-[60%] lg:w-[45%] bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="max-w-2xl lg:max-w-3xl space-y-6"
        >
          {/* Apple-style Premium Badge */}
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Film className="w-3.5 h-3.5 text-primary" />
            <span>Exclusive Premier</span>
          </div>

          <div className="space-y-4">
            {/* Rating Section */}
            <div className="flex items-center gap-4 text-xs font-bold text-white/70">
               <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-sm border border-green-500/30">
                 <Star className="w-3 h-3 fill-current" />
                 {movie.averageRating?.toFixed(1) || "New"}
               </span>
               <span>{movie.releaseYear}</span>
               <span className="px-2 py-0.5 border border-white/20 rounded-sm text-white/50">{movie.mediaType || "MOVIE"}</span>
               <span className="text-primary tracking-wider">{movie.genres?.[0]}</span>
            </div>

            {/* High-Impact Headline - Netflix Style (Responsive & Wrapped) */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white drop-shadow-2xl">
              {movie.title}
            </h1>

            {/* Synopsis - Limited to 3 lines */}
            <p className="text-base md:text-lg text-white/80 line-clamp-3 font-medium max-w-xl text-shadow-glow leading-relaxed">
              {movie.synopsis || "Witness the greatest cinematic event of the year. Stream it exclusively right here, right now, in stunning 4K Ultra HD."}
            </p>
          </div>

          {/* SaaS-Style Clean Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Link href={movie.id ? `/movies/${movie.id}` : "#"} prefetch={!!movie.id}>
              <Button variant="netflix" size="lg" className="h-12 md:h-14 px-8 md:px-10 rounded-xl font-bold text-base md:text-lg gap-3 shadow-[0_10px_40px_rgba(229,9,20,0.4)] hover:scale-105 transition-transform duration-300">
                <Play className="w-6 h-6 fill-current" /> 
                Play
              </Button>
            </Link>
            <Link href={movie.id ? `/movies/${movie.id}` : "#"} prefetch={!!movie.id}>
              <Button variant="outline" size="lg" className="h-12 md:h-14 px-8 md:px-10 rounded-xl font-bold text-base md:text-lg bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 gap-3 hover:scale-105 transition-transform duration-300">
                <Info className="w-6 h-6" /> 
                More Info
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Indicators */}
      <div className="absolute right-12 bottom-12 hidden lg:flex flex-col items-end gap-2 text-right opacity-30 select-none">
         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Interactive Billboard v4</span>
         <div className="w-48 h-px bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );
}
