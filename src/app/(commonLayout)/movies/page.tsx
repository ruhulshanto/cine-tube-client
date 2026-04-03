"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMovies } from "@/services/movie.services";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieCardSkeleton } from "@/components/movies/MovieCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, Popcorn, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { GENRE_OPTIONS } from "@/lib/adminMovie.schemas";
import { publicSelectClass } from "@/lib/publicFormStyles";

const PAGE_SIZE = 10;

function getVisiblePages(current: number, total: number): (number | "gap")[] {
  if (total <= 0) return [];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]!;
    if (i > 0 && n - sorted[i - 1]! > 1) result.push("gap");
    result.push(n);
  }
  return result;
}

function MoviesPagination({
  page,
  totalPages,
  total,
  onPageChange,
  isFetching,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
  isFetching: boolean;
}) {
  const visible = useMemo(() => getVisiblePages(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) {
    return (
      <div className="flex flex-col items-center gap-3 pt-10 sm:flex-row sm:justify-between">
        <p className="text-center text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
          {total === 0 ? "No titles" : `All ${total} ${total === 1 ? "title" : "titles"}`}
        </p>
      </div>
    );
  }

  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="mt-12 flex flex-col items-stretch gap-6 border-t border-white/5 pt-10 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 sm:text-left">
        <span className="text-zinc-300">Showing </span>
        {start}–{end}
        <span className="text-zinc-300"> of </span>
        {total}
      </p>

      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-2 transition-opacity duration-200",
          isFetching && "opacity-70"
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11 gap-1.5 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:border-primary/30 hover:bg-primary/10 hover:text-white"
          disabled={page <= 1 || isFetching}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-black/30 p-1.5 backdrop-blur-sm">
          {visible.map((item, idx) =>
            item === "gap" ? (
              <span
                key={`gap-${idx}`}
                className="flex h-10 min-w-[2.25rem] items-center justify-center px-1 text-zinc-600"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                disabled={isFetching}
                className={cn(
                  "flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl text-sm font-bold transition-all duration-200",
                  item === page
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(229,9,20,0.35)] ring-1 ring-primary/60"
                    : "text-zinc-400 hover:bg-white/10 hover:text-white"
                )}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </button>
            )
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11 gap-1.5 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:border-primary/30 hover:bg-primary/10 hover:text-white"
          disabled={page >= totalPages || isFetching}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MoviesPageSkeleton() {
  return (
    <div className="container mx-auto max-w-[1600px] px-6 py-12 md:px-12 lg:px-20">
      <div className="mb-12 h-40 animate-pulse rounded-2xl bg-white/5" />
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-10 xl:grid-cols-5">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <MovieCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}

function MoviesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const qParam = searchParams.get("q") ?? "";
  const pageParam = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const genreParam = searchParams.get("genre") ?? "";
  const minRatingParam = searchParams.get("minRating") ?? "";
  const releaseYearParam = searchParams.get("releaseYear") ?? "";
  const streamingPlatformParam = searchParams.get("streamingPlatform") ?? "";
  const sortByParam = searchParams.get("sortBy") ?? "createdAt";
  const sortOrderParam = searchParams.get("sortOrder") ?? "desc";

  const [searchTerm, setSearchTerm] = useState(qParam);
  const [page, setPage] = useState(pageParam);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Browse filters (wired to backend query keys)
  const [genre, setGenre] = useState<string>(genreParam);
  const [minRating, setMinRating] = useState<string>(minRatingParam); // expects backend: minRating
  const [releaseYear, setReleaseYear] = useState<string>(releaseYearParam); // expects backend: releaseYear
  const [streamingPlatform, setStreamingPlatform] = useState<string>(streamingPlatformParam); // expects backend: streamingPlatform
  const [sortBy, setSortBy] = useState<string>(sortByParam);
  const [sortOrder, setSortOrder] = useState<string>(sortOrderParam);

  const debouncedReleaseYear = useDebounce(releaseYear, 350);
  const debouncedStreamingPlatform = useDebounce(streamingPlatform, 350);

  useEffect(() => {
    setSearchTerm(qParam);
  }, [qParam]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Keep URL in sync while typing numeric/text filters (debounced).
  useEffect(() => {
    if (debouncedReleaseYear !== releaseYearParam) {
      setPage(1);
      updateUrlFromBrowseState({ page: 1, releaseYear: debouncedReleaseYear });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedReleaseYear]);

  useEffect(() => {
    if (debouncedStreamingPlatform !== streamingPlatformParam) {
      setPage(1);
      updateUrlFromBrowseState({ page: 1, streamingPlatform: debouncedStreamingPlatform });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedStreamingPlatform]);

  // If user refreshes or navigates with browser back/forward, sync state from URL.
  useEffect(() => {
    if (pageParam !== page) setPage(pageParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParam]);

  useEffect(() => {
    if (genreParam !== genre) setGenre(genreParam);
    if (minRatingParam !== minRating) setMinRating(minRatingParam);
    if (sortByParam !== sortBy) setSortBy(sortByParam);
    if (sortOrderParam !== sortOrder) setSortOrder(sortOrderParam);
  }, [genreParam, minRatingParam, releaseYearParam, sortOrderParam, sortByParam, streamingPlatformParam]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const commitSearchToUrl = () => {
    const trimmed = searchTerm.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    // New search should restart pagination.
    params.set("page", "1");

    const qs = params.toString();
    setPage(1);
    router.replace(`/movies${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const updateUrlFromBrowseState = (next: {
    page?: number;
    genre?: string;
    minRating?: string;
    releaseYear?: string;
    streamingPlatform?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    const nextPage = next.page ?? page;
    params.set("page", String(nextPage));

    const nextGenre = next.genre ?? genre;
    if (nextGenre) params.set("genre", nextGenre);
    else params.delete("genre");

    const nextMinRating = next.minRating ?? minRating;
    if (nextMinRating) params.set("minRating", nextMinRating);
    else params.delete("minRating");

    const nextReleaseYear = next.releaseYear ?? releaseYear;
    if (nextReleaseYear) params.set("releaseYear", nextReleaseYear);
    else params.delete("releaseYear");

    const nextStreamingPlatform = next.streamingPlatform ?? streamingPlatform;
    if (nextStreamingPlatform) params.set("streamingPlatform", nextStreamingPlatform);
    else params.delete("streamingPlatform");

    const nextSortBy = next.sortBy ?? sortBy;
    params.set("sortBy", nextSortBy);

    const nextSortOrder = next.sortOrder ?? sortOrder;
    params.set("sortOrder", nextSortOrder);

    const qs = params.toString();
    router.replace(`/movies?${qs}`, { scroll: false });
  };

  const handlePageChange = (p: number) => {
    const safePage = Math.max(1, p);
    setPage(safePage);
    updateUrlFromBrowseState({ page: safePage });
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
    queryKey: ["movies", debouncedSearch, page, genre, minRating, releaseYear, streamingPlatform, sortBy, sortOrder],
    queryFn: () =>
      getMovies({
        page: String(page),
        limit: String(PAGE_SIZE),
        sortBy,
        sortOrder,
        ...(debouncedSearch.trim() ? { searchTerm: debouncedSearch.trim() } : {}),
        ...(genre ? { genre } : {}),
        ...(minRating ? { minRating } : {}),
        ...(releaseYear ? { releaseYear } : {}),
        ...(streamingPlatform ? { streamingPlatform } : {}),
      }),
    placeholderData: keepPreviousData,
  });

  const movies = response?.data || [];
  const meta = response?.meta;
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? (total > 0 ? 1 : 0);

  const showSkeleton = isLoading && !isPlaceholderData;

  return (
    <div className="container mx-auto max-w-[1600px] px-6 py-12 md:px-12 lg:px-20 animate-in fade-in duration-700">
      <div className="mb-12 flex flex-col items-end justify-between gap-8 border-b border-white/5 pb-8 md:flex-row">
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white text-shadow-glow md:text-6xl">
            Explore All <span className="text-primary tracking-normal">Films</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-zinc-400">
            Discover your next favorite story. Browse the catalog page by page or search by title, genre, or director.
          </p>
          {!showSkeleton && total > 0 && (
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              {total} {total === 1 ? "title" : "titles"} in catalog
            </p>
          )}
        </div>

        <div id="movies-page-search" className="group relative w-full transition-all duration-300 md:w-[400px]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg border border-primary/20 bg-primary/10 p-1.5 transition-colors group-focus-within:border-primary group-focus-within:bg-primary">
            <Search className="h-4 w-4 text-primary transition-colors group-focus-within:text-white" />
          </div>
          <Input
            placeholder="Search by title, genre, director…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitSearchToUrl();
              }
            }}
            autoComplete="off"
            className="h-14 rounded-2xl border-white/5 bg-white/5 pl-14 pr-24 text-lg font-medium transition-all focus-visible:bg-white/10 focus-visible:ring-primary/20"
          />
          <Button
            type="button"
            size="sm"
            variant="netflix"
            className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest"
            onClick={commitSearchToUrl}
          >
            Search
          </Button>
        </div>
      </div>

      {isError && (
        <Alert className="mb-8 rounded-2xl border border-rose-500/25 bg-rose-500/10 text-rose-100">
          <AlertTitle>Couldn’t load the catalog</AlertTitle>
          <AlertDescription>
            {typeof (error as any)?.message === "string"
              ? (error as any).message
              : "Please check your connection or try again."}
          </AlertDescription>
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
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Genre</p>
          <select
            value={genre}
            onChange={(e) => {
              const v = e.target.value;
              setGenre(v);
              setPage(1);
              updateUrlFromBrowseState({ page: 1, genre: v });
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
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Min rating</p>
          <select
            value={minRating}
            onChange={(e) => {
              const v = e.target.value;
              setMinRating(v);
              setPage(1);
              updateUrlFromBrowseState({ page: 1, minRating: v });
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
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Release year</p>
          <Input
            type="number"
            inputMode="numeric"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            onBlur={() => {
              setPage(1);
              updateUrlFromBrowseState({ page: 1 });
            }}
            placeholder="e.g. 2021"
            className="h-11 rounded-2xl border-white/5 bg-white/5 px-4 text-sm text-white focus-visible:bg-white/10 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Streaming platform</p>
          <Input
            value={streamingPlatform}
            onChange={(e) => setStreamingPlatform(e.target.value)}
            onBlur={() => {
              setPage(1);
              updateUrlFromBrowseState({ page: 1 });
            }}
            placeholder="e.g. netflix, prime, cloud…"
            className="h-11 rounded-2xl border-white/5 bg-white/5 px-4 text-sm text-white focus-visible:bg-white/10 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sort</p>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setSortOrder("desc");
              setPage(1);
              updateUrlFromBrowseState({ page: 1, sortBy: e.target.value, sortOrder: "desc" });
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
              setGenre("");
              setMinRating("");
              setReleaseYear("");
              setStreamingPlatform("");
              setSortBy("createdAt");
              setSortOrder("desc");
              setPage(1);
              updateUrlFromBrowseState({
                page: 1,
                genre: "",
                minRating: "",
                releaseYear: "",
                streamingPlatform: "",
                sortBy: "createdAt",
                sortOrder: "desc",
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
            <div className="absolute inset-0 z-10 flex min-h-[40vh] items-center justify-center pointer-events-none">
              <Spinner size="xl" className="drop-shadow-2xl" />
            </div>
          )}
          <div
            className={cn(
              "grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-10 xl:grid-cols-5 transition-all duration-300",
              isFetching && isPlaceholderData && "pointer-events-none opacity-40 blur-sm scale-[0.99]"
            )}
          >
            {movies.map((movie, index) => (
              <MovieCard key={movie.id || `movie-${index}`} movie={movie} />
            ))}
          </div>

          <MoviesPagination
            page={page}
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
