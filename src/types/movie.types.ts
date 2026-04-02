import { User } from './auth.types';

export interface Movie {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl?: string | null;
  streamingUrl?: string | null;
  releaseYear: number;
  duration: number | null;
  mediaType: "MOVIE" | "SERIES";
  pricingType: "FREE" | "PREMIUM" | "RENTAL";
  rentalPrice?: number | null;
  director: string | null;
  cast: string[];
  genres: string[];
  tags: string[];
  imdbRating?: number | null;
  averageRating: number;
  views: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id?: string;
  _id: string;
  movie: string | Movie;
  user: string | User;
  rating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "SIX" | "SEVEN" | "EIGHT" | "NINE" | "TEN";
  content: string;
  hasSpoiler: boolean;
  tags?: string[];
  status: "PUBLISHED" | "UNPUBLISHED" | "PENDING";
  replies?: ReviewReply[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewReply {
  _id: string;
  user: string | User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Watchlist {
  _id: string;
  user: string | User;
  movie: string | Movie;
  createdAt: string;
  updatedAt: string;
}
