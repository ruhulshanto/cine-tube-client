import { Clapperboard, MessageCircle, Radio, Star, TrendingUp } from "lucide-react";

interface StatsSectionProps {
  totalMovies?: number;
  activeUsers?: number;
  reviewsCount?: number;
  subscriptionUsers?: number;
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

export function StatsSection({
  totalMovies,
  activeUsers,
  reviewsCount,
  subscriptionUsers,
}: StatsSectionProps) {
  const activity = [
    {
      icon: Radio,
      label: "Viewer pulse",
      value: formatNumber(activeUsers ?? 18400),
      note: "members browsing and watching across the platform",
    },
    {
      icon: Clapperboard,
      label: "Fresh releases",
      value: formatNumber(totalMovies ?? 1250),
      note: "titles available for discovery and curation",
    },
    {
      icon: MessageCircle,
      label: "Reviews posted",
      value: formatNumber(reviewsCount ?? 26300),
      note: "community reactions shaping confidence",
    },
    {
      icon: Star,
      label: "Premium viewers",
      value: formatNumber(subscriptionUsers ?? 6200),
      note: "watching deeper collections and spotlight picks",
    },
  ];

  return (
    <section className="container mx-auto px-6 py-14 md:px-12 lg:px-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            <TrendingUp className="h-3.5 w-3.5" />
            Platform activity
          </p>
          <h2 className="mt-3 text-4xl font-black leading-none tracking-tighter text-white md:text-5xl">
            The library feels active because people keep moving through it.
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">
            These are framed as viewing signals, not investor metrics: watch
            momentum, release depth, reviews, and premium engagement.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {activity.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Live signal
                  </span>
                </div>
                <p className="mt-6 text-3xl font-black tracking-tighter text-white">
                  {item.value}
                </p>
                <p className="mt-2 text-sm font-black text-white">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{item.note}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
