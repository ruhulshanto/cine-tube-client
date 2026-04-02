"use client";

import { useQuery } from "@tanstack/react-query";
import { getWatchlist } from "@/services/interaction.services";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieCardSkeleton } from "@/components/movies/MovieCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function DashboardWatchlistPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  if (!authLoading && !isAuthenticated) {
    redirect("/login");
  }

  const { data: watchlistResponse, isLoading: watchlistLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => getWatchlist(),
    enabled: isAuthenticated,
  });

  const watchlist = watchlistResponse?.data || [];

  if (authLoading || watchlistLoading) {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-10 w-48 rounded-xl bg-white/5 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-4">
      <div className="space-y-3 border-b border-white/10 pb-8">
        <div className="flex items-center gap-3 text-primary">
          <Heart className="w-5 h-5 fill-current" />
          <span className="text-xs font-black uppercase tracking-[0.3em]">
            Personal Collection
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          My Watchlist
        </h1>
        <p className="text-zinc-500 font-medium text-lg">
          {watchlist.length} {watchlist.length === 1 ? "Title" : "Titles"} saved for later
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="py-24">
          <EmptyState
            icon={Heart}
            title="Your watchlist is empty"
            description="Discover new stories and save them here to watch whenever you're ready."
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
          {watchlist.map((item: any) => (
            <MovieCard key={item._id} movie={item.movie} />
          ))}
        </div>
      )}
    </div>
  );
}

