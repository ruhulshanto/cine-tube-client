"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMovies } from "@/services/movie.services";
import { MovieCard } from "@/components/movies/MovieCard";
import { SearchWithSuggestions } from "@/components/movies/SearchWithSuggestions";
import { MovieCardSkeleton } from "@/components/movies/MovieCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Search, Popcorn, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { GENRE_OPTIONS } from "@/lib/adminMovie.schemas";
import { publicSelectClass } from "@/lib/publicFormStyles";
import { PageSkeleton } from "@/components/shared/AppSkeletons";
const PAGE_SIZE = 10;

import { MoviesPagination } from "@/components/movies/MoviesPagination";

function MoviesPageSkeleton() {
  return <PageSkeleton variant="browse" />;
}

function MoviesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const qParam = searchParams.get("q") ?? "";
  const genreParam = searchParams.get("genre") ?? "";
  const minRatingParam = searchParams.get("minRating") ?? "";
  const releaseYearParam = searchParams.get("releaseYear") ?? "";
  const streamingPlatformParam = searchParams.get("streamingPlatform") ?? "";
  const sortByParam = searchParams.get("sortBy") ?? "createdAt";
  const sortOrderParam = searchParams.get("sortOrder") ?? "desc";

  const pageParam = searchParams.get("page") ?? "1";
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const [searchTerm, setSearchTerm] = useState(qParam);
  const [releaseYear, setReleaseYear] = useState(releaseYearParam);
  const [streamingPlatform, setStreamingPlatform] = useState(
    streamingPlatformParam,
  );

  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedReleaseYear = useDebounce(releaseYear, 350);
  const debouncedStreamingPlatform = useDebounce(streamingPlatform, 350);

  useEffect(() => {
    if (debouncedSearch !== qParam) {
      updateUrlFromBrowseState({ q: debouncedSearch, page: "1" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedReleaseYear !== releaseYearParam) {
      updateUrlFromBrowseState({
        releaseYear: debouncedReleaseYear,
        page: "1",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedReleaseYear]);

  useEffect(() => {
    if (debouncedStreamingPlatform !== streamingPlatformParam) {
      updateUrlFromBrowseState({
        streamingPlatform: debouncedStreamingPlatform,
        page: "1",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedStreamingPlatform]);

  const commitSearchToUrl = () => {
    const trimmed = searchTerm.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    params.set("page", "1");
    const qs = params.toString();
    // Only update if we are exactly on the movies catalog page
    if (window.location.pathname === "/movies") {
      router.replace(`/movies${qs ? `?${qs}` : ""}`, { scroll: false });
    }
  };

  const updateUrlFromBrowseState = (
    next: {
      q?: string;
      genre?: string;
      minRating?: string;
      releaseYear?: string;
      streamingPlatform?: string;
      sortBy?: string;
      sortOrder?: string;
      page?: string;
    } = {},
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.genre !== undefined) {
      if (next.genre) params.set("genre", next.genre);
      else params.delete("genre");
    }

    if (next.minRating !== undefined) {
      if (next.minRating) params.set("minRating", next.minRating);
      else params.delete("minRating");
    }

    if (next.releaseYear !== undefined) {
      if (next.releaseYear) params.set("releaseYear", next.releaseYear);
      else params.delete("releaseYear");
    }

    if (next.streamingPlatform !== undefined) {
      if (next.streamingPlatform)
        params.set("streamingPlatform", next.streamingPlatform);
      else params.delete("streamingPlatform");
    }

    if (next.sortBy !== undefined) {
      params.set("sortBy", next.sortBy);
    }

    if (next.sortOrder !== undefined) {
      params.set("sortOrder", next.sortOrder);
    }

    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }

    const nextPage = next.page ?? pageParam;
    params.set("page", nextPage);

    const qs = params.toString();
    // Only update if we are exactly on the movies catalog page
    if (window.location.pathname === "/movies") {
      router.replace(`/movies?${qs}`, { scroll: false });
    }
  };

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const targetPage = Math.max(1, Math.min(p, totalPages || 1));
    params.set("page", targetPage.toString());
    router.replace(`/movies?${params.toString()}`, { scroll: false });
  };

  const {
    data: response,
    isLoading,
    isFetching,
    isPlaceholderData,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "movies",
      currentPage,
      qParam,
      genreParam,
      minRatingParam,
      releaseYearParam,
      streamingPlatformParam,
      sortByParam,
      sortOrderParam,
    ],
    queryFn: () =>
      getMovies({
        page: currentPage.toString(),
        limit: PAGE_SIZE.toString(),
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
        ...(qParam.trim() ? { searchTerm: qParam.trim() } : {}),
        ...(genreParam ? { genre: genreParam } : {}),
        ...(minRatingParam ? { minRating: minRatingParam } : {}),
        ...(releaseYearParam ? { releaseYear: releaseYearParam } : {}),
        ...(streamingPlatformParam
          ? { streamingPlatform: streamingPlatformParam }
          : {}),
      }),
    placeholderData: keepPreviousData,
  });

  const movies = response?.data || [];
  const total = response?.meta?.total || 0;
  const totalPages = response?.meta?.totalPages || 0;

  const showSkeleton = isLoading && !isPlaceholderData;
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Please check your connection or try again.";

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      handlePageChange(totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  return (
    <div className="container mx-auto max-w-[1600px] px-6 py-12 md:px-12 lg:px-20 animate-in fade-in duration-700">
      <div className="mb-12 flex flex-col items-end justify-between gap-8 border-b border-white/5 pb-8 md:flex-row">
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white text-shadow-glow md:text-6xl">
            Explore All{" "}
            <span className="text-primary tracking-normal">Films</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-zinc-400">
            Discover your next favorite story. Browse the catalog page by page
            or search by title, genre, or director.
          </p>
          {!showSkeleton && total > 0 && (
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              {total} {total === 1 ? "title" : "titles"} in catalog
            </p>
          )}
        </div>

        <div id="movies-page-search" className="w-full md:w-[450px]">
          <SearchWithSuggestions
            initialValue={searchTerm}
            onChange={(q) => setSearchTerm(q)}
            onSearch={(q) => {
              setSearchTerm(q);
              commitSearchToUrl();
            }}
            placeholder="Search titles, directors, genres..."
            showDropdown={false}
          />
        </div>
      </div>

      {isError && (
        <Alert className="mb-8 rounded-2xl border border-rose-500/25 bg-rose-500/10 text-rose-100">
          <AlertTitle>Couldn’t load the catalog</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
          <AlertAction>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 rounded-xl border-white/15 bg-black/20 text-white hover:bg-white/10"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              Retry
            </Button>
          </AlertAction>
        </Alert>
      )}

      {/* Filters + sorting */}
      <div className="mb-8 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Genre
          </p>
          <select
            value={genreParam}
            onChange={(e) => {
              const v = e.target.value;
              updateUrlFromBrowseState({ genre: v, page: "1" });
            }}
            className={publicSelectClass}
          >
            <option value="" className="bg-zinc-950 text-white">
              All genres
            </option>
            {GENRE_OPTIONS.map((g) => (
              <option key={g} value={g} className="bg-zinc-950 text-white">
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Min rating
          </p>
          <select
            value={minRatingParam}
            onChange={(e) => {
              const v = e.target.value;
              updateUrlFromBrowseState({ minRating: v, page: "1" });
            }}
            className={publicSelectClass}
          >
            <option value="" className="bg-zinc-950 text-white">
              Any rating
            </option>
            <option value="7" className="bg-zinc-950 text-white">
              7+
            </option>
            <option value="8" className="bg-zinc-950 text-white">
              8+
            </option>
            <option value="9" className="bg-zinc-950 text-white">
              9+
            </option>
            <option value="10" className="bg-zinc-950 text-white">
              10
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Release year
          </p>
          <Input
            type="number"
            inputMode="numeric"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            onBlur={() => {
              updateUrlFromBrowseState({ page: "1" });
            }}
            placeholder="e.g. 2021"
            className="h-11 rounded-2xl border-white/5 bg-white/5 px-4 text-sm text-white focus-visible:bg-white/10 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Streaming platform
          </p>
          <Input
            value={streamingPlatform}
            onChange={(e) => setStreamingPlatform(e.target.value)}
            onBlur={() => {
              updateUrlFromBrowseState({ page: "1" });
            }}
            placeholder="e.g. netflix, prime, cloud…"
            className="h-11 rounded-2xl border-white/5 bg-white/5 px-4 text-sm text-white focus-visible:bg-white/10 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Sort
          </p>
          <select
            value={sortByParam}
            onChange={(e) => {
              updateUrlFromBrowseState({
                sortBy: e.target.value,
                sortOrder: "desc",
                page: "1",
              });
            }}
            className={publicSelectClass}
          >
            <option value="createdAt" className="bg-zinc-950 text-white">
              Recent
            </option>
            <option value="highest-rated" className="bg-zinc-950 text-white">
              Top rated
            </option>
            <option value="latest" className="bg-zinc-950 text-white">
              Latest release
            </option>
            <option value="most-reviewed" className="bg-zinc-950 text-white">
              Most reviewed
            </option>
            <option value="most-liked" className="bg-zinc-950 text-white">
              Most liked
            </option>
          </select>
        </div>

        <div className="md:col-span-2 lg:col-span-5 pt-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:bg-white/10"
            onClick={() => {
              setSearchTerm("");
              setReleaseYear("");
              setStreamingPlatform("");
              updateUrlFromBrowseState({
                q: "",
                genre: "",
                minRating: "",
                releaseYear: "",
                streamingPlatform: "",
                sortBy: "createdAt",
                sortOrder: "desc",
                page: "1",
              });
            }}
          >
            Clear filters
          </Button>
        </div>
      </div>

      {showSkeleton ? (
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-10 xl:grid-cols-5">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <MovieCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="relative">
          {isFetching && isPlaceholderData && (
            <div className="absolute inset-0 z-10 grid grid-cols-2 gap-8 bg-[#0b0b0b]/70 backdrop-blur-sm md:grid-cols-3 lg:grid-cols-4 lg:gap-10 xl:grid-cols-5">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <MovieCardSkeleton key={`transition-skeleton-${i}`} />
              ))}
              <Skeleton className="absolute bottom-0 left-0 right-0 h-24 rounded-none bg-gradient-to-t from-[#0b0b0b] to-transparent" />
            </div>
          )}
          <div
            className={cn(
              "grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-10 xl:grid-cols-5 transition-all duration-300",
              isFetching &&
                isPlaceholderData &&
                "pointer-events-none opacity-40 blur-sm scale-[0.99]",
            )}
          >
            {movies.map((movie, index) => (
              <MovieCard key={movie.id || `movie-${index}`} movie={movie} />
            ))}
          </div>

          <MoviesPagination
            page={currentPage}
            totalPages={totalPages}
            total={total}
            isFetching={isFetching}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 py-24 glass-morphism">
          <EmptyState
            icon={Popcorn}
            title="No results for your search"
            description="Try another search or clear the box to browse the full catalog."
          />
        </div>
      )}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<MoviesPageSkeleton />}>
      <MoviesPageContent />
    </Suspense>
  );
}
