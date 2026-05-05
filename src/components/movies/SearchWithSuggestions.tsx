"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/services/movie.services";
import { useDebounce } from "@/hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Movie } from "@/types/movie.types";

interface SearchWithSuggestionsProps {
  initialValue?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  className?: string;
  showDropdown?: boolean;
}

export function SearchWithSuggestions({
  initialValue = "",
  placeholder = "Search movies...",
  onSearch,
  onChange,
  className = "",
  showDropdown = true,
}: SearchWithSuggestionsProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Query for search results
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["search-suggestions", debouncedSearch],
    queryFn: () => searchMovies({ q: debouncedSearch, limit: "8" }),
    enabled: debouncedSearch.trim().length > 0,
  });

  const results: Movie[] = Array.isArray(searchResults)
    ? searchResults
    : searchResults?.data || [];

  // Sync with initial value ONLY if it's actually different from current state
  useEffect(() => {
    if (initialValue !== searchTerm) {
      setSearchTerm(initialValue);
    }
  }, [initialValue]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const trimmedValue = searchTerm.trim();
      if (onSearch) {
        onSearch(trimmedValue);
      } else {
        router.push(`/movies?q=${encodeURIComponent(trimmedValue)}`);
      }
      setShowResults(false);
    }
  };

  const handleResultClick = (movieId: string) => {
    router.push(`/movies/${movieId}`);
    setShowResults(false);
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative group">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" />
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            if (onChange) onChange(value);
            setShowResults(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.trim().length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="h-12 w-full rounded-2xl border-white/10 bg-white/5 pl-12 pr-16 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-primary/50 focus-visible:bg-white/10 transition-all shadow-inner"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setShowResults(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:bg-primary hover:text-white transition-all shadow-lg border border-white/10 hover:border-primary/50"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showDropdown && (
        <AnimatePresence>
          {showResults && searchTerm.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-40 mt-2 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl max-h-[400px] overflow-y-auto"
            >
              {/* Loading State */}
              {isSearching && (
                <div className="flex flex-col items-center justify-center gap-2 py-6 px-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <p className="text-xs text-white/60">Searching...</p>
                </div>
              )}

              {/* Results Grid */}
              {!isSearching && results.length > 0 && (
                <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4">
                  {results.map((movie, idx) => (
                    <motion.button
                      key={movie.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      onClick={() => handleResultClick(movie.id)}
                      className="group relative aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all hover:scale-105 hover:border-primary/50"
                    >
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                          <SearchIcon className="h-8 w-8 text-white/10" />
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <h3 className="text-[10px] font-bold text-white line-clamp-1">
                          {movie.title}
                        </h3>
                        <p className="text-[9px] text-white/70">
                          {movie.releaseYear}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isSearching &&
                results.length === 0 &&
                searchTerm.trim().length > 0 && (
                  <div className="flex flex-col items-center justify-center gap-2 py-6 px-4 text-center">
                    <SearchIcon className="h-5 w-5 text-white/20" />
                    <p className="text-xs text-white/60">No movies found</p>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
