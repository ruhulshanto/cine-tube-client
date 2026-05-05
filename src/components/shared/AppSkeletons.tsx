import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type PageSkeletonProps = {
  variant?: "home" | "detail" | "dashboard" | "browse" | "auth";
  className?: string;
};

export function CardSkeleton({
  className,
  variant = "movie",
}: {
  className?: string;
  variant?: "movie" | "channel" | "compact";
}) {
  if (variant === "channel") {
    return (
      <div className={cn("border-b border-white/5 p-4", className)}>
        <div className="flex items-start gap-3">
          <Skeleton className="h-9 w-12 shrink-0 rounded-lg bg-white/10" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-lg bg-white/10" />
            <Skeleton className="h-3 w-full rounded-lg bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-4", className)}>
        <div className="flex gap-4">
          <Skeleton className="h-20 w-16 shrink-0 rounded-xl bg-white/10" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-2/3 rounded-lg bg-white/10" />
            <Skeleton className="h-4 w-full rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-1/2 rounded-lg bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex aspect-[2/3] flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] p-4", className)}>
      <Skeleton className="min-h-0 flex-1 rounded-2xl bg-white/5" />
      <div className="space-y-4 px-2 pt-4">
        <Skeleton className="h-8 w-3/4 rounded-xl bg-white/10" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12 rounded-lg bg-white/5" />
          <Skeleton className="h-4 w-12 rounded-lg bg-white/5" />
        </div>
        <Skeleton className="h-12 w-full rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

export function PlayerSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-white/10 bg-[#141414]", className)}>
      <Skeleton className="aspect-video w-full rounded-none bg-white/10" />
      <div className="space-y-3 border-t border-white/10 bg-[#0b0b0b] p-4">
        <Skeleton className="h-6 w-1/3 rounded-xl bg-white/10" />
        <Skeleton className="h-4 w-1/2 rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

export function ListSkeleton({
  count = 6,
  variant = "compact",
  className,
}: {
  count?: number;
  variant?: "compact" | "channel";
  className?: string;
}) {
  return (
    <div className={cn(variant === "channel" ? "overflow-hidden rounded-lg border border-white/10 bg-[#141414]" : "space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} variant={variant === "channel" ? "channel" : "compact"} />
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]", className)}>
      <div className="grid gap-4 border-b border-white/10 p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 rounded-lg bg-white/10" />
        ))}
      </div>
      <div className="divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, column) => (
              <Skeleton key={column} className="h-8 rounded-xl bg-white/5" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton({ variant = "dashboard", className }: PageSkeletonProps) {
  if (variant === "auth") {
    return (
      <main className={cn("flex min-h-screen items-center justify-center bg-[#0b0b0b] p-6", className)}>
        <div className="w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <Skeleton className="mx-auto h-12 w-12 rounded-2xl bg-white/10" />
          <Skeleton className="mx-auto h-8 w-2/3 rounded-xl bg-white/10" />
          <Skeleton className="h-12 w-full rounded-2xl bg-white/5" />
          <Skeleton className="h-12 w-full rounded-2xl bg-white/5" />
          <Skeleton className="h-12 w-full rounded-2xl bg-white/10" />
        </div>
      </main>
    );
  }

  if (variant === "home") {
    return (
      <main className={cn("min-h-screen bg-[#0b0b0b]", className)}>
        <Skeleton className="h-[72vh] min-h-[520px] w-full rounded-none bg-white/10" />
        <div className="relative z-10 mx-auto -mt-24 max-w-[1600px] space-y-8 px-6 pb-20 md:px-12 lg:px-20">
          <Skeleton className="h-44 w-full rounded-2xl bg-white/5" />
          {Array.from({ length: 4 }).map((_, row) => (
            <section key={row} className="space-y-4">
              <Skeleton className="h-8 w-56 rounded-xl bg-white/10" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    );
  }

  if (variant === "detail") {
    return (
      <main className={cn("min-h-screen bg-[#0b0b0b] pb-24", className)}>
        <Skeleton className="h-[72vh] min-h-[520px] w-full rounded-none bg-white/10" />
        <div className="container mx-auto -mt-8 space-y-12 px-6 md:px-12 lg:px-20">
          <Skeleton className="h-16 w-80 rounded-3xl bg-white/10" />
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <Skeleton className="h-10 w-64 rounded-xl bg-white/10" />
              <Skeleton className="h-40 w-full rounded-3xl bg-white/5" />
            </div>
            <div className="space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 lg:col-span-5">
              <Skeleton className="h-8 w-52 rounded-xl bg-white/10" />
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full rounded-xl bg-white/5" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (variant === "browse") {
    return (
      <main className={cn("min-h-screen bg-[#0b0b0b] px-6 py-12 md:px-12 lg:px-20", className)}>
        <div className="mx-auto max-w-[1600px] space-y-10">
          <Skeleton className="h-40 w-full rounded-2xl bg-white/5" />
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={cn("min-h-screen bg-[#0b0b0b] p-6 md:p-10", className)}>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-4 border-b border-white/10 pb-8">
          <Skeleton className="h-5 w-48 rounded-lg bg-white/10" />
          <Skeleton className="h-12 w-80 rounded-xl bg-white/10" />
          <Skeleton className="h-5 w-96 max-w-full rounded-lg bg-white/5" />
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
