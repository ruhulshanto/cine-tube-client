
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Volume2, VolumeX } from "lucide-react";
import { Movie } from "@/types/movie.types";
import { IoPlayOutline } from "react-icons/io5";  

interface HeroSectionProps {
  movie?: Movie | null;
  children?: ReactNode;
}

export function HeroSection({ movie, children }: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const backgroundImage =
    movie?.backdropUrl ||
    movie?.posterUrl ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000";
  const isVideo = !!movie?.trailerUrl && movie.trailerUrl.endsWith(".mp4");

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (!isMuted) {
        videoRef.current.play().catch(() => {
          videoRef.current?.pause();
        });
      }
    }
  }, [isMuted]);

  return (
    <section className="relative">
      <div className="relative -top-28 min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          {isVideo ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster={backgroundImage}
            >
              <source src={movie?.trailerUrl ?? undefined} type="video/mp4" />
            </video>
          ) : (
            <img
              src={backgroundImage}
              alt={movie?.title ?? "Hero background"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b]/30 via-transparent to-transparent" />
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 20, ease: "easeOut" }}
            className="absolute inset-0 bg-black/10"
          />
        </div>

        {children ? (
          <div className="absolute top-0 left-0 w-full z-50">{children}</div>
        ) : null}

        <div className="relative z-10 flex min-h-[calc(100vh+6.5rem)] translate-y-12 flex-col justify-center px-6 pb-28 pt-24 sm:translate-y-14 md:px-12 md:pb-32 md:pt-48 lg:translate-y-16 lg:px-20 lg:pb-36 lg:pt-24">
          <div className="max-w-3xl space-y-6">
             <motion.p
               initial={{ opacity: 0, y: 12 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.7, delay: 0.1 }}
               className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-white/10 transition-all duration-200 group"
             >
               CINE <IoPlayOutline className="ml-2 mr-2 h-4 w-4 text-white/90 transition-transform duration-300 group-hover:animate-pulse" /> STREAMING PLATFORM
             </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
            >
              {movie?.title ??
                "Premium Stories. Bigger Screens. Better Nights."}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl text-sm text-white/80 sm:text-base lg:text-lg"
            >
              {movie?.synopsis ||
                "Discover cinematic premieres, curated collections, and a bold streaming experience designed for movie lovers."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/login">
                <Button
                  variant="netflix"
                  size="lg"
                  className="rounded-full px-8 py-4"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Watching
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-4 text-white"
                >
                  Start Free Trial
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute right-6 top-[13.5rem] z-20 flex items-center gap-2 md:right-12 md:top-[14.5rem] lg:right-20">
          <button
            type="button"
            onClick={() => setIsMuted((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/60"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            {isMuted ? "Muted" : "Sound On"}
          </button>
        </div>
      </div>
    </section>
  );
}
