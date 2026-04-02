import { httpClient } from "@/lib/axios/httpClient";
import type { AdminPaymentRow } from "@/types/payment.types";
import type { ApiResponse } from "@/types/api.types";

/**
 * Initiates a movie purchase session via Stripe.
 */
export const buyMovie = async (movieId: string) => {
  const response = await httpClient.post("/payments/movie-checkout-session", {
    movieId,
    type: "PURCHASE",
  });
  return response.data;
};

/**
 * Initiates a subscription session via Stripe.
 */
export const subscribeToPlan = async (plan: "MONTHLY" | "YEARLY") => {
  const response = await httpClient.post("/payments/subscription-checkout-session", {
    plan,
  });
  return response.data;
};

/**
 * Initiates a movie rental session via Stripe.
 */
export const rentMovie = async (movieId: string) => {
  const response = await httpClient.post("/payments/movie-checkout-session", {
    movieId,
    type: "RENTAL",
  });
  return response.data;
};

/**
 * Check if the current user has streaming access to a movie.
 * Returns { hasAccess: boolean, reason: string }
 */
export const checkMovieAccess = async (movieId: string) => {
  const response = await httpClient.get<{ hasAccess: boolean; reason: string }>(
    `/payments/access/${movieId}`
  );
  return response.data;
};

/**
 * Fetch user's payment history (subscriptions or purchases).
 */
export const getMyPaymentHistory = async (params?: Record<string, string>) => {
  const response = await httpClient.get<any>("/payments/my", { params });
  return response.data;
};

/** Admin: all transactions with pagination + revenue summary in meta */
export const getAdminPayments = async (
  params?: Record<string, string>
): Promise<ApiResponse<AdminPaymentRow[]>> => {
  return httpClient.get<AdminPaymentRow[]>("payments", { params });
};

