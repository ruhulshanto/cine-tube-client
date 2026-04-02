"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getReviewsByStatus,
  patchReviewModerationStatus,
  type ReviewModerationAction,
} from "@/services/interaction.services";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Film,
  Loader2,
  RefreshCcw,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/movie.types";
import { ADMIN_PENDING_REVIEW_COUNT_QUERY_KEY } from "@/hooks/useAdminPendingReviewCount";

const RATING_NUM: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
};

function reviewUserName(review: { user?: unknown }): string {
  const u = review?.user as { firstName?: string; lastName?: string; name?: string } | undefined;
  if (!u || typeof u === "string") return "Member";
  const full = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (typeof u.name === "string" && u.name.trim()) return u.name.trim();
  return "Member";
}

function movieTitle(review: { movie?: unknown }): string {
  const m = review?.movie as { title?: string } | undefined;
  if (!m || typeof m === "string") return "—";
  return m.title ?? "—";
}

function movieId(review: { movie?: unknown }): string | undefined {
  const m = review?.movie as { id?: string } | undefined;
  if (!m || typeof m === "string") return undefined;
  return m.id;
}

function reviewRowId(review: { id?: string; _id?: string }): string {
  return review.id ?? review._id ?? "";
}

export default function AdminReviewModerationPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [authLoading, user?.role, router]);

  const {
    data: listResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-reviews", "PENDING"],
    queryFn: () => getReviewsByStatus("PENDING", { page: 1, limit: 100 }),
    enabled: !authLoading && user?.role === "ADMIN",
  });

  const reviews = listResponse?.data ?? [];

  const moderateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewModerationAction }) =>
      patchReviewModerationStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "APPROVED" ? "Review approved" : "Review rejected",
        { description: "The queue has been updated." }
      );
      queryClient.invalidateQueries({ queryKey: ["admin-reviews", "PENDING"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_PENDING_REVIEW_COUNT_QUERY_KEY });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Could not update review status");
    },
  });

  const busyId =
    moderateMutation.isPending && moderateMutation.variables
      ? moderateMutation.variables.id
      : null;

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex w-fit items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1">
            <ShieldAlert className="h-3 w-3 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
              Admin · Moderation
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white md:text-5xl">
            Review <span className="text-primary italic">Queue</span>
          </h1>
          <p className="mt-2 max-w-xl text-zinc-400">
            Pending submissions. Approve to publish or reject to hide from the public catalog.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-12 shrink-0 gap-2 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
        >
          <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-3xl border border-white/5 bg-white/5" />
          ))}
        </div>
      )}

      {isError && (
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader className="flex flex-row items-center gap-4">
            <AlertCircle className="h-10 w-10 text-rose-500" />
            <div>
              <CardTitle className="text-white">Could not load reviews</CardTitle>
              <CardDescription className="text-zinc-400">
                Check your connection or try again.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => refetch()} className="rounded-xl">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && reviews.length === 0 && (
        <Card className="border-white/10 bg-zinc-950/40">
          <CardContent className="flex flex-col items-center gap-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
              <Film className="h-8 w-8 text-zinc-600" />
            </div>
            <div>
              <p className="text-xl font-black text-white">Queue is clear</p>
              <p className="mt-2 max-w-md text-zinc-500">
                There are no reviews waiting for moderation right now.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review: Review) => {
            const rid = reviewRowId(review);
            const ratingRaw = review.rating ?? "TEN";
            const ratingNum = RATING_NUM[ratingRaw] ?? 0;
            const created = review.createdAt;
            const content = review.content ?? "";
            const isBusy = busyId === rid;

            const mid = movieId(review);

            return (
              <Card
                key={rid}
                className="overflow-hidden border-white/10 bg-zinc-950/50 shadow-xl backdrop-blur-sm"
              >
                <CardHeader className="space-y-3 border-b border-white/5 pb-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="truncate text-lg text-white md:text-xl">
                        {reviewUserName(review)}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        {mid ? (
                          <Link
                            href={`/movies/${mid}`}
                            className="font-semibold text-sky-400 hover:text-sky-300 hover:underline"
                          >
                            {movieTitle(review)}
                          </Link>
                        ) : (
                          <span className="text-zinc-300">{movieTitle(review)}</span>
                        )}
                        <span className="text-zinc-600">·</span>
                        <span className="text-zinc-500">
                          {created
                            ? new Date(created).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "—"}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-amber-400">
                        {ratingNum}/10
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300 md:text-base">
                    {content}
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full gap-2 rounded-xl border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white sm:w-auto"
                      disabled={!!busyId}
                      onClick={() => moderateMutation.mutate({ id: rid, status: "APPROVED" })}
                    >
                      {isBusy && moderateMutation.variables?.status === "APPROVED" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full gap-2 rounded-xl border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white sm:w-auto"
                      disabled={!!busyId}
                      onClick={() => moderateMutation.mutate({ id: rid, status: "REJECTED" })}
                    >
                      {isBusy && moderateMutation.variables?.status === "REJECTED" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
