import {
  CategorySkeleton,
  ChannelSkeleton,
  PlayerSkeleton,
  ProgramGuideSkeleton,
} from "@/components/skeleton/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] p-4 text-white lg:p-8">
      <div className="space-y-8">
        <CategorySkeleton />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <PlayerSkeleton />
            <ProgramGuideSkeleton />
          </div>
          <div className="space-y-2 lg:col-span-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <ChannelSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
