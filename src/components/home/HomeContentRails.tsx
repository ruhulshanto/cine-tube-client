"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRef } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Eye,
  Flame,
  Play,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Movie, Watchlist } from "@/types/movie.types";
import { WatchlistButton } from "@/components/shared/WatchlistButton";
import { useQuery } from "@tanstack/react-query";
import { getWatchlist } from "@/services/interaction.services";
import { useAuth } from "@/hooks/useAuth";

type HomeContentRailsProps = {
  trendingMovies: Movie[];
  featuredMovies: Movie[];
  topRatedMovies: Movie[];
  newMovies: Movie[];
  trendingLoading?: boolean;
  featuredLoading?: boolean;
  topRatedLoading?: boolean;
  newLoading?: boolean;
};

const interactiveCardClass =
  "outline-none transition duration-300 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-0";

function poster(movie?: Movie | null) {
  return (
    movie?.posterUrl ||
    movie?.backdropUrl ||
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600"
  );
}

function backdrop(movie?: Movie | null) {
  return movie?.backdropUrl || movie?.posterUrl || poster(movie);
}

function accessLabel(movie: Movie) {
  if (movie.pricingType === "PREMIUM") return "Premium";
  if (movie.pricingType === "RENTAL") return "Rental";
  return "Free";
}

function uniqueMovies(...groups: Movie[][]) {
  const seen = new Set<string>();
  return groups.flat().filter((movie) => {
    if (!movie?.id || seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });
}

const behaviorSignals = [
  "Trending now",
  "Popular choice",
  "Editor pick",
  "New arrival",
];

function behaviorSignal(index: number) {
  return behaviorSignals[index % behaviorSignals.length];
}

export function HomeContentRails({
  trendingMovies,
  featuredMovies,
  topRatedMovies,
  newMovies,
  trendingLoading,
  featuredLoading,
  topRatedLoading,
  newLoading,
}: HomeContentRailsProps) {
  const spotlightMovie =
    featuredMovies[0] || trendingMovies[0] || topRatedMovies[0];
  const spotlightSupport = uniqueMovies(
    featuredMovies.slice(1),
    topRatedMovies,
    trendingMovies,
  ).slice(0, 4);
  const confidencePicks = uniqueMovies(
    topRatedMovies,
    featuredMovies,
    trendingMovies,
  ).slice(0, 10);
  const freshDrops = uniqueMovies(newMovies, trendingMovies).slice(0, 12);


  return (
    <section className="relative -mt-4 space-y-10 overflow-hidden py-0 md:-mt-6 md:space-y-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#0b0b0b] via-[#0b0b0b]/86 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-72 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />



      <RankedTrendingRail movies={trendingMovies} isLoading={trendingLoading} />

      <EditorialSpotlight
        movie={spotlightMovie}
        supportMovies={spotlightSupport}
        isLoading={featuredLoading}
      />

      <CuratedShelf
        eyebrow="Featured"
        title="Top rated"
        description="Strong, reliable titles chosen for a smoother browse."
        movies={confidencePicks}
        isLoading={topRatedLoading}
        variant="compact"
      />

      <CuratedShelf
        eyebrow="New arrivals"
        title="Fresh Drops"
        description="New titles added this week for easy discovery."
        movies={freshDrops}
        isLoading={newLoading}
        variant="poster"
      />
    </section>
  );
}



function RailHeader({
  eyebrow,
  title,
  description,
  action,
  align = "split",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "split" | "stacked";
}) {
  return (
    <div
      className={cn(
        "container mx-auto flex gap-5 px-6 md:px-12 lg:px-20",
        align === "split"
          ? "flex-col md:flex-row md:items-end md:justify-between"
          : "flex-col",
      )}
    >
      <div className="max-w-3xl space-y-2">
        <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(229,9,20,0.45)]" />
          {eyebrow}
        </p>
        <h2 className="text-3xl font-black leading-tight tracking-tighter text-white md:text-4xl">
          {title}
        </h2>
      </div>
      <div className="flex max-w-xl flex-col gap-3 md:items-end md:text-right">
        {description ? (
          <p className="text-sm leading-6 text-zinc-500">{description}</p>
        ) : null}
        {action}
      </div>
    </div>
  );
}

function ScrollControls({
  targetRef,
}: {
  targetRef: React.RefObject<HTMLDivElement | null>;
}) {
  function scrollBy(direction: "left" | "right") {
    targetRef.current?.scrollBy({
      left: direction === "left" ? -520 : 520,
      behavior: "smooth",
    });
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <button
        type="button"
        onClick={() => scrollBy("left")}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 backdrop-blur-xl transition hover:border-primary/40 hover:bg-primary/15 hover:text-white"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollBy("right")}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 backdrop-blur-xl transition hover:border-primary/40 hover:bg-primary/15 hover:text-white"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function RankedTrendingRail({
  movies,
  isLoading,
}: {
  movies: Movie[];
  isLoading?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const { data: watchlistResponse } = useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
    enabled: !!user,
  });

  // Match MovieHero: httpClient wraps response in { data: [] }
  const watchlist = watchlistResponse?.data || [];

  return (
    <section className="space-y-10 py-32 relative">
      {/* Cinematic Header Glow */}
      <div className="absolute top-0 left-0 h-[400px] w-[600px] -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(229,9,20,0.12),transparent_70%)] blur-3xl opacity-60" />
      
      <div className="container mx-auto flex items-end justify-between gap-5 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl space-y-3">
          <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_#e50914]" />
            Trending now
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal leading-none tracking-wider text-white md:text-7xl uppercase">
            Top 10 <span className="text-primary">Now</span>
          </h2>
          <p className="max-w-2xl text-base leading-7 text-zinc-500">
            The most popular titles on CineTube, ranked for easy browsing.
          </p>
        </div>
        <ScrollControls targetRef={scrollerRef} />
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex snap-x gap-8 overflow-x-auto px-6 pb-12 pt-2 scrollbar-hide md:px-12 lg:px-20"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <RankedCardSkeleton key={index} />
              ))
            : movies
                .slice(0, 10)
                .map((movie, index) => {
                  // Match MovieHero: item.movie?.id === movie.id
                  const isInWatchlist = watchlist.some((item: any) => item.movie?.id === movie.id);

                  return (
                    <RankedMovieCard
                      key={movie.id}
                      movie={movie}
                      rank={index + 1}
                      isInWatchlist={isInWatchlist}
                    />
                  );
                })}
          <div className="min-w-8" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0b0b0b] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0b0b0b] to-transparent" />
      </div>
    </section>
  );
}

function RankedMovieCard({ 
  movie, 
  rank, 
  isInWatchlist 
}: { 
  movie: Movie; 
  rank: number;
  isInWatchlist?: boolean;
}) {
  const isMedal = rank <= 3;

  return (
    <div className="group relative flex min-w-[340px] snap-start flex-col gap-0 md:min-w-[380px]">
      {/* Large Background Rank */}
      <span
        className={cn(
          "pointer-events-none absolute -top-6 left-2 z-0 select-none font-black leading-none tracking-tighter transition-all duration-700",
          "text-[7rem] md:text-[9rem]",
          isMedal
            ? "text-primary/25 group-hover:text-primary/40"
            : "text-white/[0.06] group-hover:text-white/10"
        )}
      >
        {rank}
      </span>

      {/* Poster Card */}
      <Link href={`/movies/${movie.id}`} className={cn("relative z-10 block", interactiveCardClass)}>
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02] ring-1 ring-white/5 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_32px_60px_-12px_rgba(229,9,20,0.15)]"
        >
          {/* Poster Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={backdrop(movie) || poster(movie)}
              alt={movie.title}
              className="h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

            {/* Top Row Badges */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-md",
                  isMedal
                    ? "border border-primary/40 bg-primary/20 text-primary shadow-[0_0_12px_rgba(229,9,20,0.3)]"
                    : "border border-white/10 bg-black/50 text-white/70"
                )}
              >
                {isMedal && <span className="text-[10px]">🏆</span>}
                #{rank}
              </span>
              {isMedal && (
                <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-amber-400 backdrop-blur-md">
                  Top Pick
                </span>
              )}
            </div>

            {/* Watchlist badge — always visible if saved */}
            {isInWatchlist && (
              <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-primary/40 bg-primary/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-primary backdrop-blur-md shadow-[0_0_14px_rgba(229,9,20,0.35)]">
                <CheckCircle2 className="h-3 w-3" />
                Saved
              </div>
            )}

            {/* Hover Play Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl">
                <Play className="h-6 w-6 fill-white text-white ml-1" />
              </div>
            </div>
          </div>

          {/* Info Strip */}
          <div className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-lg font-black leading-tight tracking-tight text-white">
                  {movie.title}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-zinc-500">
                  <span>{movie.releaseYear}</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-700" />
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {movie.averageRating?.toFixed(1) ?? "New"}
                  </span>
                  {movie.duration && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-zinc-700" />
                      <span>{movie.duration}m</span>
                    </>
                  )}
                </div>
              </div>
              <WatchlistButton
                movieId={movie.id}
                variant="minimal"
                className="shrink-0"
              />
            </div>

            {/* Genre Pills */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-zinc-500"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

function EditorialSpotlight({
  movie,
  supportMovies,
  isLoading,
}: {
  movie?: Movie | null;
  supportMovies: Movie[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <section className="container mx-auto px-6 md:px-12 lg:px-20">
        <Skeleton className="h-[520px] rounded-[2rem] bg-white/5" />
      </section>
    );
  }

  if (!movie) return null;

  return (
    <section className="container mx-auto px-4 py-5 md:px-12 lg:px-20">
      <div
        className="group/spotlight relative block rounded-[2.5rem] outline-none"
      >
        <div className="relative min-h-[500px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-black shadow-[0_42px_120px_-60px_rgba(0,0,0,0.95)] md:min-h-[580px]">
          {/* Background Image */}
          <img
            src={backdrop(movie)}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-[1200ms] group-hover/spotlight:scale-[1.03] group-hover/spotlight:opacity-70"
          />
          
          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(229,9,20,0.18),transparent_40%),linear-gradient(90deg,rgba(0,0,0,0.98),rgba(0,0,0,0.7)_50%,rgba(0,0,0,0.4)),linear-gradient(0deg,rgba(0,0,0,0.9),transparent_60%)]" />
          
          {/* Top Border Light */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Main Content */}
          <div className="relative flex h-full min-h-[500px] flex-col justify-center p-8 md:min-h-[580px] md:p-16 lg:p-20">
            <div className="max-w-2xl space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-primary shadow-[0_0_15px_rgba(229,9,20,0.2)]">  
                Featured Selection
              </p>

              <div className="space-y-4">
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl font-normal leading-none tracking-wider text-white md:text-8xl uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  {movie.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3">
                  <SpotlightPill>{accessLabel(movie)}</SpotlightPill>
                  <SpotlightPill>{movie.releaseYear}</SpotlightPill>
                  <SpotlightPill>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {movie.averageRating?.toFixed(1) ?? "New"}
                  </SpotlightPill>
                  {movie.duration ? (
                    <SpotlightPill>{movie.duration} min</SpotlightPill>
                  ) : null}
                </div>
              </div>

              <div className="border-l-2 border-primary/40 pl-6">
                <p className="max-w-xl text-lg leading-relaxed text-zinc-300 md:text-xl">
                  {movie.synopsis ||
                    "A masterpiece of its genre, carefully selected for viewers who demand cinematic excellence and emotional depth."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={`/movies/${movie.id}`}
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex h-14 items-center gap-3 rounded-full bg-primary px-10 text-base font-black uppercase tracking-widest text-white shadow-[0_15px_35px_-12px_rgba(229,9,20,0.5)] transition-all hover:scale-105 hover:bg-primary/90 active:scale-95"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Watch Now
                </Link>
                <Link
                  href="/movies"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex h-14 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 text-base font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
                >
                  Explore More
                </Link>
              </div>
            </div>
          </div>

          {/* Watchlist Integration for the spotlight movie */}
          <div className="absolute bottom-10 right-10 z-30">
            <WatchlistButton movieId={movie.id} className="h-14 w-14 border-white/20 bg-black/40" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SpotlightPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-zinc-200 backdrop-blur-md">
      {children}
    </span>
  );
}

function CuratedShelf({
  eyebrow,
  title,
  description,
  movies,
  isLoading,
  variant,
}: {
  eyebrow: string;
  title: string;
  description: string;
  movies: Movie[];
  isLoading?: boolean;
  variant: "compact" | "poster";
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="space-y-6">
      <RailHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={<ScrollControls targetRef={scrollerRef} />}
      />

      <div className="relative">
        <div
          ref={scrollerRef}
          className={cn(
            "flex snap-x overflow-x-auto px-6 pb-8 scrollbar-hide md:px-12 lg:px-20",
            variant === "compact" ? "gap-4" : "gap-5",
          )}
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <ShelfCardSkeleton key={index} variant={variant} />
              ))
            : movies.map((movie, index) =>
                variant === "compact" ? (
                  <CompactSignalCard
                    key={movie.id}
                    movie={movie}
                    index={index}
                  />
                ) : (
                  <PosterShelfCard key={movie.id} movie={movie} index={index} />
                ),
              )}
          <div className="min-w-8" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0b0b0b] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0b0b0b] to-transparent" />
      </div>
    </section>
  );
}

function CompactSignalCard({ movie, index }: { movie: Movie; index: number }) {
  const score = Math.min(98, 78 + ((index * 7) % 20));

  return (
    <div className="group relative min-w-[340px] snap-start md:min-w-[420px]">
      <Link href={`/movies/${movie.id}`} className={cn("block", interactiveCardClass)}>
        <motion.div
          whileHover={{ y: -8, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_40px_rgba(229,9,20,0.15)]"
        >
          {/* Backdrop Image */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={backdrop(movie)}
              alt={movie.title}
              className="h-full w-full object-cover opacity-85 transition duration-1000 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent" />
            
            {/* Hover Play Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-[0_0_30px_rgba(229,9,20,0.6)]">
                <Play className="h-6 w-6 fill-white text-white ml-1" />
              </div>
            </div>

            {/* Score Badge */}
            <div className="absolute left-4 top-4 rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary backdrop-blur-md">
              {score}% Rating
            </div>
          </div>

          {/* Info Strip */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="line-clamp-1 text-2xl font-normal tracking-wide text-white uppercase transition-colors group-hover:text-primary">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                  <span>{movie.releaseYear}</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-700" />
                  <span className="text-primary">{accessLabel(movie)}</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-700" />
                  <span>{movie.genres?.[0]}</span>
                </div>
              </div>
              <WatchlistButton movieId={movie.id} variant="minimal" className="h-10 w-10 border-white/10" />
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

function PosterShelfCard({ movie, index }: { movie: Movie; index: number }) {
  return (
    <div className="group relative min-w-[200px] snap-start md:min-w-[260px]">
      <Link href={`/movies/${movie.id}`} className={cn("block", interactiveCardClass)}>
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative aspect-[2/3] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_40px_rgba(229,9,20,0.2)]"
        >
          <img
            src={poster(movie)}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
          />
          
          {/* Top Gradient for Badge */}
          <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/80 to-transparent" />
          
          {/* Glassmorphic Bottom Panel */}
          <div className="absolute inset-x-0 bottom-0 p-5 pt-10 bg-gradient-to-t from-black via-black/90 to-transparent backdrop-blur-[2px]">
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="line-clamp-1 text-xl font-normal tracking-wide text-white uppercase transition-colors group-hover:text-primary">
              {movie.title}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                <span>{movie.releaseYear}</span>
                <span className="h-0.5 w-0.5 rounded-full bg-zinc-600" />
                <span className="flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  {movie.averageRating?.toFixed(1)}
                </span>
              </div>
              <WatchlistButton movieId={movie.id} variant="minimal" className="h-8 w-8" />
            </div>
          </div>

          {/* Hover Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <Play className="h-5 w-5 fill-white text-white ml-0.5" />
            </div>
          </div>

          <div className="absolute left-3 top-3">
             <span className="rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                {index < 3 ? "Fresh Drop" : accessLabel(movie)}
             </span>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

function BehaviorBadge({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "absolute right-3 rounded-full border border-white/10 bg-black/45 font-black uppercase tracking-widest text-zinc-200 backdrop-blur-md",
        compact
          ? "top-3 px-2 py-1 text-[9px]"
          : "top-14 px-2.5 py-1 text-[10px]",
      )}
    >
      {label}
    </span>
  );
}

function MovieMeta({
  movie,
  compact = false,
}: {
  movie: Movie;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "mt-2 flex flex-wrap items-center gap-2 font-bold text-zinc-400",
        compact ? "text-[10px]" : "text-[11px]",
      )}
    >
      <span>{movie.releaseYear}</span>
      <span className="h-1 w-1 rounded-full bg-zinc-700" />
      <span className="inline-flex items-center gap-1">
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
        {movie.averageRating?.toFixed(1) ?? "New"}
      </span>
      <span className="h-1 w-1 rounded-full bg-zinc-700" />
      <span>{accessLabel(movie)}</span>
      <span className="h-1 w-1 rounded-full bg-zinc-700" />
      <span className="inline-flex items-center gap-1">
        <Eye className="h-3 w-3 text-primary" />
        {compact
          ? shortNumber(movie.views ?? 0)
          : (movie.views?.toLocaleString() ?? 0)}
      </span>
    </div>
  );
}

function shortNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return value.toString();
}

function HoverAction({ compact = false, movieId }: { compact?: boolean; movieId?: string }) {
  return (
    <div
      className={cn(
        "absolute right-3 top-3 flex translate-y-2 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
        compact && "right-4 top-4",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform hover:scale-110",
          compact ? "h-8 w-8" : "h-9 w-9",
        )}
      >
        <Play className="h-4 w-4 fill-current" />
      </span>
      {movieId ? (
        <WatchlistButton movieId={movieId} className={cn(compact ? "h-8 w-8" : "h-9 w-9")} />
      ) : (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition-transform hover:scale-110",
            compact ? "h-8 w-8" : "h-9 w-9",
          )}
        >
          <Plus className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}

function RankedCardSkeleton() {
  return (
    <div className="flex min-w-[260px] items-end md:min-w-[330px]">
      <Skeleton className="ml-12 aspect-[2/3] w-[210px] rounded-[1.6rem] bg-white/5 md:w-[245px]" />
    </div>
  );
}

function ShelfCardSkeleton({ variant }: { variant: "compact" | "poster" }) {
  if (variant === "compact") {
    return (
      <div className="flex min-w-[300px] gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-3 md:min-w-[380px]">
        <Skeleton className="h-32 w-24 rounded-[1.15rem] bg-white/10" />
        <div className="flex-1 space-y-4 py-1">
          <Skeleton className="h-5 w-3/4 rounded bg-white/10" />
          <Skeleton className="h-4 w-1/2 rounded bg-white/5" />
          <Skeleton className="h-2 w-full rounded bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <Skeleton className="aspect-[2/3] min-w-[190px] rounded-[1.6rem] bg-white/5 md:min-w-[230px]" />
  );
}
