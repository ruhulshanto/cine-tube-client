"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMovies } from "@/services/movie.services";
import { MovieCard } from "@/components/movies/MovieCard";
import { SearchWithSuggestions } from "@/components/movies/SearchWithSuggestions";
import { MovieCardSkeleton } from "@/components/movies/MovieCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Popcorn, ChevronDown, Trash2, LayoutGrid, Check } from "lucide-react";
import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { GENRE_OPTIONS } from "@/lib/adminMovie.schemas";
import { PageSkeleton } from "@/components/shared/AppSkeletons";
import { motion, AnimatePresence } from "framer-motion";
import { MoviesPagination } from "@/components/movies/MoviesPagination";

const PAGE_SIZE = 15;

// Custom Premium Dropdown (Fixes native select design issues)
function PremiumDropdown({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder,
  className
}: { 
  label: string, 
  value: string, 
  onChange: (v: string) => void, 
  options: readonly string[] | readonly {label: string, value: string}[],
  placeholder: string,
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const formattedOptions = options.map(opt => 
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = formattedOptions.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2.5", className)} ref={containerRef}>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 ml-1">{label}</p>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-full items-center justify-between rounded-[1.25rem] border border-white/10 bg-white/[0.02] px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 focus:outline-none"
        >
          <span className={cn(!selectedOption && "text-zinc-500")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-500", isOpen && "rotate-180 text-primary")} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 top-[calc(100%+12px)] z-[100] w-full overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#0b0b0b] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
            >
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                <button
                  onClick={() => { onChange(""); setIsOpen(false); }}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {placeholder}
                </button>
                <div className="my-1 h-px bg-white/5 mx-2" />
                {formattedOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all duration-200",
                      value === opt.value ? "bg-primary/20 text-primary" : "text-zinc-400 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="font-medium">{opt.label}</span>
                    {value === opt.value && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

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
  const pricingTypeParam = searchParams.get("pricingType") ?? "";
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
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedReleaseYear !== releaseYearParam) {
      updateUrlFromBrowseState({
        releaseYear: debouncedReleaseYear,
        page: "1",
      });
    }
  }, [debouncedReleaseYear]);

  useEffect(() => {
    if (debouncedStreamingPlatform !== streamingPlatformParam) {
      updateUrlFromBrowseState({
        streamingPlatform: debouncedStreamingPlatform,
        page: "1",
      });
    }
  }, [debouncedStreamingPlatform]);

  const commitSearchToUrl = () => {
    const trimmed = searchTerm.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    params.set("page", "1");
    const qs = params.toString();
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
      pricingType?: string;
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

    if (next.pricingType !== undefined) {
      if (next.pricingType) params.set("pricingType", next.pricingType);
      else params.delete("pricingType");
    }

    if (next.sortBy !== undefined) params.set("sortBy", next.sortBy);
    if (next.sortOrder !== undefined) params.set("sortOrder", next.sortOrder);
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }

    const nextPage = next.page ?? pageParam;
    params.set("page", nextPage);

    const qs = params.toString();
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
      pricingTypeParam,
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
        ...(pricingTypeParam ? { pricingType: pricingTypeParam } : {}),
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
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] pt-24 pb-20">
      <div className="container mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-white/5 pb-8">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary">CineTube Library</p>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl md:text-7xl font-normal tracking-wide text-white uppercase leading-none">
              All Movies &amp; Series
            </h1>
          </div>
          
          <div className="w-full md:w-[500px]">
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <SearchWithSuggestions
                    initialValue={searchTerm}
                    onChange={(q) => setSearchTerm(q)}
                    onSearch={(q) => {
                        setSearchTerm(q);
                        commitSearchToUrl();
                    }}
                    placeholder="Search titles, genres, directors..."
                    showDropdown={false}
                />
             </div>
          </div>
        </div>

        {/* Filtering Section */}
        <div className="relative z-50 mb-12 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">Filters</h3>
            {(genreParam || minRatingParam || releaseYearParam || streamingPlatformParam || pricingTypeParam) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setReleaseYear("");
                  setStreamingPlatform("");
                  updateUrlFromBrowseState({
                    q: "", genre: "", minRating: "", releaseYear: "",
                    streamingPlatform: "", pricingType: "", sortBy: "createdAt", sortOrder: "desc", page: "1"
                  });
                }}
                className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500 hover:text-primary transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-3 lg:gap-6">
            <PremiumDropdown
              label="Genre"
              value={genreParam}
              onChange={(v) => updateUrlFromBrowseState({ genre: v, page: "1" })}
              options={GENRE_OPTIONS}
              placeholder="All Genres"
              className="w-full"
            />

            <PremiumDropdown
              label="Access Type"
              value={pricingTypeParam}
              onChange={(v) => updateUrlFromBrowseState({ pricingType: v, page: "1" })}
              options={[
                { label: "All", value: "" },
                { label: "Free", value: "FREE" },
                { label: "Premium", value: "PREMIUM" },
                { label: "Rental", value: "RENTAL" },
              ]}
              placeholder="All Access"
              className="w-full"
            />

            <PremiumDropdown
              label="Min Rating"
              value={minRatingParam}
              onChange={(v) => updateUrlFromBrowseState({ minRating: v, page: "1" })}
              options={["7", "8", "9", "10"].map(r => ({ label: `${r}+`, value: r }))}
              placeholder="Any Rating"
              className="w-full"
            />

            <div className="w-full">
              <label className="block text-sm font-medium mb-2 tracking-wider text-zinc-400 uppercase">
                Year
              </label>
              <Input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                onBlur={() => updateUrlFromBrowseState({ page: "1" })}
                placeholder="e.g. 2024"
                className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white focus-visible:ring-primary/20"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium mb-2 tracking-wider text-zinc-400 uppercase">
                Platform
              </label>
              <Input
                value={streamingPlatform}
                onChange={(e) => setStreamingPlatform(e.target.value)}
                onBlur={() => updateUrlFromBrowseState({ page: "1" })}
                placeholder="Netflix, Prime…"
                className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white focus-visible:ring-primary/20"
              />
            </div>

            <PremiumDropdown
              label="Sort By"
              value={sortByParam}
              onChange={(v) => updateUrlFromBrowseState({ sortBy: v, sortOrder: "desc", page: "1" })}
              options={[
                { label: "Recently Added", value: "createdAt" },
                { label: "Top Rated", value: "highest-rated" },
                { label: "Latest Release", value: "latest" },
              ]}
              placeholder="Sort By"
              className="w-full"
            />
          </div>

          {!showSkeleton && total > 0 && (
            <div className="mt-6 flex items-center gap-3 text-sm font-medium tracking-wider text-zinc-500">
              <LayoutGrid className="h-4 w-4 text-primary" />
              <span><span className="text-white">{total}</span> titles found</span>
            </div>
          )}
        </div>

        {/* Movies Grid (15 per page) */}
        <div className="relative z-10">
            {showSkeleton ? (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <MovieCardSkeleton key={`skeleton-${i}`} />
                ))}
            </div>
            ) : movies.length > 0 ? (
            <div className="relative">
                {isFetching && isPlaceholderData && (
                <div className="absolute inset-0 z-10 grid grid-cols-2 gap-8 bg-[#0b0b0b]/70 backdrop-blur-sm md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <MovieCardSkeleton key={`transition-skeleton-${i}`} />
                    ))}
                </div>
                )}
                
                <div
                className={cn(
                    "grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 transition-all duration-500",
                    isFetching && isPlaceholderData && "pointer-events-none opacity-40 blur-sm"
                )}
                >
                {movies.map((movie, index) => (
                    <motion.div
                        key={movie.id || `movie-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: Math.min((index % PAGE_SIZE) * 0.05, 0.5) }}
                    >
                        <MovieCard movie={movie} />
                    </motion.div>
                ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                <div className="mt-24 flex justify-center border-t border-white/10 pt-16">
                    <MoviesPagination
                    page={currentPage}
                    totalPages={totalPages}
                    total={total}
                    isFetching={isFetching}
                    onPageChange={handlePageChange}
                    />
                </div>
                )}
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center rounded-[4rem] border border-dashed border-white/10 py-40 bg-white/[0.01]">
                <EmptyState
                icon={Popcorn}
                title="No Titles Found"
                description="We couldn't find any results for your current filter configuration."
                />
                {(genreParam || minRatingParam || releaseYearParam || streamingPlatformParam || pricingTypeParam) && (
                <Button 
                    variant="outline" 
                    className="mt-10 rounded-full border-white/20 px-12 h-14 font-black uppercase tracking-widest text-xs transition-all hover:bg-white/10"
                    onClick={() => {
                    setSearchTerm("");
                    setReleaseYear("");
                    setStreamingPlatform("");
                    updateUrlFromBrowseState({
                        q: "", genre: "", minRating: "", releaseYear: "",
                        streamingPlatform: "", pricingType: "", sortBy: "createdAt", sortOrder: "desc", page: "1"
                    });
                    }}
                >
                    Clear All Search Filters
                </Button>
                )}
            </div>
            )}
        </div>
      </div>
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
