"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyPaymentHistory } from "@/services/payment.services";
import { useAuth } from "@/context/AuthContext";

export function useUserAccess() {
  const { isAuthenticated } = useAuth();

  const { data: response, isLoading } = useQuery({
    queryKey: ["payment-history", "all"],
    queryFn: () => getMyPaymentHistory({ limit: "1000" }),
    enabled: isAuthenticated,
    // Using an arbitrary large limit to fetch all access records for the user locally
  });

  const payments = response?.data || [];

  let hasActiveSubscription = false;
  let subscriptionEndDate: string | null = null;
  let activePlan: string | null = null;

  const purchasedMovieIds = new Set<string>();
  const rentedMovieIds = new Set<string>();

  payments.forEach((p: any) => {
    if (p.status !== "COMPLETED") return;

    if (p.type === "SUBSCRIPTION") {
      // Check if subscription has an end date in the future, or no end date (free/infinite)
      if (!p.subscription?.endDate || new Date(p.subscription.endDate) > new Date()) {
        hasActiveSubscription = true;
        subscriptionEndDate = p.subscription?.endDate || null;
        activePlan = p.subscription?.plan || "PREMIUM";
      }
    } else if (p.movieId) {
      if (p.type === "PURCHASE") {
        purchasedMovieIds.add(p.movieId);
      } else if (p.type === "RENTAL") {
        // Only active rentals
        if (!p.expiresAt || new Date(p.expiresAt) > new Date()) {
          rentedMovieIds.add(p.movieId);
        }
      }
    }
  });

  return {
    hasActiveSubscription,
    subscriptionEndDate,
    activePlan,
    purchasedMovieIds,
    rentedMovieIds,
    isLoading,
  };
}
