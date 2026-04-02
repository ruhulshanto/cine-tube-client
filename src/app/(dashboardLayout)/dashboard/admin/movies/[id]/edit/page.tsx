"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getMovieDetails } from "@/services/movie.services";
import { MovieForm } from "@/components/admin/MovieForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function AdminEditMoviePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "ADMIN") router.replace("/");
  }, [authLoading, user?.role, router]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie-admin", id],
    queryFn: () => getMovieDetails(id as string),
    enabled: !!id && id !== "undefined" && !authLoading && user?.role === "ADMIN",
  });

  const movie = data?.data;

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== "ADMIN") return null;

  if (isError) {
    return (
      <div className="py-20 text-center text-rose-400">
        Movie not found or you don&apos;t have access.
      </div>
    );
  }

  if (isLoading || !movie) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-[480px] w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-500">Admin · Edit</p>
        <h1 className="text-3xl font-black tracking-tighter text-white md:text-4xl">Edit movie</h1>
        <p className="mt-2 text-zinc-400">{movie.title}</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 md:p-10">
        <MovieForm mode="edit" movieId={movie.id} initialMovie={movie} />
      </div>
    </div>
  );
}
