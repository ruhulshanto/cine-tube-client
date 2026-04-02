"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getReviewsByStatus } from "@/services/interaction.services";
import { getAdminDashboardStats, getAdminUserStats } from "@/services/analytics.services";
import { useAdminPendingReviewCount } from "@/hooks/useAdminPendingReviewCount";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Review } from "@/types/movie.types";
import { Clock3, CircleDollarSign, Star, Users, BarChart3, Loader2 } from "lucide-react";

function reviewerName(r: Review) {
  const u = r.user as any;
  if (!u) return "Member";
  const full = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (typeof u.name === "string" && u.name.trim()) return u.name.trim();
  return "Member";
}

function movieTitleFromReview(r: Review) {
  const m = r.movie as any;
  if (!m) return "—";
  return m.title ?? "—";
}

export default function AdminInsightsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role !== "ADMIN") router.replace("/");
  }, [isLoading, user?.role, router]);

  const enabled = !isLoading && user?.role === "ADMIN";

  const { data: pendingReviewCount = 0 } = useAdminPendingReviewCount(enabled);

  const { data: publishedReviewsCountResp } = useQuery({
    queryKey: ["admin-published-review-count"],
    queryFn: async () => {
      const res: any = await getReviewsByStatus("PUBLISHED", { page: 1, limit: 1 });
      return res?.meta?.total ?? 0;
    },
    enabled,
  });

  const publishedReviewsCount = publishedReviewsCountResp ?? 0;

  const { data: dashboardStatsResp, isFetching: statsFetching } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => getAdminDashboardStats(),
    enabled,
  });

  const { data: userStatsResp } = useQuery({
    queryKey: ["admin-user-stats"],
    queryFn: () => getAdminUserStats(),
    enabled,
  });

  const dashboardStats = dashboardStatsResp?.data;
  const userStats = userStatsResp?.data;

  const { data: pendingPreviewResp, isLoading: pendingPreviewLoading } = useQuery({
    queryKey: ["admin-pending-review-preview"],
    queryFn: () => getReviewsByStatus("PENDING", { page: 1, limit: 5 }),
    enabled,
  });

  const pendingPreview = pendingPreviewResp?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!enabled) return null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 border-b border-white/10 pb-8">
        <div className="flex items-center gap-2 text-primary">
          <BarChart3 className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Admin insights</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-white md:text-5xl">
          Dashboard & Analytics
        </h1>
        <p className="text-zinc-400">
          Pending reviews, published activity, and aggregated stats across movies and users.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-zinc-950/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Clock3 className="h-4 w-4 text-amber-400" />
              Pending reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tabular-nums text-white">{pendingReviewCount}</div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              Requires moderation
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-950/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Star className="h-4 w-4 text-emerald-400" />
              Published content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tabular-nums text-white">{publishedReviewsCount}</div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              Reviews approved
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-950/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Users className="h-4 w-4 text-sky-400" />
              Total users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tabular-nums text-white">
              {dashboardStats?.totalUsers ?? 0}
            </div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              Registered accounts
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-950/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <CircleDollarSign className="h-4 w-4 text-emerald-300" />
              Revenue (completed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tabular-nums text-white">
              $
              {(dashboardStats?.totalRevenue ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              Payments in USD
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-white/10 bg-zinc-950/35">
          <CardHeader className="pb-4">
            <CardTitle className="text-white">Pending reviews (latest)</CardTitle>
            <CardDescription>Quick moderation view. Approve to publish.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPreviewLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-xl border border-white/10 bg-white/5">
                      <Skeleton className="h-14 w-full rounded-xl bg-white/5" />
                    </div>
                  ))}
                </div>
              ) : pendingPreview.length === 0 ? (
                <div className="py-10 text-center text-zinc-500">No pending reviews right now.</div>
              ) : (
                pendingPreview.map((r) => (
                  <div
                    key={r.id ?? r._id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white">{movieTitleFromReview(r)}</div>
                      <div className="mt-1 truncate text-[11px] text-zinc-500">
                        {reviewerName(r)} · Rating: {r.rating}
                      </div>
                    </div>
                    <Link
                      href="/dashboard/admin/reviews"
                      className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:bg-white/10"
                    >
                      Review
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-white/10 bg-zinc-950/35">
            <CardHeader className="pb-4">
              <CardTitle className="text-white">Average rating per title</CardTitle>
              <CardDescription>Top rated movies by current averageRating.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(dashboardStats?.topRatedMovies ?? []).map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white">{m.title}</div>
                      <div className="mt-1 text-[11px] text-zinc-500 uppercase tracking-widest">
                        {m.averageRating.toFixed(2)} / 10
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                ))}
                {!statsFetching && (dashboardStats?.topRatedMovies?.length ?? 0) === 0 && (
                  <div className="py-10 text-center text-zinc-500">No analytics available yet.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-950/35">
            <CardHeader className="pb-4">
              <CardTitle className="text-white">User activity</CardTitle>
              <CardDescription>Latest registered members.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(userStats?.recentUsers ?? []).slice(0, 6).map((u) => {
                  const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || u.email;
                  return (
                    <div
                      key={u.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-white">{name}</div>
                        <div className="mt-1 truncate text-[11px] text-zinc-500">
                          {u.role} · {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                        New
                      </span>
                    </div>
                  );
                })}
                {statsFetching && <div className="py-10 text-center text-zinc-500">Loading…</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

