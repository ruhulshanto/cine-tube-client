"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  adminMovieFormSchema,
  buildMovieFormData,
  GENRE_OPTIONS,
  VINCENZO_SAMPLE,
  type AdminMovieFormValues,
} from "@/lib/adminMovie.schemas";
import { createMovieAdmin, updateMovieAdmin } from "@/services/movie.services";
import type { Movie } from "@/types/movie.types";
import { cn } from "@/lib/utils";
import { adminInputClass, adminOptionClass, adminSelectClass } from "@/lib/adminFormStyles";

const defaultEmpty: AdminMovieFormValues = {
  title: "",
  synopsis: "",
  releaseYear: new Date().getFullYear(),
  duration: 120,
  mediaType: "MOVIE",
  pricingType: "FREE",
  director: "",
  cast: [""],
  genres: [],
  posterUrl: "",
  backdropUrl: "",
  trailerUrl: "",
  streamingUrl: "",
  customGenres: "",
};

export function movieToFormValues(movie: Movie): AdminMovieFormValues {
  return {
    title: movie.title,
    synopsis: movie.synopsis,
    releaseYear: movie.releaseYear,
    duration: movie.duration && movie.duration > 0 ? movie.duration : 90,
    mediaType: movie.mediaType,
    pricingType: movie.pricingType,
    director: movie.director ?? "",
    cast: movie.cast?.length ? [...movie.cast] : [""],
    genres: movie.genres?.length ? [...movie.genres] : [],
    posterUrl: movie.posterUrl ?? "",
    backdropUrl: movie.backdropUrl ?? "",
    trailerUrl: movie.trailerUrl ?? "",
    streamingUrl: movie.streamingUrl ?? "",
    customGenres: "",
  };
}

type MovieFormProps = {
  mode: "create" | "edit";
  movieId?: string;
  initialMovie?: Movie | null;
};

export function MovieForm({ mode, movieId, initialMovie }: MovieFormProps) {
  const router = useRouter();
  const form = useForm<AdminMovieFormValues>({
    defaultValues: mode === "edit" && initialMovie ? movieToFormValues(initialMovie) : defaultEmpty,
  });

  useEffect(() => {
    if (mode === "edit" && initialMovie) {
      form.reset(movieToFormValues(initialMovie));
    }
  }, [mode, initialMovie?.id, initialMovie?.updatedAt, initialMovie]);

  const castList = form.watch("cast") ?? [];

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => createMovieAdmin(fd),
    onSuccess: () => {
      toast.success("Movie created");
      router.push("/dashboard/admin/movies");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Failed to create movie");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, fd }: { id: string; fd: FormData }) => updateMovieAdmin(id, fd),
    onSuccess: () => {
      toast.success("Movie updated");
      router.push("/dashboard/admin/movies");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Failed to update movie");
    },
  });

  const pending = createMutation.isPending || updateMutation.isPending;

  function validateAndSubmit(values: AdminMovieFormValues) {
    // Clear any stale validation errors before re-validating.
    form.clearErrors();

    const extra =
      (values.customGenres ?? "")
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean) ?? [];
    const mergedGenres = [...new Set([...values.genres, ...extra])];
    const { customGenres: _cg, ...rest } = values;
    const parsed = adminMovieFormSchema.safeParse({ ...rest, genres: mergedGenres });
    if (!parsed.success) {
      let firstField: string | null = null;
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field !== undefined && typeof field === "string") {
          if (!firstField) firstField = field;
          form.setError(field as keyof AdminMovieFormValues, { message: issue.message });
        }
      });
      if (firstField) {
        // Improve UX: move cursor to first invalid field.
        form.setFocus(firstField as any);
      }
      return;
    }
    const fd = buildMovieFormData(parsed.data);
    if (mode === "create") {
      createMutation.mutate(fd);
    } else if (movieId) {
      updateMutation.mutate({ id: movieId, fd });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(validateAndSubmit)} className="space-y-8">
        {mode === "create" && (
          <div className="flex flex-col gap-4 rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-500/[0.06] to-transparent p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-zinc-300">
              Paste Cloudinary (or any HTTPS) URLs after uploading assets — same as Postman, no separate tool needed.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 rounded-xl border-amber-500/40 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20"
              onClick={() => form.reset({ ...defaultEmpty, ...VINCENZO_SAMPLE })}
            >
              Load sample (Vincenzo)
            </Button>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} className={adminInputClass} placeholder="Movie title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="releaseYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    min={1900}
                    max={new Date().getFullYear() + 10}
                    className={adminInputClass}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min={1} className={adminInputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mediaType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media type</FormLabel>
                <FormControl>
                  <select {...field} className={adminSelectClass}>
                    <option value="MOVIE" className={adminOptionClass}>
                      Movie
                    </option>
                    <option value="SERIES" className={adminOptionClass}>
                      Series
                    </option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing</FormLabel>
                <FormControl>
                  <select {...field} className={adminSelectClass}>
                    <option value="FREE" className={adminOptionClass}>
                      Free
                    </option>
                    <option value="PREMIUM" className={adminOptionClass}>
                      Premium
                    </option>
                    <option value="RENTAL" className={adminOptionClass}>
                      Rental
                    </option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-zinc-200">Director (optional)</FormLabel>
                <FormDescription className="text-zinc-500">Leave blank if you don&apos;t want to list a director.</FormDescription>
                <FormControl>
                  <Input {...field} className={adminInputClass} placeholder="e.g. Park Hee-joon" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="synopsis"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Synopsis</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={6}
                    className={cn("min-h-[140px]", adminInputClass)}
                    placeholder="At least 10 characters…"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genres"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Genres</FormLabel>
                <FormDescription className="text-zinc-500">Select one or more genres.</FormDescription>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {GENRE_OPTIONS.map((g) => (
                    <label
                      key={g}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                        field.value?.includes(g)
                          ? "border-primary/50 bg-primary/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="rounded border-white/20"
                        checked={field.value?.includes(g)}
                        onChange={() => {
                          const next = field.value?.includes(g)
                            ? field.value.filter((x) => x !== g)
                            : [...(field.value ?? []), g];
                          field.onChange(next);
                        }}
                      />
                      {g}
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customGenres"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Extra genres (optional)</FormLabel>
                <FormDescription className="text-zinc-500">
                  Comma-separated labels not in the list above (e.g. &quot;Musical, Biography&quot;).
                </FormDescription>
                <FormControl>
                  <Input {...field} className={adminInputClass} placeholder="e.g. Musical, Biography" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <FormLabel>Cast</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 rounded-xl border-white/15"
                onClick={() => form.setValue("cast", [...castList, ""])}
              >
                <Plus className="h-4 w-4" />
                Add name
              </Button>
            </div>
            <div className="space-y-2">
              {castList.map((_, index) => (
                <div key={index} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`cast.${index}` as `cast.${number}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Actor name"
                            className={adminInputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {castList.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 rounded-xl text-zinc-500 hover:text-rose-400"
                      onClick={() => {
                        const next = castList.filter((__, i) => i !== index);
                        form.setValue("cast", next.length ? next : [""]);
                      }}
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-2 text-xs font-black uppercase tracking-widest text-[#e50914]">Media URLs</h3>
            <p className="mb-4 text-sm text-zinc-500">
              Use direct HTTPS links (e.g. from Cloudinary). Optional file upload can still be done on the API; this form sends URL strings only.
            </p>
          </div>

          <FormField
            control={form.control}
            name="posterUrl"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Poster URL</FormLabel>
                <FormControl>
                  <Input {...field} className={adminInputClass} placeholder="https://…" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="backdropUrl"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Backdrop URL</FormLabel>
                <FormControl>
                  <Input {...field} className={adminInputClass} placeholder="https://…" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trailerUrl"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Trailer URL</FormLabel>
                <FormControl>
                  <Input {...field} className={adminInputClass} placeholder="https://… (video or page)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="streamingUrl"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Streaming URL</FormLabel>
                <FormDescription className="text-zinc-500">Full title playback URL (e.g. same as trailer MP4 or HLS).</FormDescription>
                <FormControl>
                  <Input {...field} className={adminInputClass} placeholder="https://… (.mp4 / stream)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-white/15"
            onClick={() => router.push("/dashboard/admin/movies")}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="netflix" className="rounded-xl font-black uppercase tracking-widest" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : mode === "create" ? (
              "Upload to catalog"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
