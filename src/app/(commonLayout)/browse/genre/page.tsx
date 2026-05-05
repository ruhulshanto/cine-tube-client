import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GENRE_OPTIONS } from "@/lib/adminMovie.schemas";
import { Clapperboard } from "lucide-react";

export default function BrowseGenrePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <section className="container mx-auto px-6 pb-10 pt-32 md:px-12 lg:px-20">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">Browse by genre</p>
        <h1 className="max-w-4xl text-4xl font-black uppercase tracking-tighter md:text-6xl">
          Pick a Mood, Start a Watch
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Every genre opens the catalog with matching filters, so the next title is never far away.
        </p>
      </section>

      <section className="container mx-auto grid gap-3 px-6 pb-20 md:grid-cols-3 md:px-12 lg:grid-cols-4 lg:px-20">
        {GENRE_OPTIONS.map((genre) => (
          <Link
            key={genre}
            href={`/movies?genre=${encodeURIComponent(genre)}&sortBy=createdAt&sortOrder=desc`}
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md transition hover:border-primary/40 hover:bg-white/15"
          >
            <span className="font-bold text-zinc-100">{genre}</span>
            <Clapperboard className="h-4 w-4 text-zinc-500 transition group-hover:text-primary" />
          </Link>
        ))}
      </section>

      <div className="container mx-auto px-6 pb-20 md:px-12 lg:px-20">
        <Button asChild variant="outline" className="rounded-2xl border-white/10 bg-white/5">
          <Link href="/movies">View full catalog</Link>
        </Button>
      </div>
    </main>
  );
}
