"use client"

import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <div className="aspect-[2/3] rounded-[2rem] overflow-hidden glass-morphism border-white/5 flex flex-col p-4 space-y-4">
      {/* Poster Placeholder */}
      <Skeleton className="w-full h-full rounded-2xl bg-white/5" />
      
      {/* Content Placeholder */}
      <div className="space-y-4 px-2">
        <Skeleton className="h-8 w-3/4 rounded-xl bg-white/10" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12 rounded-lg bg-white/5" />
          <Skeleton className="h-4 w-12 rounded-lg bg-white/5" />
        </div>
        <Skeleton className="h-12 w-full mt-4 rounded-2xl bg-[#e50914]/20" />
      </div>
    </div>
  );
}
