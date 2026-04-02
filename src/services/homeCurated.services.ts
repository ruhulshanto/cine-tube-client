import { httpClient } from "@/lib/axios/httpClient";
import { Movie } from "@/types/movie.types";
import { ApiResponse } from "@/types/api.types";

export const getFeatured = async () => {
  return httpClient.get<Movie[]>("home-curated/featured");
};

export const getEditorsPicks = async () => {
  return httpClient.get<Movie[]>("home-curated/editors-picks");
};

export const setFeatured = async (movieIds: string[]) => {
  return httpClient.put<void>("home-curated/featured", { movieIds });
};

export const setEditorsPicks = async (movieIds: string[]) => {
  return httpClient.put<void>("home-curated/editors-picks", { movieIds });
};

