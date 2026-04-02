import { httpClient } from "@/lib/axios/httpClient";
import { Movie } from "@/types/movie.types";

export const getMovies = async (params?: Record<string, string>) => {
  return httpClient.get<Movie[]>("movies", { params });
};

export const getMovieDetails = async (id: string) => {
  return httpClient.get<Movie>(`movies/${id}`);
};

export const updateMovie = async (id: string, data: Partial<Movie>) => {
  return httpClient.patch<Movie>(`movies/${id}`, data);
};

export const deleteMovie = async (id: string) => {
  return httpClient.delete<{ message: string }>(`movies/${id}`);
};

/** Admin: multipart body (matches server multer + Zod). */
export const createMovieAdmin = async (formData: FormData) => {
  return httpClient.postMultipart<Movie>("movies", formData);
};

export const updateMovieAdmin = async (id: string, formData: FormData) => {
  return httpClient.patchMultipart<Movie>(`movies/${id}`, formData);
};
