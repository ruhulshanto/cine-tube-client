"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getAdminPayments } from "@/services/payment.services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/shared/EmptyState";
import { adminSelectClass } from "@/lib/adminFormStyles";
import { cn } from "@/lib/utils";
import type { AdminPaymentRow, PaymentStatus } from "@/types/payment.types";
import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Loader2,
  RefreshCcw,
  TriangleAlert,
  TrendingUp,
  Wallet,
} from "lucide-react";

function formatUser(p: AdminPaymentRow["user"]) {
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ").trim();
  return name || p.username;
}

function typeLabel(t: AdminPaymentRow["type"]) {
  if (t === "PURCHASE") return "Buy";
  if (t === "RENTAL") return "Rent";
  return "Subscription";
}

function statusBadge(status: PaymentStatus) {
  const map: Record<PaymentStatus, string> = {
    COMPLETED: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25",
    PENDING: "bg-amber-500/15 text-amber-400 ring-amber-500/25",
    FAILED: "bg-rose-500/15 text-rose-400 ring-rose-500/25",
    REFUNDED: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/25",
  };
  return map[status] ?? map.PENDING;
}

const PAGE_SIZE = 15;

export default function AdminPaymentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"" | PaymentStatus>("");

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "ADMIN") router.replace("/");
  }, [authLoading, user?.role, router]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const { data, isLoading, isFetching, refetch, isError } = useQuery({
    queryKey: ["admin-payments", page, statusFilter],
    queryFn: () =>
      getAdminPayments({
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(statusFilter ? { status: statusFilter } : {}),
      }),
    enabled: !authLoading && user?.role === "ADMIN",
  });

  const rows = (data?.data ?? []) as AdminPaymentRow[];
  const meta = data?.meta;
  const summary = meta?.summary;

  const totalPages = meta?.totalPages ?? 0;

  const filterLabel = useMemo(() => {
    if (!statusFilter) return "All statuses";
    if (statusFilter === "COMPLETED") return "Completed";
    if (statusFilter === "PENDING") return "Pending";
    if (statusFilter === "FAILED") return "Failed";
    return statusFilter;
  }, [statusFilter]);

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
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-500">Admin · Revenue</p>
          <h1 className="text-3xl font-black tracking-tighter text-white md:text-5xl">
            Payment <span className="text-primary italic">Dashboard</span>
          </h1>
          <p className="mt-2 max-w-xl text-zinc-400">
            Stripe checkout transactions: buy, rent, and subscriptions. Filter by status; totals reflect your database.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-2xl border-white/10"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCcw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Revenue summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-emerald-200/90">
              <TrendingUp className="h-4 w-4" />
              Total revenue (completed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-32 bg-white/10" />
            ) : (
              <p className="text-3xl font-black tabular-nums text-white">
                ${(summary?.revenueCompleted ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Sum of COMPLETED payments</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-950/60">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-zinc-300">
              <Wallet className="h-4 w-4 text-emerald-400" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-16 bg-white/10" />
            ) : (
              <p className="text-3xl font-black tabular-nums text-white">{summary?.countCompleted ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-950/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-amber-200/80">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-16 bg-white/10" />
            ) : (
              <p className="text-3xl font-black tabular-nums text-white">{summary?.countPending ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-950/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-rose-200/80">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-16 bg-white/10" />
            ) : (
              <p className="text-3xl font-black tabular-nums text-white">{summary?.countFailed ?? 0}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CircleDollarSign className="h-5 w-5 text-zinc-500" />
          <span className="text-sm font-semibold text-zinc-400">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "" | PaymentStatus)}
            className={adminSelectClass}
            aria-label="Filter by payment status"
          >
            <option value="">All</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <span className="text-xs text-zinc-600">{filterLabel}</span>
        </div>
        <p className="text-xs text-zinc-500">
          Showing {rows.length} row{rows.length === 1 ? "" : "s"} · Page {page}
          {totalPages > 0 ? ` of ${totalPages}` : ""}
        </p>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-white/10 bg-zinc-950/40">
        {isError && (
          <div className="p-6">
            <Alert className="rounded-2xl border border-rose-500/25 bg-rose-500/10 text-rose-100">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Couldn’t load payments</AlertTitle>
              <AlertDescription>
                {(data as any)?.message ||
                  "Please try again. If the issue persists, check your backend logs / Stripe webhook setup."}
              </AlertDescription>
              <AlertAction>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-9 rounded-xl border-white/15 bg-black/20 text-white hover:bg-white/10"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  Retry
                </Button>
              </AlertAction>
            </Alert>
          </div>
        )}

        {!isLoading && !isError && rows.length === 0 && (
          <div className="p-6">
            <EmptyState
              icon={CircleDollarSign}
              title="No transactions yet"
              description="Once users buy, rent, or subscribe, transactions will appear here."
            />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Movie / plan</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td colSpan={6} className="px-4 py-4">
                      <Skeleton className="h-8 w-full bg-white/5" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-rose-400">
                    Failed to load payments. Is the API running?
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-zinc-500">
                    No transactions match this filter.
                  </td>
                </tr>
              ) : (
                rows.map((p) => {
                  const movieOrPlan = p.movie
                    ? p.movie.title
                    : p.subscription
                      ? `${p.subscription.plan} pass`
                      : "—";
                  return (
                    <tr key={p.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{formatUser(p.user)}</div>
                        <div className="text-[11px] text-zinc-500">{p.user.email}</div>
                      </td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-zinc-300" title={movieOrPlan}>
                        {movieOrPlan}
                      </td>
                      <td className="px-4 py-3 font-mono text-white">
                        ${p.amount.toFixed(2)} <span className="text-xs text-zinc-500">{p.currency}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-300">
                          {typeLabel(p.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ring-1",
                            statusBadge(p.status)
                          )}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-white/10"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-zinc-500">
            {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-white/10"
            disabled={page >= totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
