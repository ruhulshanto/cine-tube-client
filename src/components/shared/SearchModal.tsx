"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { searchMovies } from "@/services/movie.services";
import { useDebounce } from "@/hooks/useDebounce";
import { Movie } from "@/types/movie.types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Query for search results
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => searchMovies({ q: debouncedSearch, limit: "20" }),
    enabled: debouncedSearch.trim().length > 0,
  });

  const results: Movie[] = Array.isArray(searchResults)
    ? searchResults
    : searchResults?.data || [];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus input with slight delay to ensure it's rendered
      const timer = setTimeout(() => {
        searchInputRef.current?.focus({ preventScroll: true });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col items-start justify-start pt-20 md:pt-24"
        >
          {/* Glassmorphism Overlay Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-lg"
            onClick={handleClose}
          />

          {/* Search Header Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="relative z-10 w-full max-w-4xl px-4 sm:px-6 md:px-8 mx-auto"
          >
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <SearchIcon className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-white/40 transition-colors duration-300 group-focus-within:text-primary" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by title, director, or genre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 w-full rounded-2xl border-white/10 bg-white/5 pl-14 pr-12 text-lg text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:bg-white/10 backdrop-blur-sm transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm border border-white/5"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Results Summary */}
            {searchTerm.trim() && !isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="mt-3 px-2"
              >
                <p className="text-sm font-medium text-white/50">
                  {results.length > 0
                    ? `Found ${results.length} results`
                    : `No results for "${searchTerm}"`}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative z-10 w-full max-w-7xl px-4 sm:px-6 md:px-8 mx-auto mt-8 max-h-[calc(100vh-200px)] overflow-y-auto flex-1"
          >
            {/* Loading State */}
            {isSearching && searchTerm.trim() && (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-white/60">Searching our library...</p>
              </div>
            )}

            {/* Results Grid */}
            {!isSearching && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pb-8"
              >
                {results.map((movie, idx) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                  >
                    <Link href={`/movies/${movie.id}`} onClick={handleClose}>
                      <div className="group relative aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-2xl">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                            <SearchIcon className="h-12 w-12 text-white/10" />
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <h3 className="text-xs font-bold text-white line-clamp-2">
                            {movie.title}
                          </h3>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-white/70">
                            <span>{movie.releaseYear}</span>
                            <span className="font-bold text-primary">
                              ★ {movie.averageRating?.toFixed(1) || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {!isSearching && searchTerm.trim() && results.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex flex-col items-center justify-center gap-4 py-16 text-center"
              >
                <SearchIcon className="h-12 w-12 text-white/20" />
                <div>
                  <p className="text-base font-medium text-white/70">
                    No movies found
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    Try searching with different keywords
                  </p>
                </div>
              </motion.div>
            )}

            {/* Initial State */}
            {!searchTerm.trim() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex flex-col items-center justify-center gap-3 py-16 text-center"
              >
                <SearchIcon className="h-12 w-12 text-white/20" />
                <div>
                  <p className="text-lg font-medium text-white/60">
                    What are you looking for?
                  </p>
                  <p className="mt-1 text-sm text-white/40">
                    Start typing to search across movies
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
