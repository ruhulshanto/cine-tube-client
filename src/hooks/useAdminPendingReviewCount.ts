"use client";

import { useQuery } from "@tanstack/react-query";
import { getPendingReviewsCount } from "@/services/interaction.services";

export const ADMIN_PENDING_REVIEW_COUNT_QUERY_KEY = ["admin-pending-review-count"] as const;

const POLL_MS = 12_000;

export function useAdminPendingReviewCount(enabled: boolean) {
  return useQuery({
    queryKey: ADMIN_PENDING_REVIEW_COUNT_QUERY_KEY,
    queryFn: async () => {
      const res = await getPendingReviewsCount();
      return res.meta?.total ?? 0;
    },
    enabled,
    refetchInterval: POLL_MS,
    staleTime: 8_000,
  });
}
