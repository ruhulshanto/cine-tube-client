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
import type { Movie } from "@/types/movie.types";

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
  const continueWatching = uniqueMovies(
    trendingMovies,
    featuredMovies,
    topRatedMovies,
  ).slice(0, 3);
  const hasContinueWatching = continueWatching.length > 0;

  return (
    <section className="relative -mt-4 space-y-10 overflow-hidden py-0 md:-mt-6 md:space-y-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#0b0b0b] via-[#0b0b0b]/86 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-72 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <QuickPicksRail
        movies={continueWatching}
        isLoading={trendingLoading || featuredLoading}
      />

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

function QuickPicksRail({
  movies,
  isLoading,
}: {
  movies: Movie[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <section className="container mx-auto px-6 md:px-12 lg:px-20">
        <Skeleton className="h-44 rounded-[1.75rem] bg-white/5" />
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 md:px-12 lg:px-20">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(229,9,20,0.08),transparent_40%),linear-gradient(90deg,rgba(255,255,255,0.02),transparent_60%)]" />
        <div className="relative grid gap-5 lg:grid-cols-[minmax(260px,0.42fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
              <Clock3 className="h-3.5 w-3.5" />
              Quick picks
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight tracking-tighter text-white md:text-3xl">
              Start with a few strong titles.
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Simple suggestions for the first step, without overpromising
              behavior.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {movies.slice(0, 3).map((movie) => (
              <QuickPickCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickPickCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className={cn(
        "group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35 outline-none transition duration-300 hover:-translate-y-[0.5px] hover:border-primary/35 hover:bg-white/[0.055] focus-visible:ring-2 focus-visible:ring-primary/35",
        interactiveCardClass,
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={backdrop(movie)}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-103 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
          Start here
        </div>
      </div>
      <div className="space-y-2 p-3">
        <p className="line-clamp-1 text-sm font-black text-white">
          {movie.title}
        </p>
        <p className="text-xs leading-5 text-zinc-400">
          {movie.releaseYear} • {accessLabel(movie)}
        </p>
      </div>
    </Link>
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

  return (
    <section className="space-y-7">
      <div className="container mx-auto flex items-end justify-between gap-5 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl space-y-2">
          <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            <Flame className="h-3.5 w-3.5 fill-current" />
            Trending now
          </p>
          <h2 className="text-4xl font-black leading-none tracking-tighter text-white md:text-5xl">
            Top 10 now
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-zinc-500">
            The most popular titles on CineTube, ranked for easy browsing.
          </p>
        </div>
        <ScrollControls targetRef={scrollerRef} />
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex snap-x gap-5 overflow-x-auto px-6 pb-7 pt-2 scrollbar-hide md:px-12 lg:px-20"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <RankedCardSkeleton key={index} />
              ))
            : movies
                .slice(0, 10)
                .map((movie, index) => (
                  <RankedMovieCard
                    key={movie.id}
                    movie={movie}
                    rank={index + 1}
                  />
                ))}
          <div className="min-w-8" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0b0b0b] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0b0b0b] to-transparent" />
      </div>
    </section>
  );
}

function RankedMovieCard({ movie, rank }: { movie: Movie; rank: number }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className={cn(
        "group relative flex min-w-[260px] snap-start items-end rounded-[1.6rem] md:min-w-[330px]",
        interactiveCardClass,
      )}
    >
      <span className="absolute -left-2 bottom-0 z-0 select-none text-[8.5rem] font-black leading-none tracking-tighter text-white/[0.055] transition group-hover:text-primary/15 md:text-[11rem]">
        {rank}
      </span>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="relative z-10 ml-12 aspect-[2/3] w-[210px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/40 transition group-focus-visible:border-primary/50 md:w-[245px]"
      >
        <img
          src={poster(movie)}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-103 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
          #{rank}
        </div>
        <BehaviorBadge
          label={rank <= 3 ? "Editor pick" : behaviorSignal(rank)}
        />
        <div className="absolute bottom-0 left-0 right-0 space-y-2 p-4">
          <p className="line-clamp-2 text-xl font-black leading-none tracking-tight text-white">
            {movie.title}
          </p>
          <MovieMeta movie={movie} />
        </div>
        <HoverAction />
      </motion.div>
    </Link>
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
    <section className="container mx-auto px-4 md:px-12 lg:px-20">
      <Link
        href={`/movies/${movie.id}`}
        className="group/spotlight block rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-[0_42px_120px_-60px_rgba(0,0,0,0.95)] md:min-h-[680px]">
          <img
            src={backdrop(movie)}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-[1200ms] group-hover/spotlight:scale-[1.025] group-hover/spotlight:opacity-65 group-focus-visible/spotlight:scale-[1.025] group-focus-visible/spotlight:opacity-65"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_18%,rgba(229,9,20,0.22),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.96),rgba(0,0,0,0.7)_48%,rgba(0,0,0,0.92)),linear-gradient(0deg,rgba(0,0,0,0.95),transparent_42%)] transition duration-700 group-hover/spotlight:opacity-95" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="absolute right-6 top-6 hidden rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-300 backdrop-blur-md md:inline-flex">
            Trailer preview ready
          </div>

          <div className="relative grid min-h-[620px] gap-8 p-5 md:min-h-[680px] md:p-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(330px,0.88fr)] lg:p-10">
            <div className="flex flex-col justify-end pb-2">
              <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Editor&apos;s Spotlight
              </p>

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <SpotlightPill>{accessLabel(movie)}</SpotlightPill>
                <SpotlightPill>{movie.releaseYear}</SpotlightPill>
                {movie.duration ? (
                  <SpotlightPill>{movie.duration} min</SpotlightPill>
                ) : null}
                <SpotlightPill>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {movie.averageRating?.toFixed(1) ?? "New"}
                </SpotlightPill>
              </div>

              <h2 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-tighter text-white md:text-6xl">
                {movie.title}
              </h2>

              <div className="mt-5 max-w-3xl border-l border-primary/50 pl-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
                  Why we picked this
                </p>
                <p className="mt-2 text-sm leading-7 text-zinc-300 md:text-base">
                  {movie.synopsis ||
                    "A confident centerpiece for the moment when browsing slows down and a title starts to feel worth committing to."}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/movies/${movie.id}`}
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-black text-black shadow-[0_18px_50px_-22px_rgba(255,255,255,0.9)] outline-none transition hover:scale-[1.02] hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Watch preview
                </Link>
                <Link
                  href="/movies"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-sm font-black text-white outline-none backdrop-blur-md transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary/35"
                >
                  Explore all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(229,9,20,0.6)]" />
                Hover or focus to brighten the preview stage.
              </p>
            </div>

            <div className="grid content-end gap-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/32 p-4 backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">
                  Curator note
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  A focused spotlight that gives the homepage a calm, confident
                  moment before the rest of the lineup.
                </p>
              </div>

              <div className="grid gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">
                  Popular with viewers like you
                </p>
                {supportMovies.slice(0, 3).map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/movies/${item.id}`}
                    onClick={(event) => event.stopPropagation()}
                    className={cn(
                      "group/support flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 p-2 backdrop-blur-md hover:border-primary/35 hover:bg-white/[0.07]",
                      interactiveCardClass,
                    )}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-xs font-black text-zinc-500 group-hover/support:text-primary">
                      {index + 1}
                    </span>
                    <img
                      src={poster(item)}
                      alt={item.title}
                      className="h-16 w-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-white">
                        {item.title}
                      </p>
                      <MovieMeta movie={item} compact />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
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
    <Link
      href={`/movies/${movie.id}`}
      className={cn(
        "group relative flex min-w-[300px] snap-start gap-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-3 transition duration-300 hover:-translate-y-[0.5px] hover:border-primary/35 hover:bg-white/[0.055] md:min-w-[380px]",
        interactiveCardClass,
      )}
    >
      <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-[1.15rem] bg-white/5">
        <img
          src={poster(movie)}
          alt={movie.title}
          className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-103 group-hover:opacity-100"
        />
      </div>
      <BehaviorBadge
        label={index < 3 ? "Editor pick" : behaviorSignal(index)}
        compact
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <p className="line-clamp-2 text-lg font-black leading-tight text-white">
            {movie.title}
          </p>
          <MovieMeta movie={movie} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <span>Strong ratings</span>
            <span className="text-zinc-300">{score}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-amber-300"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
      <HoverAction compact />
    </Link>
  );
}

function PosterShelfCard({ movie, index }: { movie: Movie; index: number }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className={cn(
        "group min-w-[190px] snap-start rounded-[1.6rem] md:min-w-[230px]",
        interactiveCardClass,
      )}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="relative aspect-[2/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-xl shadow-black/30 transition group-focus-visible:border-primary/50"
      >
        <img
          src={poster(movie)}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-103 group-hover:opacity-100"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/48 to-transparent" />
        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
          {index < 3 ? "Fresh drop" : accessLabel(movie)}
        </div>
        <BehaviorBadge
          label={index % 2 === 0 ? "New this week" : behaviorSignal(index)}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="line-clamp-2 text-lg font-black leading-tight text-white">
            {movie.title}
          </p>
          <MovieMeta movie={movie} compact />
        </div>
        <HoverAction />
      </motion.div>
    </Link>
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

function HoverAction({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "absolute right-3 top-3 flex translate-y-2 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
        compact && "right-4 top-4",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-white text-black shadow-xl",
          compact ? "h-8 w-8" : "h-9 w-9",
        )}
      >
        <Play className="h-4 w-4 fill-current" />
      </span>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md",
          compact ? "h-8 w-8" : "h-9 w-9",
        )}
      >
        <Plus className="h-4 w-4" />
      </span>
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
