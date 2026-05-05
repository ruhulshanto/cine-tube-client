/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { fuzzySearch } from "@/lib/fuzzySearch";
import { getMovies } from "@/services/movie.services";
import { Movie } from "@/types/movie.types";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Focus search input manually with preventScroll
    // This is the key to preventing the "jump to footer" issue
    const focusTimeout = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus({ preventScroll: true });
      }
    }, 100);

    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(focusTimeout);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.back();
    }, 200);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await getMovies();
        const movies = Array.isArray(response)
          ? response
          : response?.data || [];
        setAllMovies(movies);
        setError(null);
      } catch (err) {
        setError("Failed to load movies for search");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const searchResults = fuzzySearch(query, allMovies);
    setResults(searchResults);
  }, [query, allMovies]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start overflow-hidden pt-20">
      {/* Glass Overlay Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl"
        onClick={handleClose}
      />

      {/* Search Header Container */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative z-10 w-full max-w-4xl px-6"
      >
        <div className="flex items-center gap-4">
          <div className="relative flex-1 group">
            <SearchIcon className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors duration-300" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title, director, or genre..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-16 w-full rounded-2xl border-none bg-white/10 pl-14 pr-14 text-xl text-white placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-primary/50 backdrop-blur-md transition-all duration-300"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all backdrop-blur-md border border-white/5"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search Results Summary */}
        {query.trim() && !isLoading && (
          <div className="mt-4 px-2">
            <p className="text-sm font-medium text-white/50">
              {results.length > 0 
                ? `Showing ${results.length} results for "${query}"` 
                : `No matches found for "${query}"`}
            </p>
          </div>
        )}
      </motion.div>

      {/* Results Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative z-10 w-full max-w-7xl flex-1 overflow-y-auto px-6 py-10 no-scrollbar"
      >
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-white/40">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="animate-pulse font-medium">Searching our library...</p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-3xl bg-red-500/10 p-8 text-center backdrop-blur-md border border-red-500/20">
            <p className="text-red-400">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((movie, idx) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
              >
                <Link
                  href={`/movies/${movie.id}`}
                  className="group block relative"
                >
                  <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-primary/50">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <SearchIcon className="h-12 w-12 text-white/10" />
                      </div>
                    )}
                    
                    {/* Hover Info Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <h3 className="text-xs font-bold text-white line-clamp-1">{movie.title}</h3>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-white/70">
                        <span>{movie.releaseYear}</span>
                        <span className="text-primary font-bold">★ {movie.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : query.trim() ? (
          <div className="flex h-64 flex-col items-center justify-center text-center text-white/30">
            <SearchIcon className="mb-4 h-12 w-12 opacity-20" />
            <p className="text-lg">We couldn't find anything matching "{query}"</p>
            <p className="text-sm mt-1">Try checking for typos or use more general keywords</p>
          </div>
        ) : (
          /* Search Suggestions or Trending could go here */
          <div className="flex h-64 flex-col items-center justify-center text-center text-white/20">
            <p className="text-xl font-medium">What are you looking for?</p>
            <p className="text-sm mt-2 max-w-xs">Start typing to search across movies, shows, and more.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}