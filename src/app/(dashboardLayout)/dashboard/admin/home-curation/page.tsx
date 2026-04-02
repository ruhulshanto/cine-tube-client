"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMovies } from "@/services/movie.services";
import { getEditorsPicks, getFeatured, setEditorsPicks, setFeatured } from "@/services/homeCurated.services";
import { Movie } from "@/types/movie.types";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ChevronUp, ChevronDown, Plus, X } from "lucide-react";

function moveItem<T>(arr: T[], from: number, to: number) {
  if (from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function MovieMiniRow({ movie, onRemove }: { movie: Movie; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=120"}
          alt={movie.title}
          className="h-12 w-8 rounded-md object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{movie.title}</p>
          <p className="text-[11px] font-semibold text-zinc-400">
            {movie.releaseYear} · {movie.mediaType}
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="h-9 rounded-xl border-white/10 bg-black/20" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function HomeCurationAdminPage() {
  const { user, isLoading } = useAuth();

  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [editorsIds, setEditorsIds] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [movieById, setMovieById] = useState<Record<string, Movie>>({});

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [activeTarget, setActiveTarget] = useState<"featured" | "editors">("featured");

  const featuredQuery = useQuery({ queryKey: ["home-curated", "featured"], queryFn: getFeatured });
  const editorsQuery = useQuery({ queryKey: ["home-curated", "editors-picks"], queryFn: getEditorsPicks });

  const searchQuery = useQuery({
    queryKey: ["movies", "admin-curation", debouncedSearch],
    queryFn: () => getMovies({ searchTerm: debouncedSearch, limit: "20" }),
    enabled: !!debouncedSearch.trim(),
    staleTime: 5 * 1000,
  });

  useEffect(() => {
    if (isLoading) return;
    if (user?.role !== "ADMIN") return;
    if (hasLoaded) return;
    if (featuredQuery.isLoading || editorsQuery.isLoading) return;

    const featuredMovies = featuredQuery.data?.data ?? [];
    const editorsMovies = editorsQuery.data?.data ?? [];

    setFeaturedIds(featuredMovies.map((m) => m.id));
    setEditorsIds(editorsMovies.map((m) => m.id));

    setMovieById(() => {
      const next: Record<string, Movie> = {};
      for (const m of featuredMovies) next[m.id] = m;
      for (const m of editorsMovies) next[m.id] = m;
      return next;
    });
    setHasLoaded(true);
  }, [editorsQuery.data?.data, featuredQuery.data?.data, editorsQuery.isLoading, featuredQuery.isLoading, hasLoaded, isLoading, user?.role]);

  const featuredMovies = useMemo(
    () => featuredIds.map((id) => movieById[id]).filter(Boolean) as Movie[],
    [featuredIds, movieById],
  );
  const editorsMovies = useMemo(
    () => editorsIds.map((id) => movieById[id]).filter(Boolean) as Movie[],
    [editorsIds, movieById],
  );

  const saveFeaturedMutation = useMutation({
    mutationFn: (ids: string[]) => setFeatured(ids),
    onSuccess: () => toast.success("Featured updated"),
    onError: (e: any) => toast.error(e?.message ?? "Failed to update featured"),
  });
  const saveEditorsMutation = useMutation({
    mutationFn: (ids: string[]) => setEditorsPicks(ids),
    onSuccess: () => toast.success("Editor’s Picks updated"),
    onError: (e: any) => toast.error(e?.message ?? "Failed to update editor’s picks"),
  });

  const handleAddMovie = (movie: Movie) => {
    if (activeTarget === "featured") {
      setFeaturedIds((prev) => (prev.includes(movie.id) ? prev : [...prev, movie.id]));
    } else {
      setEditorsIds((prev) => (prev.includes(movie.id) ? prev : [...prev, movie.id]));
    }

    setMovieById((prev) => ({ ...prev, [movie.id]: movie }));
  };

  const handleRemoveMovie = (target: "featured" | "editors", movieId: string) => {
    if (target === "featured") setFeaturedIds((prev) => prev.filter((id) => id !== movieId));
    else setEditorsIds((prev) => prev.filter((id) => id !== movieId));
  };

  const handleMove = (target: "featured" | "editors", movieId: string, dir: -1 | 1) => {
    const list = target === "featured" ? featuredIds : editorsIds;
    const idx = list.indexOf(movieId);
    if (idx < 0) return;
    const to = idx + dir;
    if (to < 0 || to >= list.length) return;
    const next = moveItem(list, idx, to);
    if (target === "featured") setFeaturedIds(next);
    else setEditorsIds(next);
  };

  const isSaving = saveFeaturedMutation.isPending || saveEditorsMutation.isPending;

  const handleSave = async () => {
    try {
      await Promise.all([saveFeaturedMutation.mutateAsync(featuredIds), saveEditorsMutation.mutateAsync(editorsIds)]);
      // Refresh cached lists.
      await featuredQuery.refetch();
      await editorsQuery.refetch();
    } catch {
      // errors are already toasted
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== "ADMIN") return null;

  const hasLoadError = featuredQuery.isError || editorsQuery.isError;
  const loadErrorMessage =
    (featuredQuery.error as any)?.message ||
    (editorsQuery.error as any)?.message ||
    "Failed to load curated lists.";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-amber-500">
          <Plus className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Homepage curation</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-white md:text-5xl">Featured + Editor’s Picks</h1>
        <p className="text-zinc-400">Admin chooses which titles appear on the public homepage.</p>
      </div>

      {hasLoadError && (
        <Alert className="rounded-2xl border border-rose-500/25 bg-rose-500/10 text-rose-100">
          <AlertTitle>Couldn’t load homepage curation data</AlertTitle>
          <AlertDescription>{loadErrorMessage}</AlertDescription>
          <AlertAction>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 rounded-xl border-white/15 bg-black/20 text-white hover:bg-white/10"
              onClick={() => {
                featuredQuery.refetch();
                editorsQuery.refetch();
              }}
            >
              Retry
            </Button>
          </AlertAction>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          <Card className="border-white/10 bg-zinc-950/50">
            <CardHeader>
              <CardTitle className="text-white">Selected lists</CardTitle>
              <CardDescription>Reorder with arrows, remove with X, then Save.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-black uppercase tracking-widest text-primary">Featured</h2>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={activeTarget === "featured" ? "netflix" : "outline"}
                      className="rounded-2xl border-white/10"
                      onClick={() => setActiveTarget("featured")}
                    >
                      Add to Featured
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {featuredMovies.length === 0 ? (
                    <p className="text-sm text-zinc-400">No featured titles yet.</p>
                  ) : (
                    featuredMovies.map((m, idx) => (
                      <div key={m.id} className="space-y-2">
                        <MovieMiniRow movie={m} onRemove={() => handleRemoveMovie("featured", m.id)} />
                        <div className="flex items-center justify-end gap-2 pr-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-xl border-white/10 bg-black/20"
                            disabled={idx === 0}
                            onClick={() => handleMove("featured", m.id, -1)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-xl border-white/10 bg-black/20"
                            disabled={idx === featuredMovies.length - 1}
                            onClick={() => handleMove("featured", m.id, 1)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-black uppercase tracking-widest text-amber-500">Editor’s Picks</h2>
                  <Button
                    type="button"
                    variant={activeTarget === "editors" ? "netflix" : "outline"}
                    className="rounded-2xl border-white/10"
                    onClick={() => setActiveTarget("editors")}
                  >
                    Add to Editor’s Picks
                  </Button>
                </div>
                <div className="space-y-3">
                  {editorsMovies.length === 0 ? (
                    <p className="text-sm text-zinc-400">No editor picks yet.</p>
                  ) : (
                    editorsMovies.map((m, idx) => (
                      <div key={m.id} className="space-y-2">
                        <MovieMiniRow movie={m} onRemove={() => handleRemoveMovie("editors", m.id)} />
                        <div className="flex items-center justify-end gap-2 pr-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-xl border-white/10 bg-black/20"
                            disabled={idx === 0}
                            onClick={() => handleMove("editors", m.id, -1)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-xl border-white/10 bg-black/20"
                            disabled={idx === editorsMovies.length - 1}
                            onClick={() => handleMove("editors", m.id, 1)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 sm:flex-row sm:justify-between">
                <p className="text-[11px] text-zinc-500">
                  Tip: Choose the target list with buttons, then Add from the search results.
                </p>
                <Button
                  type="button"
                  variant="netflix"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-2xl font-black uppercase tracking-widest text-[10px]"
                >
                  {isSaving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-white/10 bg-zinc-950/50">
            <CardHeader>
              <CardTitle className="text-white">Search catalog</CardTitle>
              <CardDescription>Add titles to your selected lists.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title..."
                className="rounded-2xl border-white/10 bg-white/5"
              />

              {searchQuery.isLoading && debouncedSearch.trim() ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : null}

              {searchQuery.data?.data && debouncedSearch.trim() ? (
                <div className="space-y-2 max-h-[420px] overflow-auto pr-2">
                  {searchQuery.data.data.map((m) => {
                    const already = activeTarget === "featured" ? featuredIds.includes(m.id) : editorsIds.includes(m.id);
                    return (
                      <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">{m.title}</p>
                          <p className="text-[11px] font-semibold text-zinc-400">{m.releaseYear}</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={already ? "outline" : "netflix"}
                          className="h-9 rounded-xl border-white/10 bg-black/20"
                          disabled={already}
                          onClick={() => handleAddMovie(m)}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">Type to search and add titles.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

