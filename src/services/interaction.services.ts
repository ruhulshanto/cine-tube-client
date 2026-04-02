import { httpClient } from "@/lib/axios/httpClient";
import { Review, Watchlist } from "@/types/movie.types";

// Maps 1-5 star input to backend's Prisma rating enum
const RATING_ENUM_MAP: Record<number, string> = {
  1: "TWO",   // Maps 1 star → TWO (scale of 10)
  2: "FOUR",
  3: "SIX",
  4: "EIGHT",
  5: "TEN",
};

export const getMovieReviews = async (movieId: string) => {
  return httpClient.get<Review[]>("reviews", { params: { movieId } });
};

/** Admin navbar badge: pending count via meta.total (limit=1 minimizes payload) */
export const getPendingReviewsCount = async () => {
  return httpClient.get<Review[]>("reviews", {
    params: { status: "PENDING", limit: 1, page: 1 },
  });
};

export type PostReviewBody = {
  rating: number;
  comment: string;
  hasSpoiler?: boolean;
  tags?: string[];
};

export const postReview = async (movieId: string, data: PostReviewBody) => {
  const payload = {
    movieId,
    rating: RATING_ENUM_MAP[data.rating] ?? "TEN",
    content: data.comment,
    hasSpoiler: data.hasSpoiler ?? false,
    tags: data.tags ?? [],
  };
  return httpClient.post<Review>("reviews", payload);
};

export const getCommentsByReview = async (reviewId: string) => {
  return httpClient.get<any[]>(`comments/review/${reviewId}`);
};

export const postComment = async (reviewId: string, content: string, parentId?: string) => {
  return httpClient.post<any>("comments", { reviewId, content, ...(parentId && { parentId }) });
};

export const toggleLike = async (payload: {
  movieId?: string;
  reviewId?: string;
  commentId?: string;
}) => {
  return httpClient.post<any>("likes/toggle", payload);
};

export const getLikesCount = async (payload: {
  movieId?: string;
  reviewId?: string;
  commentId?: string;
}) => {
  return httpClient.post<{ count: number }>("likes/count", payload);
};

export const checkUserLike = async (payload: {
  movieId?: string;
  reviewId?: string;
  commentId?: string;
}) => {
  return httpClient.post<{ liked: boolean }>("likes/check", payload);
};

export const getWatchlist = async () => {
  return httpClient.get<Watchlist[]>("watchlist");
};

export const addToWatchlist = async (movieId: string) => {
  return httpClient.post<Watchlist>("watchlist", { movieId });
};

export const removeFromWatchlist = async (movieId: string) => {
  return httpClient.delete<any>(`watchlist/${movieId}`);
};
export const updateReview = async (
  reviewId: string,
  data: { rating?: number; comment?: string; hasSpoiler?: boolean; tags?: string[] }
) => {
  const payload: Record<string, unknown> = {};
  if (data.rating) payload.rating = RATING_ENUM_MAP[data.rating];
  if (data.comment !== undefined) payload.content = data.comment;
  if (data.hasSpoiler !== undefined) payload.hasSpoiler = data.hasSpoiler;
  if (data.tags !== undefined) payload.tags = data.tags;

  return httpClient.patch<Review>(`reviews/${reviewId}`, payload);
};

export const deleteReview = async (reviewId: string) => {
  return httpClient.delete<any>(`reviews/${reviewId}`);
};
export const changeReviewStatus = async (
  reviewId: string,
  status: "PUBLISHED" | "UNPUBLISHED" | "PENDING"
) => {
  return httpClient.patch<any>(`reviews/${reviewId}/status`, { status });
};

/** Admin moderation queue — matches GET /reviews?status=PENDING */
export const getReviewsByStatus = async (
  status: "PENDING" | "PUBLISHED" | "UNPUBLISHED",
  opts?: { page?: number; limit?: number }
) => {
  return httpClient.get<Review[]>("reviews", {
    params: {
      status,
      page: opts?.page ?? 1,
      limit: opts?.limit ?? 100,
    },
  });
};

export type ReviewModerationAction = "APPROVED" | "REJECTED";

/** PATCH /reviews/:id/status — body { status: APPROVED | REJECTED } */
export const patchReviewModerationStatus = async (
  reviewId: string,
  status: ReviewModerationAction
) => {
  return httpClient.patch<Review>(`reviews/${reviewId}/status`, { status });
};
