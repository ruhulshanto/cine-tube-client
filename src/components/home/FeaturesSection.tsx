import {
  BrainCircuit,
  Clock3,
  ListPlus,
  Radar,
  Search,
  Sparkles,
} from "lucide-react";

const INTELLIGENCE_SIGNALS = [
  {
    icon: Sparkles,
    label: "Streamlined browsing",
    value: "Clear categories, fast choices",
  },
  {
    icon: Clock3,
    label: "Easy return",
    value: "Pick up a title without extra navigation",
  },
  {
    icon: ListPlus,
    label: "Saved picks",
    value: "Favorites stay easy to find",
  },
  {
    icon: Search,
    label: "Relevant search",
    value: "Results stay focused and simple",
  },
];

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-6 py-14 md:px-12 lg:px-20">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025] shadow-[0_32px_80px_-50px_rgba(0,0,0,0.9)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.06),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.03),transparent_55%)]" />
        <div className="relative grid gap-8 p-5 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div className="flex flex-col justify-between gap-10">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
                <BrainCircuit className="h-3.5 w-3.5" />
                Streamlined browsing
              </p>
              <h2 className="mt-3 text-4xl font-black leading-[0.98] tracking-tighter text-white md:text-5xl">
                Built for effortless discovery.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">
                A clean homepage, simple labels, and quick access to what
                matters. It should help you find a movie without extra
                explanation.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {INTELLIGENCE_SIGNALS.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div
                    key={signal.label}
                    className="rounded-2xl border border-white/10 bg-black/25 p-4"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                      {signal.label}
                    </p>
                    <p className="mt-2 text-sm font-bold leading-5 text-white">
                      {signal.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.04),transparent_34%)]" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                    Current intent
                  </p>
                  <p className="mt-1 text-xl font-black tracking-tight text-white">
                    Matching tonight&apos;s mood
                  </p>
                </div>
                <Radar className="h-5 w-5 text-primary" />
              </div>

              {[
                [
                  "Browse first",
                  "Move quickly between categories and top titles",
                  "Fast access",
                ],
                [
                  "Start watching",
                  "A few strong titles are one tap away",
                  "Ready now",
                ],
                [
                  "Fresh arrivals",
                  "Recent releases stay visible in the lineup",
                  "New",
                ],
                [
                  "Clear results",
                  "Search returns concise options you can act on",
                  "Focused",
                ],
              ].map(([label, copy, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-white">{label}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {copy}
                      </p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
