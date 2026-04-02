"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getMovies, deleteMovie } from "@/services/movie.services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { GENRE_OPTIONS } from "@/lib/adminMovie.schemas";
import { adminInputClass, adminOptionClass, adminSelectClass } from "@/lib/adminFormStyles";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Film, Loader2, Pencil, Plus, RefreshCcw, Search, Trash2 } from "lucide-react";
import type { Movie } from "@/types/movie.types";

export default function AdminMoviesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [pricingFilter, setPricingFilter] = useState<"" | "FREE" | "PREMIUM" | "RENTAL">("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "ADMIN") router.replace("/");
  }, [authLoading, user?.role, router]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching, refetch, isError } = useQuery({
    queryKey: ["admin-movies", debouncedSearch, genreFilter],
    queryFn: () =>
      getMovies({
        page: "1",
        limit: "100",
        sortBy: "createdAt",
        sortOrder: "desc",
        ...(debouncedSearch.trim() && { searchTerm: debouncedSearch.trim() }),
        ...(genreFilter && { genre: genreFilter }),
      }),
    enabled: !authLoading && user?.role === "ADMIN",
  });

  const movies = useMemo(() => {
    const raw = data?.data ?? [];
    if (!pricingFilter) return raw;
    return raw.filter((m: Movie) => m.pricingType === pricingFilter);
  }, [data?.data, pricingFilter]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMovie(id),
    onSuccess: () => {
      toast.success("Movie deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie"] });
      setDeleteId(null);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Delete failed");
    },
  });

  const deleteTarget = deleteId ? (data?.data ?? []).find((m: Movie) => m.id === deleteId) : null;

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== "ADMIN") return null;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-500">Admin · Library</p>
          <h1 className="text-3xl font-black tracking-tighter text-white md:text-5xl">
            Movie <span className="text-primary italic">Management</span>
          </h1>
          <p className="mt-2 text-zinc-400">Create, edit, or remove titles in the catalog.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-2xl border-white/10"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCcw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
            Refresh
          </Button>
          <Link href="/dashboard/admin/movies/create">
            <Button variant="netflix" className="rounded-2xl font-black uppercase tracking-widest">
              <Plus className="mr-2 h-4 w-4" />
              Upload movie
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-white/10 bg-zinc-950/40">
        <CardHeader className="space-y-4 border-b border-white/5 pb-6">
          <CardTitle className="text-lg text-white">Search & filters</CardTitle>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search title, synopsis, director…"
                className={cn("h-11 pl-10", adminInputClass)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className={cn("min-w-[160px]", adminSelectClass)}
              >
                <option value="" className={adminOptionClass}>
                  All genres
                </option>
                {GENRE_OPTIONS.map((g) => (
                  <option key={g} value={g} className={adminOptionClass}>
                    {g}
                  </option>
                ))}
              </select>
              <select
                value={pricingFilter}
                onChange={(e) => setPricingFilter(e.target.value as typeof pricingFilter)}
                className={cn("min-w-[140px]", adminSelectClass)}
              >
                <option value="" className={adminOptionClass}>
                  All pricing
                </option>
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
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-rose-400">Failed to load movies.</div>
          ) : movies.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <Film className="h-12 w-12 text-zinc-600" />
              <p className="text-zinc-400">No movies match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4">Genres</th>
                    <th className="px-6 py-4">Pricing</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {movies.map((m: Movie) => (
                    <tr key={m.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-semibold text-white">
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={
                              m.posterUrl ||
                              "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000"
                            }
                            alt={m.title}
                            className="h-12 w-9 rounded-xl border border-white/10 bg-black/30 object-cover flex-shrink-0 sm:h-14 sm:w-10"
                            loading="lazy"
                          />
                          <span className="truncate">{m.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{m.releaseYear}</td>
                      <td className="max-w-[220px] px-6 py-4 text-zinc-400">
                        <span className="line-clamp-2">{m.genres?.join(", ") || "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "rounded-lg border px-2 py-1 text-[10px] font-black uppercase",
                            m.pricingType === "FREE" && "border-emerald-500/30 text-emerald-400",
                            m.pricingType === "PREMIUM" && "border-amber-500/30 text-amber-400",
                            m.pricingType === "RENTAL" && "border-sky-500/30 text-sky-400"
                          )}
                        >
                          {m.pricingType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/admin/movies/${m.id}/edit`}>
                            <Button type="button" variant="outline" size="sm" className="rounded-xl border-white/15">
                              <Pencil className="mr-1 h-3.5 w-3.5" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                            onClick={() => setDeleteId(m.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this movie?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be removed from the catalog. This may affect reviews and watchlists.`
            : ""
        }
        confirmLabel="Delete"
        tone="danger"
        isLoading={deleteMutation.isPending}
        onCancel={() => !deleteMutation.isPending && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}
