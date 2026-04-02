"use client"

import { Movie } from "@/types/movie.types";
import { Star, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MovieCard({ movie }: { movie: Movie }) {
  const isPaid = movie.pricingType === "PREMIUM" || movie.pricingType === "RENTAL";
  const isRental = movie.pricingType === "RENTAL";

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "group relative aspect-[2/3] rounded-[2.5rem] overflow-hidden glass-morphism transition-all duration-500 shadow-2xl hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border-2",
        isPaid 
          ? "border-amber-500/20 hover:border-amber-500/80 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]" 
          : "border-white/5 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(229,9,20,0.3)]"
      )}
    >
      {/* Background Image */}
      <motion.img
        whileHover={{ scale: 1.12 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        src={movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600"}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-90 group-hover:opacity-100"
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent opacity-90 transition-opacity duration-500" />
      
      {/* Pricing Badge (Top Left) */}
      <div className="absolute top-6 left-0 z-20">
         <div className={cn(
           "px-4 py-1.5 rounded-r-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md border border-l-0",
           isPaid 
            ? "bg-gradient-to-r from-amber-600/90 to-amber-400/80 text-white border-amber-300/40" 
            : "bg-white/10 text-white/80 border-white/20"
         )}>
           {movie.pricingType || "FREE"}
         </div>
      </div>

      {/* Top Rating Badge */}
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 flex items-center bg-black/40 backdrop-blur-xl rounded-2xl px-3 py-2 border border-white/10 shadow-xl z-20"
      >
        <Star className={cn("w-3.5 h-3.5 mr-2", isPaid ? "text-amber-500 fill-amber-500" : "text-[#e50914] fill-[#e50914]")} />
        <span className="text-xs font-black text-white">{movie.averageRating?.toFixed(1) || "New"}</span>
      </motion.div>

      {/* Bottom Info Content */}
      <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-3 translate-y-20 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[0.33,1,0.68,1] z-20">
        <h3 className="font-black text-2xl leading-none text-white tracking-tighter drop-shadow-2xl text-shadow-glow line-clamp-2">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <span>{movie.releaseYear}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{movie.views?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Action Button - Dynamic based on Pricing */}
        <div className="mt-4">
          <Link href={movie.id ? `/movies/${movie.id}` : "#"} className="block">
            <Button 
              variant={isPaid ? "outline" : "netflix"} 
              className={cn(
                "w-full h-14 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all duration-300",
                isPaid 
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white" 
                  : ""
              )}
            >
              {isRental ? "Rent Now" : isPaid ? "Unlock Premium" : "Play Free"}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
