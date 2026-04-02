"use client"

import { Movie } from "@/types/movie.types";
import { MovieCard } from "./MovieCard";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MovieCardSkeleton } from "./MovieCardSkeleton";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
}

export function MovieRow({ title, movies, isLoading }: MovieRowProps) {
  return (
    <section className="py-12 space-y-8 animate-in slide-in-from-bottom-8 duration-1000 ease-out">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Curated Collection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
            {title}
          </h2>
        </div>
        
        <Link 
          href="/movies" 
          className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#e50914] hover:text-white transition-all duration-300"
        >
          <span>Explore All</span>
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:translate-x-1 transition-all">
             <ChevronRight className="w-4 h-4 group-hover:text-white" />
          </div>
        </Link>
      </div>

      <div className="relative group/row">
        {/* Horizontal Scrolling Container - Netflix Style */}
        <div className="flex overflow-x-auto overflow-y-hidden gap-6 pb-12 px-6 md:px-12 lg:px-20 scrollbar-hide snap-x snap-mandatory scroll-smooth">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="min-w-[280px] md:min-w-[320px] lg:min-w-[360px] snap-start">
                <MovieCardSkeleton />
              </div>
            ))
          ) : (
            movies?.map((movie, index) => (
              <motion.div 
                key={movie.id || `movie-${index}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-[280px] md:min-w-[320px] lg:min-w-[360px] snap-start"
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))
          )}
          
          {/* Peek Placeholder for infinite feel */}
          <div className="min-w-[100px] pointer-events-none" />
        </div>

        {/* Cinematic Gradient Fade on edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0b0b0b] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0b0b0b] to-transparent pointer-events-none z-10" />
      </div>

      {/* Modern UI Divider - Subtle */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 opacity-5">
        <div className="h-px w-full bg-white" />
      </div>
    </section>
  );
}
