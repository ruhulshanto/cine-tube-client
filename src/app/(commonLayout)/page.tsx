"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/api.types";
import type { Movie } from "@/types/movie.types";
import { getMovies } from "@/services/movie.services";
import { getEditorsPicks, getFeatured } from "@/services/homeCurated.services";
import { PageSkeleton } from "@/components/shared/AppSkeletons";
import HomePage from "@/components/home/HomePage";
import {
  buildPinnedTrending,
  pickFavoriteFirst,
} from "@/lib/home/pinnedTrending";

export default function Home() {
  const { data: trendingData, isLoading: trendingLoading } = useQuery<
    ApiResponse<Movie[]>
  >({
    queryKey: ["movies", "trending"],
    queryFn: () =>
      getMovies({ sortBy: "views", sortOrder: "desc", limit: "15" }),
  });

  const { data: favoriteSpiderData } = useQuery<ApiResponse<Movie[]>>({
    queryKey: ["movies", "favorite", "spider-brand-day"],
    queryFn: () => getMovies({ searchTerm: "spider", limit: "50" }),
  });

  const { data: narutoData } = useQuery<ApiResponse<Movie[]>>({
    queryKey: ["movies", "hero", "naruto"],
    queryFn: () => getMovies({ searchTerm: "Naruto: Ghost of the Uchiha", limit: "1" }),
  });

  const { data: favoriteBrandData } = useQuery<ApiResponse<Movie[]>>({
    queryKey: ["movies", "favorite", "brand-new-day"],
    queryFn: () => getMovies({ searchTerm: "brand new day", limit: "50" }),
  });

  const { data: yourNameData } = useQuery<ApiResponse<Movie[]>>({
    queryKey: ["movies", "hero", "your-name"],
    queryFn: () => getMovies({ searchTerm: "Your Name", limit: "1" }),
  });

  const { data: topRatedData, isLoading: topRatedLoading } = useQuery<
    ApiResponse<Movie[]>
  >({
    queryKey: ["movies", "top-rated"],
    queryFn: () =>
      getMovies({ sortBy: "averageRating", sortOrder: "desc", limit: "10" }),
  });

  const { data: newData, isLoading: newLoading } = useQuery<
    ApiResponse<Movie[]>
  >({
    queryKey: ["movies", "new"],
    queryFn: () =>
      getMovies({ sortBy: "releaseYear", sortOrder: "desc", limit: "10" }),
  });

  const { data: featuredCuratedData, isLoading: featuredCuratedLoading } =
    useQuery<ApiResponse<Movie[]>>({
      queryKey: ["home-curated", "featured"],
      queryFn: getFeatured,
    });

  const { data: editorsPicksData, isLoading: editorsPicksLoading } = useQuery<
    ApiResponse<Movie[]>
  >({
    queryKey: ["home-curated", "editors-picks"],
    queryFn: getEditorsPicks,
  });

  const favoriteFirst = pickFavoriteFirst([
    ...(favoriteSpiderData?.data ?? []),
    ...(narutoData?.data ?? []),
    ...(yourNameData?.data ?? []),
    ...(favoriteBrandData?.data ?? []),
  ] as Movie[]);

  const { trendingMovies, billboardMovie } = buildPinnedTrending({
    trending: (trendingData?.data ?? []) as Movie[],
    favoriteCandidate: favoriteFirst,
    alsoPin: [
      {
        matcher: (m: Movie) =>
          (m?.title ?? "").toLowerCase().includes("shang-chi") ||
          (m?.title ?? "").toLowerCase().includes("ten rings"),
      },
      {
        matcher: (m: Movie) =>
          (m?.title ?? "").toLowerCase().includes("titanic") ||
          (m?.title ?? "").toLowerCase().includes("last journey"),
      },
      {
        matcher: (m: Movie) =>
          (m?.title ?? "").toLowerCase().includes("vincenzo") ||
          (m?.title ?? "").toLowerCase().includes("journalist"),
      },
    ],
  });

  const isPageLoading =
    trendingLoading || featuredCuratedLoading || topRatedLoading || newLoading;

  if (isPageLoading) {
    return <PageSkeleton variant="home" />;
  }

  return (
    <HomePage
      billboardMovie={billboardMovie}
      trendingMovies={trendingMovies}
      featuredMovies={
        featuredCuratedData?.data?.length
          ? featuredCuratedData.data
          : (editorsPicksData?.data ?? [])
      }
      topRatedMovies={topRatedData?.data ?? []}
      newMovies={newData?.data ?? []}
      trendingLoading={trendingLoading}
      featuredLoading={featuredCuratedLoading || editorsPicksLoading}
      topRatedLoading={topRatedLoading}
      newLoading={newLoading}
      stats={{
        totalMovies: trendingData?.meta?.total,
        activeUsers: 18400,
        reviewsCount: 26300,
        subscriptionUsers: 6200,
      }}
    />
  );
}
