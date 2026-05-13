
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Check, Loader2, Volume2, VolumeX, Apple } from "lucide-react";
import { Movie } from "@/types/movie.types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "@/services/interaction.services";
import { toast } from "sonner";

interface HeroSectionProps {
  movies?: Movie[];
  children?: ReactNode;
}

export function HeroSection({ movies = [], children }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const currentMovie = movies[currentIndex] || null;

  // Watchlist query — only runs when signed in
  const { data: watchlistResponse } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => getWatchlist(),
    enabled: !!isAuthenticated,
  });
  const watchlist = watchlistResponse?.data || [];
  const isInWatchlist = currentMovie
    ? watchlist.some((item: any) => item.movie?.id === currentMovie.id)
    : false;

  const { mutate: toggleWatchlist, isPending: watchlistPending } = useMutation({
    mutationFn: async () => {
      if (!currentMovie) return;
      if (isInWatchlist) return removeFromWatchlist(currentMovie.id);
      return addToWatchlist(currentMovie.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success(isInWatchlist ? "Removed from Watchlist" : "Added to Watchlist ✓");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Watchlist action failed");
    },
  });

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Sign in to save to your Watchlist");
      router.push("/login");
      return;
    }
    toggleWatchlist();
  };
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  const toggleMute = () => setIsMuted((prev) => !prev);

  // Cinematic Timing Logic: Image (2.5s) -> Video (10s) -> Next Slide
  useEffect(() => {
    if (movies.length <= 1) return;

    // 1. Reset trailer state for new slide
    setIsTrailerPlaying(false);

    // 2. Wait 2.5s then start trailer
    const trailerTimeout = setTimeout(() => {
      setIsTrailerPlaying(true);
    }, 2500);

    // 3. Wait total 12.5s (2.5s + 10s) then go to next slide
    const slideTimeout = setTimeout(() => {
      handleNext();
    }, 12500);

    return () => {
      clearTimeout(trailerTimeout);
      clearTimeout(slideTimeout);
    };
  }, [currentIndex, movies.length, handleNext]);

  // Auto-mute when scrolling away from hero
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If hero section is less than 15% visible, auto-mute
        if (!entry.isIntersecting || entry.intersectionRatio < 0.15) {
          setIsMuted(true);
        }
      },
      { threshold: [0, 0.15, 0.5] }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);


  if (!currentMovie && !movies.length) {
    return (
      <div className="relative h-[100vh] w-full bg-[#0b0b0b] animate-pulse" />
    );
  }

  return (
    <section ref={sectionRef} className="relative -top-28 w-full bg-black font-sans">
      <div className="relative h-[calc(100vh+4rem)] w-full overflow-hidden">
        {/* Background Video/Image System */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full"
            >
              <AnimatePresence mode="wait">
                {isTrailerPlaying && currentMovie?.trailerUrl?.endsWith(".mp4") ? (
                  <motion.video
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    src={currentMovie.trailerUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="h-full w-full object-cover scale-[1.02]"
                  />
                ) : (
                  <motion.img
                    key="image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    src={currentMovie?.backdropUrl || currentMovie?.posterUrl || ""}
                    alt={currentMovie?.title}
                    className="h-full w-full object-cover scale-[1.05]"
                  />
                )}
              </AnimatePresence>

              {/* Immersive Mixing Design Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent opacity-40" />
              <div className="absolute inset-0 bg-black/5" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Layer — Apple TV+ style: compact, low-left, tight spacing */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -100) handleNext();
            if (info.offset.x > 100) handlePrev();
          }}
          className="relative z-10 flex h-full w-full flex-col justify-end px-6 pb-10 pt-40 sm:px-10 md:pb-12 lg:px-16 xl:pb-14"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="max-w-[520px] space-y-2.5"
            >
              {/* Top Badge — compact pill like Apple TV */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md"
              >
                New on CineTube
              </motion.div>

              {/* Movie Title — max 2 lines, font preserved */}
              <h1
                style={{ fontFamily: "'Cooper Black', 'Alfa Slab One', serif" }}
                className="text-4xl font-bold leading-[0.9] tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-6xl xl:text-7xl line-clamp-2"
              >
                {currentMovie?.title}
              </h1>

              {/* Metadata Row — inline dots like Apple TV */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold text-white/55">
                <div className="flex items-center gap-1 text-white/80">
                  <Apple className="h-3 w-3 fill-current" />
                  <span className="text-white/80">Original</span>
                </div>
                <span className="text-white/30">·</span>
                <span>{currentMovie?.mediaType === "SERIES" ? "TV Show" : "Movie"}</span>
                <span className="text-white/30">·</span>
                <span>{currentMovie?.genres?.[0]}</span>
                <span className="ml-1 rounded border border-white/20 bg-white/10 px-1.5 py-px text-[9px] font-black tracking-widest text-white/70">
                  TV-MA
                </span>
              </div>

              {/* Description — small, tight, 2 lines max */}
              <p className="text-[13px] font-normal leading-snug text-white/55 line-clamp-2 sm:text-sm">
                {currentMovie?.synopsis}
              </p>

              {/* Rank — accent colored like Apple TV */}
              <p className="text-[12px] font-bold text-[#fa6400]">
                #1 in {currentMovie?.genres?.[0] || "Trending"} on CineTube
              </p>

              {/* CTA Buttons — compact row */}
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center gap-3">
                  {/* Accept Free Trial → goes to /movies filtered by FREE */}
                  <Button
                    asChild
                    className="h-11 rounded-full bg-white px-8 text-[14px] font-bold text-black transition-all hover:scale-105 hover:bg-white/90 active:scale-95"
                  >
                    <Link href="/movies?pricingType=FREE">
                      Accept Free Trial
                    </Link>
                  </Button>

                  {/* Watchlist Button — auth-guarded, redirects to /login if not signed in */}
                  <button
                    onClick={handleWatchlist}
                    disabled={watchlistPending}
                    title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-xl transition-all active:scale-90",
                      isInWatchlist
                        ? "border-primary/50 bg-primary/20 text-primary hover:bg-primary/30"
                        : "border-white/15 bg-white/10 text-white hover:bg-white/20"
                    )}
                    aria-label={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                  >
                    {watchlistPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isInWatchlist ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Pricing footnote */}
                <p className="text-[11px] font-medium text-white/35">
                  7 days free, then $12.99/month.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Pagination Dots at Bottom Center */}
        <div className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 translate-y-12">
          {movies.length > 1 && (
            <div className="flex items-center gap-2.5 rounded-full bg-black/40 px-5 py-2.5 backdrop-blur-2xl border border-white/5">
              {movies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-700 ease-in-out",
                    currentIndex === index
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mute Control - Bottom Right */}
        <div className="absolute bottom-16 right-6 z-20 sm:right-12 lg:right-20">
          <button
            onClick={toggleMute}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-2xl border border-white/5 transition-all hover:bg-white/20 active:scale-90"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-5 w-5 opacity-60" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Optional Overlay Children */}
      {children && (
        <div className="absolute top-0 left-0 w-full z-50">
          {children}
        </div>
      )}
    </section>
  );
}
