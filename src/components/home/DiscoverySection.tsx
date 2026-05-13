"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  ChevronDown,
  Clapperboard,
  Eye,
  Flame,
  Loader2,
  PlayCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  X,
  Zap,
  Ghost,
  Laugh,
  Heart,
  Gem
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GENRE_OPTIONS } from "@/lib/adminMovie.schemas";
import { useAutoBrowseToMovies } from "@/hooks/useAutoBrowseToMovies";
import { useDebounce } from "@/hooks/useDebounce";
import { searchMovies } from "@/services/movie.services";
import type { ApiResponse } from "@/types/api.types";
import type { Movie } from "@/types/movie.types";

type DiscoverySectionProps = {
  trendingMovies: Movie[];
  featuredMovies: Movie[];
  topRatedMovies: Movie[];
  newMovies: Movie[];
};

type MoodChip = {
  id: string;
  label: string;
  hint: string;
  searchTerm?: string;
  genre?: string;
  accent?: "red" | "amber" | "emerald" | "sky";
  icon?: any;
};

const ALL_GENRES_VALUE = "__ALL__";

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

const MOOD_CHIPS: MoodChip[] = [
  {
    id: "action",
    label: "Action",
    hint: "Make it explosive",
    genre: "Action",
    accent: "red",
    icon: Zap
  },
  {
    id: "thriller",
    label: "Thriller",
    hint: "Keep me tense",
    genre: "Thriller",
    accent: "red",
    icon: Ghost
  },
  {
    id: "comedy",
    label: "Comedy",
    hint: "Something easy",
    genre: "Comedy",
    accent: "sky",
    icon: Laugh
  },
  {
    id: "romance",
    label: "Romance",
    hint: "Hit the heart",
    genre: "Romance",
    accent: "emerald",
    icon: Heart
  },
  {
    id: "k-drama",
    label: "K-Drama",
    hint: "Emotional pull",
    genre: "K-Drama",
    accent: "emerald",
    icon: Sparkles
  },
  {
    id: "sci-fi",
    label: "Sci-Fi",
    hint: "Beyond reality",
    genre: "Sci-Fi",
    accent: "sky",
    icon: Flame
  },
];

const STARTER_PROMPTS = [
  "dark thriller",
  "short watch",
  "top rated",
  "free tonight",
];

const accentClasses: Record<NonNullable<MoodChip["accent"]>, string> = {
  red: "data-[active=true]:border-primary/60 data-[active=true]:bg-primary/15 data-[active=true]:text-white data-[active=true]:shadow-[0_0_28px_rgba(229,9,20,0.18)]",
  amber:
    "data-[active=true]:border-amber-400/50 data-[active=true]:bg-amber-400/10 data-[active=true]:text-amber-50 data-[active=true]:shadow-[0_0_28px_rgba(251,191,36,0.14)]",
  emerald:
    "data-[active=true]:border-emerald-400/50 data-[active=true]:bg-emerald-400/10 data-[active=true]:text-emerald-50 data-[active=true]:shadow-[0_0_28px_rgba(52,211,153,0.14)]",
  sky: "data-[active=true]:border-sky-400/50 data-[active=true]:bg-sky-400/10 data-[active=true]:text-sky-50 data-[active=true]:shadow-[0_0_28px_rgba(56,189,248,0.14)]",
};

function moviePoster(movie?: Movie | null) {
  return (
    movie?.posterUrl ||
    movie?.backdropUrl ||
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600"
  );
}

function formatAccess(movie: Movie) {
  if (movie.pricingType === "PREMIUM") return "Premium";
  if (movie.pricingType === "RENTAL") return "Rental";
  return "Free";
}

export function DiscoverySection({
  trendingMovies,
  featuredMovies,
  topRatedMovies,
  newMovies,
}: DiscoverySectionProps) {
  const router = useRouter();
  const [homeSearch, setHomeSearch] = useState("");
  const [homeGenre, setHomeGenre] = useState("");
  const [homeReleaseYear, setHomeReleaseYear] = useState("");
  const [homeStreamingPlatform, setHomeStreamingPlatform] = useState("");
  const [selectedMoodIds, setSelectedMoodIds] = useState<string[]>([]);
  const [isRefineOpen, setIsRefineOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const selectedMoods = useMemo(
    () => MOOD_CHIPS.filter((chip) => selectedMoodIds.includes(chip.id)),
    [selectedMoodIds],
  );

  const activeGenre =
    homeGenre || selectedMoods.find((chip) => chip.genre)?.genre || "";

  const debouncedHomeSearch = useDebounce(homeSearch, 450);
  const debouncedHomeReleaseYear = useDebounce(homeReleaseYear, 450);
  const debouncedHomeStreamingPlatform = useDebounce(
    homeStreamingPlatform,
    450,
  );
  const debouncedSuggestionSearch = useDebounce(homeSearch, 250);

  /* 
  useAutoBrowseToMovies({
    router,
    enabled: true,
    q: debouncedHomeSearch,
    genre: activeGenre,
    releaseYear: debouncedHomeReleaseYear,
    streamingPlatform: debouncedHomeStreamingPlatform,
  });
  */

  const suggestionQuery = useQuery<ApiResponse<Movie[]>>({
    queryKey: ["home-discovery-suggestions", debouncedSuggestionSearch],
    queryFn: () => searchMovies({ q: debouncedSuggestionSearch, limit: "6" }),
    enabled: isSearchFocused && debouncedSuggestionSearch.trim().length >= 2,
  });

  const suggestions = suggestionQuery.data?.data ?? [];
  const previewMovies = useMemo(() => {
    const pool = [
      ...trendingMovies,
      ...featuredMovies,
      ...topRatedMovies,
      ...newMovies,
    ];
    const seen = new Set<string>();
    const uniqueMovies = pool.filter((movie) => {
      if (!movie?.id || seen.has(movie.id)) return false;
      seen.add(movie.id);
      return true;
    });

    const moodTerms = selectedMoods
      .flatMap((chip) => [chip.genre, chip.searchTerm, chip.label])
      .filter(Boolean)
      .map((term) => term!.toLowerCase());

    const moodMatches =
      moodTerms.length === 0
        ? uniqueMovies
        : uniqueMovies.filter((movie) => {
            const searchable = [
              movie.title,
              movie.synopsis,
              movie.director,
              ...(movie.genres ?? []),
              ...(movie.tags ?? []),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            return moodTerms.some((term) => searchable.includes(term));
          });

    return (moodMatches.length ? moodMatches : uniqueMovies).slice(0, 5);
  }, [
    featuredMovies,
    newMovies,
    selectedMoods,
    topRatedMovies,
    trendingMovies,
  ]);

  function toggleMood(chip: MoodChip) {
    setSelectedMoodIds((current) => {
      const exists = current.includes(chip.id);
      return exists
        ? current.filter((id) => id !== chip.id)
        : [...current, chip.id];
    });
    if (chip.genre)
      setHomeGenre((current) =>
        current === chip.genre ? "" : chip.genre || "",
      );
  }

  function clearIntent(id?: string) {
    if (!id) {
      setSelectedMoodIds([]);
      setHomeGenre("");
      setHomeReleaseYear("");
      setHomeStreamingPlatform("");
      return;
    }
    const chip = MOOD_CHIPS.find((item) => item.id === id);
    setSelectedMoodIds((current) => current.filter((item) => item !== id));
    if (chip?.genre && homeGenre === chip.genre) setHomeGenre("");
  }

  function applyStarterPrompt(prompt: string) {
    setHomeSearch(prompt);
    setIsSearchFocused(true);
  }

  function submitSearch() {
    const query = homeSearch.trim();
    if (!query) return;
    router.push(`/movies?q=${encodeURIComponent(query)}`);
  }

  return (
    <section className="container mx-auto px-4 md:px-12 lg:px-20 relative">
      {/* Premium Dark-to-Light Transition */}
      <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#0b0b0b]/50 to-[#0b0b0b]" />
      
      {/* Enhanced Light-Back Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center w-full max-w-6xl">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-[2px] opacity-50" />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_35px_rgba(229,9,20,0.4)]" />
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b0b0b]/75 shadow-[0_32px_90px_-40px_rgba(0,0,0,0.88)] backdrop-blur-2xl mt-12 p-8 md:p-12 lg:p-16">
        <DiscoveryBackground movies={previewMovies} />

        <div className="relative z-10 space-y-12">
          <DiscoveryHeader />
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {GENRE_OPTIONS.map((genre, i) => {
              const bgImage = genreImages[genre] || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop";
              
              return (
                <motion.div
                  key={genre}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={`/movies?genre=${encodeURIComponent(genre)}&sortBy=createdAt&sortOrder=desc`}
                    className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
                  >
                    {/* Image Overlay */}
                    <div 
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `linear-gradient(to top, rgba(11,11,11,1) 0%, rgba(11,11,11,0.6) 50%, rgba(11,11,11,0.2) 100%), url('${bgImage}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    
                    {/* Content */}
                    <div className="relative p-6">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md transition-colors group-hover:bg-primary/20">
                        <Clapperboard className="h-4 w-4 text-primary" />
                      </div>
                      <h4 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-2xl font-normal tracking-wide text-white transition-transform duration-300 group-hover:translate-x-1">
                        {genre}
                      </h4>
                      
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        Explore <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function DiscoveryBackground({ movies }: { movies: Movie[] }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(11,11,11,0.86)_45%,rgba(11,11,11,0.98))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="absolute -right-14 -top-14 hidden rotate-6 gap-3 opacity-[0.14] blur-[0.7px] lg:flex">
        {movies.slice(0, 5).map((movie, index) => (
          <img
            key={movie.id}
            src={moviePoster(movie)}
            alt=""
            className={cn(
              "w-36 rounded-2xl object-cover shadow-black/40",
              index % 2 === 0 ? "h-56 translate-y-5" : "h-48",
            )}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.98),rgba(11,11,11,0.76)_56%,rgba(11,11,11,0.9))]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0b0b] to-transparent" />
    </div>
  );
}

function DiscoveryHeader() {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-[1px] w-8 bg-primary/50" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Cinematic Discovery</p>
      </div>
      <div className="space-y-4">
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal leading-[0.9] tracking-wider text-white md:text-7xl uppercase">
          Start with the <span className="text-primary">feeling</span>, <br /> find the film.
        </h2>
      </div>
    </div>
  );
}

function SmartSearch({
  value,
  onChange,
  onSubmit,
  isFocused,
  onFocusChange,
  suggestions,
  isLoading,
  hasSearched,
  previewMovies,
  onStarterPrompt,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isFocused: boolean;
  onFocusChange: (value: boolean) => void;
  suggestions: Movie[];
  isLoading: boolean;
  hasSearched: boolean;
  previewMovies: Movie[];
  onStarterPrompt: (prompt: string) => void;
}) {
  const showSuggestions = isFocused;

  return (
    <div className="relative">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className={cn(
          "group relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-black/45 shadow-[0_16px_50px_-30px_rgba(0,0,0,0.75)] transition-colors duration-300 md:rounded-[1.75rem]",
          isFocused &&
            "border-primary/40 bg-zinc-950/80 shadow-[0_16px_60px_-35px_rgba(229,9,20,0.28)]",
        )}
      >
        <div className="absolute inset-y-0 left-0 flex w-16 items-center justify-center text-zinc-500 transition-colors group-focus-within:text-primary">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => window.setTimeout(() => onFocusChange(false), 150)}
          placeholder="Try 'tense thriller', 'free tonight', or a movie title..."
          className="h-16 rounded-[1.55rem] border-0 bg-transparent pl-16 pr-24 text-base font-semibold text-white placeholder:text-zinc-500 focus-visible:ring-0 md:h-[4.75rem] md:rounded-[1.75rem] md:text-lg"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-14 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="submit"
          className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_0_18px_rgba(229,9,20,0.18)] transition hover:bg-[#ff1f1f] hover:shadow-[0_0_24px_rgba(229,9,20,0.28)]"
          aria-label="Search all movies"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <SuggestionDropdown
        isOpen={showSuggestions}
        query={value}
        suggestions={suggestions}
        isLoading={isLoading}
        hasSearched={hasSearched}
        previewMovies={previewMovies}
        onStarterPrompt={onStarterPrompt}
      />
    </div>
  );
}

function SuggestionDropdown({
  isOpen,
  query,
  suggestions,
  isLoading,
  hasSearched,
  previewMovies,
  onStarterPrompt,
}: {
  isOpen: boolean;
  query: string;
  suggestions: Movie[];
  isLoading: boolean;
  hasSearched: boolean;
  previewMovies: Movie[];
  onStarterPrompt: (prompt: string) => void;
}) {
  const topSuggestion = suggestions[0];
  const remainingSuggestions = suggestions.slice(1, 5);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-40 max-h-[min(72vh,620px)] overflow-y-auto rounded-[1.5rem] border border-white/10 bg-[#090909]/95 p-3 shadow-[0_24px_80px_-35px_rgba(0,0,0,0.82)] backdrop-blur-2xl"
        >
          <div className="mb-2 flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
            <span>
              {hasSearched ? "Instant matches" : "Tonight's starters"}
            </span>
            {query.trim() ? (
              <Link
                href={`/movies?q=${encodeURIComponent(query.trim())}`}
                className="text-primary transition hover:text-white"
              >
                Search all
              </Link>
            ) : null}
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-2"
                >
                  <Skeleton className="h-16 w-12 rounded-xl bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3 rounded bg-white/10" />
                    <Skeleton className="h-3 w-1/2 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="grid gap-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              {topSuggestion ? (
                <Link
                  href={`/movies/${topSuggestion.id}`}
                  className="group relative min-h-48 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.04]"
                >
                  <img
                    src={
                      topSuggestion.backdropUrl || moviePoster(topSuggestion)
                    }
                    alt={topSuggestion.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-103 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                      Top match
                    </span>
                    <p className="line-clamp-1 text-xl font-black tracking-tight text-white">
                      {topSuggestion.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-zinc-300">
                      <span>{topSuggestion.releaseYear}</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-700" />
                      <span>
                        {topSuggestion.averageRating?.toFixed(1) ?? "New"}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-white">
                        {formatAccess(topSuggestion)}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : null}

              <div className="grid gap-2">
                {remainingSuggestions.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    className="group flex items-center gap-3 rounded-2xl border border-transparent bg-white/[0.03] p-2 transition hover:border-primary/30 hover:bg-white/[0.07]"
                  >
                    <img
                      src={moviePoster(movie)}
                      alt={movie.title}
                      className="h-16 w-12 rounded-xl object-cover shadow-lg shadow-black/40"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-white group-hover:text-primary">
                        {movie.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-zinc-500">
                        <span>{movie.releaseYear}</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-700" />
                        <span>{movie.averageRating?.toFixed(1) ?? "New"}</span>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-zinc-300">
                          {formatAccess(movie)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-400">
              No exact match yet. Try a mood like{" "}
              <span className="text-white">dark thriller</span> or jump into
              top-rated picks.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-[1fr_1.15fr]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-black text-white">Not sure yet?</p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Start with a phrase instead of a title.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onStarterPrompt(prompt)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-zinc-300 transition hover:border-primary/40 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {previewMovies.slice(0, 3).map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    className="group relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
                  >
                    <img
                      src={moviePoster(movie)}
                      alt={movie.title}
                      className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-103 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <p className="absolute bottom-2 left-2 right-2 line-clamp-2 text-[11px] font-black leading-tight text-white">
                      {movie.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MoodChipRail({
  selectedMoodIds,
  onToggle,
}: {
  selectedMoodIds: string[];
  onToggle: (chip: MoodChip) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-3xl font-normal tracking-wider text-white uppercase">
          Select Your <span className="text-primary">Mood</span>
        </h3>
        <span className="hidden text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 sm:inline">
          Tonight&apos;s Pulse
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOOD_CHIPS.map((chip, i) => {
          const isActive = selectedMoodIds.includes(chip.id);
          const MoodIcon = chip.icon || Sparkles;
          const bgImage = genreImages[chip.label] || genreImages[chip.genre || ""] || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop";

          return (
            <motion.button
              key={chip.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              type="button"
              onClick={() => onToggle(chip)}
              className={cn(
                "group relative flex aspect-video flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-primary/40",
                isActive ? "border-primary/60 ring-1 ring-primary/40" : ""
              )}
            >
              {/* Image Overlay */}
              <div 
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(11,11,11,0.95) 0%, rgba(11,11,11,0.5) 60%, rgba(11,11,11,0.15) 100%), url('${bgImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {/* Content */}
              <div className="relative p-5 text-left">
                <div className={cn(
                  "mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md transition-colors",
                  isActive ? "bg-primary text-white" : "group-hover:bg-primary/20 text-primary"
                )}>
                  <MoodIcon className="h-5 w-5" />
                </div>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-2xl font-normal tracking-wide text-white transition-transform duration-300 group-hover:translate-x-1">
                  {chip.label}
                </h4>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {chip.hint}
                </p>
                
                <div className={cn(
                  "mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary transition-all duration-300",
                  isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                )}>
                  {isActive ? "Selected" : "Match Result"} <ArrowRight className="h-3 w-3" />
                </div>
              </div>

              {/* Hover Glow */}
              <div className={cn(
                "absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-opacity",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ActiveIntentBar({
  selectedMoods,
  genre,
  releaseYear,
  platform,
  onClearMood,
  onClearAll,
}: {
  selectedMoods: MoodChip[];
  genre: string;
  releaseYear: string;
  platform: string;
  onClearMood: (id: string) => void;
  onClearAll: () => void;
}) {
  const filterTokens = [
    genre && !selectedMoods.some((chip) => chip.genre === genre)
      ? { id: "genre", label: genre }
      : null,
    releaseYear ? { id: "year", label: releaseYear } : null,
    platform ? { id: "platform", label: platform } : null,
  ].filter(Boolean) as Array<{ id: string; label: string }>;

  if (selectedMoods.length === 0 && filterTokens.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/25 p-2">
      <span className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        Active intent
      </span>
      {selectedMoods.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onClearMood(chip.id)}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-primary/20"
        >
          {chip.label}
          <X className="h-3 w-3 text-zinc-400" />
        </button>
      ))}
      {filterTokens.map((token) => (
        <span
          key={token.id}
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-300"
        >
          {token.label}
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-auto rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-500 transition hover:text-white"
      >
        Clear
      </button>
    </div>
  );
}

function RefineFilters({
  isOpen,
  onToggle,
  genre,
  releaseYear,
  platform,
  onGenreChange,
  onReleaseYearChange,
  onPlatformChange,
}: {
  isOpen: boolean;
  onToggle: () => void;
  genre: string;
  releaseYear: string;
  platform: string;
  onGenreChange: (value: string) => void;
  onReleaseYearChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/[0.03]"
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-zinc-300">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-black text-white">
              Refine without breaking the mood
            </span>
            <span className="block text-xs text-zinc-500">
              Use precision filters only when the vibe needs a sharper edge.
            </span>
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-zinc-500 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                value={genre || ALL_GENRES_VALUE}
                onValueChange={(value) =>
                  onGenreChange(value === ALL_GENRES_VALUE ? "" : value)
                }
              >
                <SelectTrigger
                  aria-label="Genre"
                  className="h-12 rounded-2xl border-white/10 bg-black/30"
                >
                  <SelectValue placeholder="All genres" />
                </SelectTrigger>
                <SelectContent forceDown>
                  <SelectItem value={ALL_GENRES_VALUE}>All genres</SelectItem>
                  {GENRE_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                inputMode="numeric"
                value={releaseYear}
                onChange={(event) => onReleaseYearChange(event.target.value)}
                placeholder="Release year"
                className="h-12 rounded-2xl border-white/10 bg-black/30"
              />
              <Input
                value={platform}
                onChange={(event) => onPlatformChange(event.target.value)}
                placeholder="Streaming platform"
                className="h-12 rounded-2xl border-white/10 bg-black/30 sm:col-span-2 lg:col-span-1"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function LiveTrendingPanel({
  movies,
  activeMoods,
}: {
  movies: Movie[];
  activeMoods: MoodChip[];
}) {
  const leadMovie = movies[0];
  const pulseLabel = activeMoods.length
    ? `Tuned for ${activeMoods[0].label.toLowerCase()}`
    : "People are leaning into";

  return (
    <aside className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:min-h-full lg:p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_42%)]" />
      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              Discovery engine
            </p>
            <h3 className="mt-2 text-2xl font-black leading-none tracking-tighter text-white">
              {activeMoods.length ? `${activeMoods[0].label}` : "Tuned for You"}
            </h3>
          </div>
          <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            Matching
          </div>
        </div>

        {leadMovie ? (
          <Link
            href={`/movies/${leadMovie.id}`}
            className="group block overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 transition hover:border-primary/30"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={leadMovie.backdropUrl || moviePoster(leadMovie)}
                alt={leadMovie.title}
                className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-103 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                <PlayCircle className="h-3.5 w-3.5 text-primary" />
                Spotlight
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">
                  {pulseLabel}
                </p>
                <p className="line-clamp-1 text-lg font-black text-white">
                  {leadMovie.title}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-zinc-300">
                  <span>{leadMovie.releaseYear}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {leadMovie.averageRating?.toFixed(1) ?? "New"}
                  </span>
                  <span className="rounded-full bg-primary/80 px-2 py-1 text-white">
                    {formatAccess(leadMovie)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ) : null}

        <div className="space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMoods.map(m => m.id).join('-')}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {movies.slice(1, 4).map((movie, index) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-black/20 p-2 transition hover:border-primary/30 hover:bg-white/[0.06]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-xs font-black text-zinc-500 group-hover:text-primary">
                    {index + 2}
                  </div>
                  <img
                    src={moviePoster(movie)}
                    alt={movie.title}
                    className="h-14 w-10 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-white">
                      {movie.title}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-zinc-500">
                      {index === 0 ? (
                        <TrendingUp className="h-3 w-3 text-primary" />
                      ) : index === 1 ? (
                        <Eye className="h-3 w-3 text-primary" />
                      ) : (
                        <Clock3 className="h-3 w-3 text-primary" />
                      )}
                      {movie.views?.toLocaleString() ?? 0} views
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
          <SignalStat
            icon={Clapperboard}
            label="In this pulse"
            value={String(movies.length)}
          />
          <SignalStat
            icon={Star}
            label="Best score"
            value={movies[0]?.averageRating?.toFixed(1) ?? "New"}
          />
          <SignalStat icon={Sparkles} label="Mood picks" value="7" />
        </div>
      </div>
    </aside>
  );
}

function SignalStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clapperboard;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-3 transition hover:border-white/10 hover:bg-white/[0.035]">
      <Icon className="mb-3 h-4 w-4 text-primary" />
      <p className="text-lg font-black text-white">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
        {label}
      </p>
    </div>
  );
}
