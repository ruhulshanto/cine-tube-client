import { z } from "zod";

export const GENRE_OPTIONS = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "K-Drama",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western",
] as const;

const optionalUrl = z
  .string()
  .optional()
  .refine((v) => !v || v.trim() === "" || /^https?:\/\/.+/i.test(v.trim()), {
    message: "Must be a valid http(s) URL",
  });

export const adminMovieFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  synopsis: z.string().min(10, "Synopsis must be at least 10 characters"),
  releaseYear: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 10),
  duration: z.coerce.number().int().positive("Duration must be positive"),
  mediaType: z.enum(["MOVIE", "SERIES"]),
  pricingType: z.enum(["FREE", "PREMIUM", "RENTAL"]),
  director: z.string().optional(),
  cast: z.array(z.string()).default([]),
  genres: z.array(z.string()).min(1, "Select at least one genre"),
  posterUrl: optionalUrl,
  backdropUrl: optionalUrl,
  trailerUrl: optionalUrl,
  streamingUrl: optionalUrl,
});

/** Form-only: comma-separated labels merged into `genres` on submit (not sent to API). */
export type AdminMovieFormValues = {
  title: string;
  synopsis: string;
  releaseYear: number;
  duration: number;
  mediaType: "MOVIE" | "SERIES";
  pricingType: "FREE" | "PREMIUM" | "RENTAL";
  director?: string;
  cast: string[];
  genres: string[];
  /** Extra genres, comma-separated — merged with checked genres before validation */
  customGenres?: string;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  streamingUrl?: string;
};

export function buildMovieFormData(values: AdminMovieFormValues): FormData {
  const fd = new FormData();
  fd.append("title", values.title.trim());
  fd.append("synopsis", values.synopsis.trim());
  fd.append("releaseYear", String(values.releaseYear));
  fd.append("duration", String(values.duration));
  fd.append("mediaType", values.mediaType);
  fd.append("pricingType", values.pricingType);
  if (values.director?.trim()) {
    fd.append("director", values.director.trim());
  }
  const castClean = values.cast.map((c) => c.trim()).filter(Boolean);
  fd.append("cast", JSON.stringify(castClean));
  fd.append("genres", JSON.stringify(values.genres));
  const p = values.posterUrl?.trim();
  const b = values.backdropUrl?.trim();
  const t = values.trailerUrl?.trim();
  const s = values.streamingUrl?.trim();
  if (p) fd.append("posterUrl", p);
  if (b) fd.append("backdropUrl", b);
  if (t) fd.append("trailerUrl", t);
  if (s) fd.append("streamingUrl", s);
  return fd;
}

/** Demo payload — same shape as a typical Postman + Cloudinary upload */
export const VINCENZO_SAMPLE: AdminMovieFormValues = {
  title: "Vincenzo:The Silent Lawyer",
  synopsis:
    "During a visit to his motherland, a Korean-Italian mafia lawyer gives an untouchable cartel a devastating taste of its own medicine with the help of a fierce, sharp-tongued lawyer.",
  posterUrl: "https://res.cloudinary.com/dtph8gqgi/image/upload/v1775048698/vincenzo_wu30vd.jpg",
  backdropUrl: "https://res.cloudinary.com/dtph8gqgi/image/upload/v1775048699/vincenzoBackddrop_bmsmpt.jpg",
  trailerUrl: "https://res.cloudinary.com/dtph8gqgi/video/upload/v1775054259/vincenzo_wld2j0.mp4",
  streamingUrl: "https://res.cloudinary.com/dtph8gqgi/video/upload/v1775054259/vincenzo_wld2j0.mp4",
  releaseYear: 2021,
  duration: 120,
  mediaType: "SERIES",
  pricingType: "PREMIUM",
  director: "",
  cast: [""],
  genres: ["K-Drama", "Action", "Comedy"],
  customGenres: "",
};
