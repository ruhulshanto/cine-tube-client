"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Check, Loader2 } from "lucide-react";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "@/services/interaction.services";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WatchlistButtonProps {
  movieId: string;
  className?: string;
  variant?: "circle" | "minimal";
}

export function WatchlistButton({ 
  movieId, 
  className,
  variant = "circle" 
}: WatchlistButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Matches the exact pattern used in MovieHero.tsx
  const { data: watchlistResponse } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => getWatchlist(),
    enabled: !!isAuthenticated,
  });

  // watchlistResponse?.data is the actual array (httpClient wraps in { data: [] })
  const watchlist = watchlistResponse?.data || [];
  const isInWatchlist = watchlist.some((item: any) => item.movie?.id === movieId);

  const { mutate: toggleWatchlist, isPending } = useMutation({
    mutationFn: async () => {
      if (isInWatchlist) {
        return removeFromWatchlist(movieId);
      } else {
        return addToWatchlist(movieId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success(isInWatchlist ? "Removed from Watchlist" : "Added to Watchlist");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Watchlist operation failed");
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Sign in to manage your collection");
      return;
    }
    toggleWatchlist();
  };

  if (!user) return null;

  if (variant === "minimal") {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
          isInWatchlist
            ? "border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
            : "border-white/10 bg-black/45 text-white hover:bg-white hover:text-black",
          className
        )}
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isInWatchlist ? (
          <Check className="h-3 w-3" />
        ) : (
          <Plus className="h-3 w-3" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
        isInWatchlist
          ? "border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
          : "border-white/10 bg-black/45 text-white hover:bg-white hover:text-black",
        className
      )}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isInWatchlist ? (
        <Check className="h-4 w-4" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </button>
  );
}
