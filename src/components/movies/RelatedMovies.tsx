"use client";

import { useQuery } from "@tanstack/react-query";
import { getMovies } from "@/services/movie.services";
import { MovieRow } from "./MovieRow";
import { useMemo } from "react";

interface RelatedMoviesProps {
  currentMovieId: string;
  genres: string[];
}

export function RelatedMovies({ currentMovieId, genres }: RelatedMoviesProps) {
  const { data: moviesResponse, isLoading } = useQuery({
    queryKey: ["related-movies", currentMovieId, genres],
    queryFn: () =>
      getMovies({
        genre: genres?.[0], // Use the first genre as the primary filter
        limit: "20", // Fetch more to allow for better sorting/filtering
      }),
    enabled: !!genres && genres.length > 0,
  });

  // 1. Filter out the current movie
  // 2. Sort by similarity (how many genres they share)
  const relatedMovies = useMemo(() => {
    if (!moviesResponse?.data) return [];
    
    return moviesResponse.data
      .filter((movie) => movie.id !== currentMovieId)
      .sort((a, b) => {
        const aMatch = a.genres.filter(g => genres.includes(g)).length;
        const bMatch = b.genres.filter(g => genres.includes(g)).length;
        return bMatch - aMatch;
      })
      .slice(0, 12); // Limit to 12 after sorting
  }, [moviesResponse?.data, currentMovieId, genres]);

  if (!isLoading && (!genres || genres.length === 0 || relatedMovies.length === 0)) {
    return null;
  }

  return (
    <MovieRow
      title=""
      movies={relatedMovies}
      isLoading={isLoading}
      showSubtitle={false}
    />
  );
}
