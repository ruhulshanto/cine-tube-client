import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { checkMovieAccess } from "@/services/payment.services";

/**
 * Custom hook to check if the current user has streaming access to a movie.
 *
 * Access logic (mirrors backend):
 *   1. Movie is FREE → always hasAccess = true (no API call needed)
 *   2. User not logged in → hasAccess = false
 *   3. API call → checks active paid subscription
 *
 * @param movieId - The movie ID to check
 * @param pricingType - The movie's pricing type to skip calls for FREE movies
 */
export function useMovieAccess(movieId: string, pricingType: string) {
  const { user, isAuthenticated } = useAuth();

  const isFree = pricingType === "FREE";

  const { data, isLoading } = useQuery({
    queryKey: ["movie-access", movieId, user?.id],
    queryFn: () => checkMovieAccess(movieId),
    // Only fetch if: user is logged in AND movie is not free
    enabled: isAuthenticated && !isFree && !!movieId,
    staleTime: 60 * 1000, // Cache for 1 minute
    retry: false,
  });

  // FREE movies are always accessible
  if (isFree) {
    return { hasAccess: true, reason: "FREE_MOVIE", isLoading: false };
  }

  // Not logged in
  if (!isAuthenticated) {
    return { hasAccess: false, reason: "NOT_LOGGED_IN", isLoading: false };
  }

  return {
    hasAccess: data?.hasAccess ?? false,
    reason: data?.reason ?? "CHECKING",
    isLoading,
  };
}
