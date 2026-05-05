"use client";

import { CardSkeleton, PlayerSkeleton as SharedPlayerSkeleton } from "@/components/shared/AppSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

export const PlayerSkeleton = () => <SharedPlayerSkeleton />;

export const ChannelSkeleton = () => <CardSkeleton variant="channel" />;

export const CategorySkeleton = () => (
  <div className="flex gap-3 pb-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-[38px] rounded-lg bg-white/10"
        style={{ width: `${72 + i * 12}px` }}
      />
    ))}
  </div>
);

export const ProgramGuideSkeleton = () => (
  <div className="space-y-4 rounded-lg border border-white/10 bg-[#141414] p-6">
    <Skeleton className="h-6 w-1/4 rounded-xl bg-white/10" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-1/3 rounded-lg bg-white/5" />
          <Skeleton className="h-7 w-3/4 rounded-xl bg-white/10" />
          <Skeleton className="h-4 w-1/2 rounded-lg bg-white/5" />
        </div>
      ))}
    </div>
  </div>
);
