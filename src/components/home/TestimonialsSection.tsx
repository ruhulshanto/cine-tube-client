import { Flame, MessageSquareQuote, Star } from "lucide-react";

const COMMUNITY_REACTIONS = [
  {
    title: "Vincenzo",
    signal: "Replayed tonight",
    quote: "Sharp pacing, stylish tension, and exactly the kind of late-night pick I wanted.",
    rating: "9.1",
  },
  {
    title: "Titanic",
    signal: "Community classic",
    quote: "Still the title people return to when they want something emotional and familiar.",
    rating: "8.8",
  },
  {
    title: "Shang-Chi",
    signal: "Rising action pick",
    quote: "Big-screen energy with enough heart to keep it from feeling empty.",
    rating: "8.6",
  },
];

export function TestimonialsSection() {
  return (
    <section className="container mx-auto px-6 py-14 md:px-12 lg:px-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(229,9,20,0.16),transparent_32%)]" />
        <div className="relative">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
                <MessageSquareQuote className="h-3.5 w-3.5" />
                Community pulse
              </p>
              <h2 className="mt-3 text-4xl font-black leading-none tracking-tighter text-white md:text-5xl">
                Reactions should point back to movies, not generic praise.
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-zinc-500 md:text-right">
              Viewer activity creates confidence: ratings, short reactions,
              and titles people keep replaying.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {COMMUNITY_REACTIONS.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-black tracking-tight text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
                      <Flame className="h-3 w-3 fill-current" />
                      {item.signal}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-black text-white">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {item.rating}
                  </span>
                </div>
                <p className="mt-6 text-sm leading-7 text-zinc-300">
                  &quot;{item.quote}&quot;
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
