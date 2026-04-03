"use client"

import { useQuery } from "@tanstack/react-query";
import { getMovies } from "@/services/movie.services";
import { subscribeToPlan } from "@/services/payment.services";
import { getEditorsPicks, getFeatured } from "@/services/homeCurated.services";
import { useAuth } from "@/context/AuthContext";
import { HomeBillboard } from "@/components/movies/HomeBillboard";
import { MovieRow } from "@/components/movies/MovieRow";
import { MovieCardSkeleton } from "@/components/movies/MovieCardSkeleton";
import { GENRE_OPTIONS } from "@/lib/adminMovie.schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { FullScreenLoader } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoBrowseToMovies } from "@/hooks/useAutoBrowseToMovies";
import { buildPinnedTrending, pickFavoriteFirst } from "@/lib/home/pinnedTrending";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const ALL_GENRES_VALUE = "__ALL__";

  const [homeSearch, setHomeSearch] = useState("");
  const [homeGenre, setHomeGenre] = useState<string>("");
  const [homeReleaseYear, setHomeReleaseYear] = useState<string>("");
  const [homeStreamingPlatform, setHomeStreamingPlatform] = useState<string>("");
  const debouncedHomeSearch = useDebounce(homeSearch, 450);
  const debouncedHomeReleaseYear = useDebounce(homeReleaseYear, 450);
  const debouncedHomeStreamingPlatform = useDebounce(homeStreamingPlatform, 450);

  const [pricingBusy, setPricingBusy] = useState<false | "MONTHLY" | "YEARLY">(false);

  // Fetch Trending Movies (by views)
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => getMovies({ sortBy: "views", sortOrder: "desc", limit: "15" }),
  });

  // Fetch favorites separately so they can be pinned even if not in top-15 trending.
  const { data: favoriteSpiderData } = useQuery({
    queryKey: ["movies", "favorite", "spider-brand-day"],
    queryFn: () => getMovies({ searchTerm: "spider", limit: "50" }),
  });
  const { data: favoriteBrandData } = useQuery({
    queryKey: ["movies", "favorite", "brand-new-day"],
    queryFn: () => getMovies({ searchTerm: "brand new day", limit: "50" }),
  });

  // Fetch Top Rated Movies
  const { data: topRatedData, isLoading: topRatedLoading } = useQuery({
    queryKey: ["movies", "top-rated"],
    queryFn: () => getMovies({ sortBy: "averageRating", sortOrder: "desc", limit: "10" }),
  });

  // Fetch New Arrivals
  const { data: newData, isLoading: newLoading } = useQuery({
    queryKey: ["movies", "new"],
    queryFn: () => getMovies({ sortBy: "releaseYear", sortOrder: "desc", limit: "10" }),
  });

  // Admin-curated homepage sections
  const { data: featuredCuratedData, isLoading: featuredCuratedLoading } = useQuery({
    queryKey: ["home-curated", "featured"],
    queryFn: getFeatured,
  });

  const { data: editorsPicksData, isLoading: editorsPicksLoading } = useQuery({
    queryKey: ["home-curated", "editors-picks"],
    queryFn: getEditorsPicks,
  });

  // Action
  const { data: actionData, isLoading: actionLoading } = useQuery({
    queryKey: ["movies", "action"],
    queryFn: () => getMovies({ genre: "Action", limit: "10" }),
  });

  // Thriller
  const { data: thrillerData, isLoading: thrillerLoading } = useQuery({
    queryKey: ["movies", "thriller"],
    queryFn: () => getMovies({ genre: "Thriller", limit: "10" }),
  });

  // Drama
  const { data: dramaData, isLoading: dramaLoading } = useQuery({
    queryKey: ["movies", "drama"],
    queryFn: () => getMovies({ genre: "Drama", limit: "10" }),
  });

  // K-Drama
  const { data: kDramaData, isLoading: kDramaLoading } = useQuery({
    queryKey: ["movies", "k-drama"],
    queryFn: () => getMovies({ genre: "K-Drama", limit: "10" }),
  });

  // Romance
  const { data: romanceData, isLoading: romanceLoading } = useQuery({
    queryKey: ["movies", "romance"],
    queryFn: () => getMovies({ genre: "Romance", limit: "10" }),
  });

  // Comedy
  const { data: comedyData, isLoading: comedyLoading } = useQuery({
    queryKey: ["movies", "comedy"],
    queryFn: () => getMovies({ genre: "Comedy", limit: "10" }),
  });

  useAutoBrowseToMovies({
    router,
    // Avoid redirecting while auth is still hydrating to keep initial load stable.
    enabled: !authLoading,
    q: debouncedHomeSearch,
    genre: homeGenre,
    releaseYear: debouncedHomeReleaseYear,
    streamingPlatform: debouncedHomeStreamingPlatform,
  });

  const handleSubscribe = async (plan: "MONTHLY" | "YEARLY") => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
      return;
    }
    try {
      setPricingBusy(plan);
      const res: any = await subscribeToPlan(plan);
      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } finally {
      setPricingBusy(false);
    }
  };

  // --- Trending pinning rules ---
  // Keep the "favorite" title first in Trending Now, even if it isn't in the top-N trending slice.
  const favoriteFirst = pickFavoriteFirst([
    ...((favoriteSpiderData?.data as any[]) ?? []),
    ...((favoriteBrandData?.data as any[]) ?? []),
  ] as any);

  const { trendingMovies, billboardMovie } = buildPinnedTrending({
    trending: (trendingData?.data ?? []) as any,
    favoriteCandidate: favoriteFirst,
    alsoPin: [
      { matcher: (m: any) => (m?.title ?? "").toLowerCase().includes("shang-chi") || (m?.title ?? "").toLowerCase().includes("ten rings") },
      { matcher: (m: any) => (m?.title ?? "").toLowerCase().includes("titanic") || (m?.title ?? "").toLowerCase().includes("last journey") },
      { matcher: (m: any) => (m?.title ?? "").toLowerCase().includes("vincenzo") || (m?.title ?? "").toLowerCase().includes("journalist") },
    ],
  });

  const isPageLoading = trendingLoading || featuredCuratedLoading || topRatedLoading;

  if (isPageLoading) {
    return (
      <div className="bg-[#0b0b0b] min-h-screen pt-24">
        <FullScreenLoader label="Loading cinematic experiences..." />
      </div>
    );
  }

  return (
    <div className="bg-[#0b0b0b] min-h-screen">
      {/* 🚀 THE BILLBOARD: First Impression */}
      <HomeBillboard movie={billboardMovie!} />

      {/* 🎞️ MOVIE BROWSING: The Cinematic Journey */}
      <div className="relative z-20 -mt-24 space-y-4">
        {/* Search + filters */}
        <Card className="border-white/10 bg-zinc-950/45 backdrop-blur-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Title */}
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

              {/* Controls */}
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
                    onValueChange={(v) => setHomeGenre(v === ALL_GENRES_VALUE ? "" : v)}
                  >
                    <SelectTrigger aria-label="Genre">
                      <SelectValue placeholder="All genres" />
                    </SelectTrigger>
                    <SelectContent forceDown>
                      <SelectItem value={ALL_GENRES_VALUE}>All genres</SelectItem>
                      {GENRE_OPTIONS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
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

        {/* Row 1: Trending Now */}
        <MovieRow 
          title="Trending Now" 
          movies={trendingMovies} 
          isLoading={trendingLoading} 
        />

        {/* Row 1.5: Featured (admin curated) */}
        <MovieRow
          title="Featured"
          movies={
            featuredCuratedData?.data?.length ? featuredCuratedData.data : topRatedData?.data || []
          }
          isLoading={featuredCuratedLoading}
        />

        {/* Row 2: Action Packed */}
        <MovieRow 
          title="Action Packed" 
          movies={actionData?.data || []} 
          isLoading={actionLoading} 
        />

        {/* Row 3: Heart-Pounding Thrillers */}
        <MovieRow 
          title="Heart-Pounding Thrillers" 
          movies={thrillerData?.data || []} 
          isLoading={thrillerLoading} 
        />

        {/* Row 3.5: Editor's Picks */}
        <MovieRow 
          title="Editor’s Picks"
          movies={editorsPicksData?.data?.length ? editorsPicksData.data : topRatedData?.data || []} 
          isLoading={editorsPicksLoading} 
        />

        {/* Row 4: Masterpieces (Top Rated) */}
        <MovieRow 
          title="Top Rated This Week" 
          movies={topRatedData?.data || []} 
          isLoading={topRatedLoading} 
        />

        {/* Row 5: Dramatic Masterpieces */}
        <MovieRow 
          title="Dramatic Masterpieces" 
          movies={dramaData?.data || []} 
          isLoading={dramaLoading} 
        />

        {/* Row 6: K-Drama Sensations */}
        <MovieRow 
          title="K-Drama Sensations" 
          movies={kDramaData?.data || []} 
          isLoading={kDramaLoading} 
        />

        {/* Row 7: Romance Classics */}
        <MovieRow 
          title="Romantic Getaways" 
          movies={romanceData?.data || []} 
          isLoading={romanceLoading} 
        />

        {/* Row 8: Laugh Out Loud (Comedy) */}
        <MovieRow 
          title="Laugh Out Loud" 
          movies={comedyData?.data || []} 
          isLoading={comedyLoading} 
        />

        {/* Row 9: New Arrivals */}
        <MovieRow 
          title="Newly Added" 
          movies={newData?.data || []} 
          isLoading={newLoading} 
        />

        {/* Price cards */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-10">
          <div className="mb-8 space-y-3 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Pricing</p>
            <h3 className="text-3xl font-black tracking-tighter text-white">Pick your plan</h3>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Upgrade for unlimited premium movies and series. Cancel anytime.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-white/10 bg-zinc-950/40">
              <CardHeader>
                <CardTitle className="text-white">Free</CardTitle>
                <CardDescription className="text-zinc-400">Watch free titles anytime</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white">$0</div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
                    onClick={() => router.push("/movies")}
                  >
                    Browse free
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/25 bg-gradient-to-br from-primary/20 to-transparent">
              <CardHeader>
                <CardTitle className="text-white">Monthly</CardTitle>
                <CardDescription className="text-zinc-200/80">Full premium access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white">$9.99</div>
                <div className="mt-4">
                  <Button
                    variant="netflix"
                    disabled={pricingBusy === "MONTHLY" || authLoading}
                    className="w-full rounded-2xl font-black uppercase tracking-widest text-[10px]"
                    onClick={() => handleSubscribe("MONTHLY")}
                  >
                    {pricingBusy === "MONTHLY" ? "Processing…" : "Start monthly"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-950/40">
              <CardHeader>
                <CardTitle className="text-white">Yearly</CardTitle>
                <CardDescription className="text-zinc-400">Best value for power users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white">$99.99</div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200"
                    disabled={pricingBusy === "YEARLY" || authLoading}
                    onClick={() => handleSubscribe("YEARLY")}
                  >
                    {pricingBusy === "YEARLY" ? "Processing…" : "Start yearly"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Footer: Continue Exploration */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-24 text-center">
            <h3 className="text-zinc-600 font-black uppercase text-[10px] tracking-[1em] mb-4">Discover More</h3>
            <p className="text-white font-medium text-lg max-w-lg mx-auto opacity-40">
                Thousands of titles waiting for you. Start your next adventure.
            </p>
        </section>
      </div>
    </div>
  );
}
