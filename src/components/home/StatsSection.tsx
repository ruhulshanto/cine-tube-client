import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, MoveIcon, Star, Users } from "lucide-react";

interface StatsSectionProps {
  totalMovies?: number;
  activeUsers?: number;
  reviewsCount?: number;
  subscriptionUsers?: number;
}

const STAT_ITEMS = [
  {
    key: "totalMovies",
    label: "Total movies",
    icon: MoveIcon,
  },
  {
    key: "activeUsers",
    label: "Active users",
    icon: Users,
  },
  {
    key: "reviewsCount",
    label: "Reviews",
    icon: Star,
  },
  {
    key: "subscriptionUsers",
    label: "Subscribers",
    icon: CircleDollarSign,
  },
] as const;

export function StatsSection({
  totalMovies,
  activeUsers,
  reviewsCount,
  subscriptionUsers,
}: StatsSectionProps) {
  const values = {
    totalMovies: totalMovies ?? 1250,
    activeUsers: activeUsers ?? 18400,
    reviewsCount: reviewsCount ?? 26300,
    subscriptionUsers: subscriptionUsers ?? 6200,
  };

  return (
    <section className="container mx-auto px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          Platform growth
        </p>
        <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">
          Metrics that show our momentum.
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-zinc-400">
          Real viewing numbers, active membership, and community feedback that
          demonstrate a scalable streaming platform.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_ITEMS.map((item) => {
          const Icon = item.icon;
          const value = values[item.key];
          return (
            <Card key={item.key} className="border-white/10 bg-white/5 p-6">
              <CardHeader className="gap-4 p-0">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/5 text-white ring-1 ring-white/10">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-4 text-3xl text-white">
                  {typeof value === "number" ? value.toLocaleString() : value}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-4 text-zinc-400">
                {item.label}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
