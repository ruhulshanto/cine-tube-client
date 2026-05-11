"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeroSection } from "@/components/shared/HeroSection";
import { MovieRow } from "@/components/movies/MovieRow";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoBrowseToMovies } from "@/hooks/useAutoBrowseToMovies";
import { GENRE_OPTIONS } from "@/lib/adminMovie.schemas";
import { FeaturesSection } from "./FeaturesSection";
import { StatsSection } from "./StatsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSection } from "./FAQSection";
import { CTASection } from "./CTASection";
import type { Movie } from "@/types/movie.types";

interface HomePageProps {
  billboardMovie?: Movie | null;
  trendingMovies: Movie[];
  featuredMovies: Movie[];
  topRatedMovies: Movie[];
  newMovies: Movie[];
  trendingLoading?: boolean;
  featuredLoading?: boolean;
  topRatedLoading?: boolean;
  newLoading?: boolean;
  stats: {
    totalMovies?: number;
    activeUsers?: number;
    reviewsCount?: number;
    subscriptionUsers?: number;
  };
}

const ALL_GENRES_VALUE = "__ALL__";

export default function HomePage({
  billboardMovie,
  trendingMovies,
  featuredMovies,
  topRatedMovies,
  newMovies,
  trendingLoading,
  featuredLoading,
  topRatedLoading,
  newLoading,
  stats,
}: HomePageProps) {
  const router = useRouter();
  const [homeSearch, setHomeSearch] = useState("");
  const [homeGenre, setHomeGenre] = useState<string>("");
  const [homeReleaseYear, setHomeReleaseYear] = useState<string>("");
  const [homeStreamingPlatform, setHomeStreamingPlatform] =
    useState<string>("");

  const debouncedHomeSearch = useDebounce(homeSearch, 450);
  const debouncedHomeReleaseYear = useDebounce(homeReleaseYear, 450);
  const debouncedHomeStreamingPlatform = useDebounce(
    homeStreamingPlatform,
    450,
  );

  useAutoBrowseToMovies({
    router,
    enabled: true,
    q: debouncedHomeSearch,
    genre: homeGenre,
    releaseYear: debouncedHomeReleaseYear,
    streamingPlatform: debouncedHomeStreamingPlatform,
  });

  return (
    <div className="bg-[#0b0b0b] text-white">
      <HeroSection movie={billboardMovie} />

      <div className="relative z-20 -mt-24 space-y-16">
        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <Card className="border-white/10 bg-zinc-950/45 backdrop-blur-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="mx-auto max-w-3xl space-y-1 text-center">
                  <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                    <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_20px_rgba(229,9,20,0.45)]" />
                    Search & filter
                  </p>
                  <h2 className="text-2xl font-black tracking-tighter text-white md:text-3xl">
                    Find your next favorite title
                  </h2>
                  <p className="text-sm text-zinc-400 md:text-base">
                    Search smarter with genre, year, and platform filters.
                  </p>
                </div>

                <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                    <Input
                      value={homeSearch}
                      onChange={(e) => setHomeSearch(e.target.value)}
                      placeholder="Search by title, genre, director…"
                      className="h-11 rounded-2xl border-white/10 bg-zinc-950/40 pl-4 pr-4 text-sm text-white focus-visible:bg-zinc-900/60 focus-visible:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Select
                      value={homeGenre || ALL_GENRES_VALUE}
                      onValueChange={(value) =>
                        setHomeGenre(value === ALL_GENRES_VALUE ? "" : value)
                      }
                    >
                      <SelectTrigger aria-label="Genre">
                        <SelectValue placeholder="All genres" />
                      </SelectTrigger>
                      <SelectContent forceDown>
                        <SelectItem value={ALL_GENRES_VALUE}>
                          All genres
                        </SelectItem>
                        {GENRE_OPTIONS.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={homeReleaseYear}
                      onChange={(e) => setHomeReleaseYear(e.target.value)}
                      placeholder="Year"
                      className="h-11 rounded-2xl border-white/10 bg-zinc-950/40 px-4 text-sm text-white focus-visible:bg-zinc-900/60 focus-visible:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      value={homeStreamingPlatform}
                      onChange={(e) => setHomeStreamingPlatform(e.target.value)}
                      placeholder="Platform"
                      className="h-11 rounded-2xl border-white/10 bg-zinc-950/40 px-4 text-sm text-white focus-visible:bg-zinc-900/60 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-20">
          <MovieRow
            title="Trending Now"
            movies={trendingMovies}
            isLoading={trendingLoading}
          />
          <MovieRow
            title="Featured Picks"
            movies={featuredMovies}
            isLoading={featuredLoading}
          />
          <MovieRow
            title="Top Rated This Week"
            movies={topRatedMovies}
            isLoading={topRatedLoading}
          />
          <MovieRow
            title="Newly Added"
            movies={newMovies}
            isLoading={newLoading}
          />
        </section>

        <FeaturesSection />
        <StatsSection {...stats} />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </div>
    </div>
  );
}
