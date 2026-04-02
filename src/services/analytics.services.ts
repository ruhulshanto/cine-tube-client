import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.types";

export type AnalyticsTopRatedMovie = {
  id: string;
  title: string;
  slug: string;
  averageRating: number;
  posterUrl: string | null;
};

export type AnalyticsMostReviewedMovie = {
  id: string;
  title: string;
  slug: string;
  posterUrl: string | null;
  _count: { reviews: number };
};

export type DashboardStats = {
  totalUsers: number;
  totalMovies: number;
  totalReviews: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
  topRatedMovies: AnalyticsTopRatedMovie[];
  mostReviewedMovies: AnalyticsMostReviewedMovie[];
};

export type UserStats = {
  usersByRole: { role: string; _count: number }[];
  recentUsers: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: string;
    createdAt: string;
  }[];
};

export const getAdminDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return httpClient.get<DashboardStats>("analytics/dashboard");
};

export const getAdminUserStats = async (): Promise<ApiResponse<UserStats>> => {
  return httpClient.get<UserStats>("analytics/users");
};

