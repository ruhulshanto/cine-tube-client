import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { MonitorPlay, PlayCircle, Radio } from "lucide-react";

const shelves = ["Limited Series", "K-Drama Picks", "Crime Chapters", "Comedy Bites", "Weekly Originals", "Docu-Series"];

export default function WebShowsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <Navbar />
      <section
        className="relative isolate flex min-h-[58vh] items-end bg-cover bg-center px-6 pb-16 pt-28 md:px-12 lg:px-20"
        style={{
          backgroundImage:
            "linear-gradient(to top, #0b0b0b 4%, rgba(11,11,11,0.75) 48%, rgba(11,11,11,0.12)), url('https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2200&auto=format&fit=crop')",
        }}
      >
        <div className="max-w-3xl">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            <MonitorPlay className="h-4 w-4" />
            Web shows
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">Series Built for One More Episode</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Browse serialized stories, short seasons, and streaming-first favorites from one clean shelf.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-4 px-6 py-14 md:grid-cols-2 md:px-12 lg:grid-cols-3 lg:px-20">
        {shelves.map((shelf, index) => (
          <Link
            key={shelf}
            href={`/movies?q=${encodeURIComponent(shelf)}`}
            className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition hover:border-primary/40 hover:bg-white/15"
          >
            {index % 2 === 0 ? <PlayCircle className="mb-5 h-6 w-6 text-primary" /> : <Radio className="mb-5 h-6 w-6 text-primary" />}
            <h2 className="text-2xl font-black tracking-tight">{shelf}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Open a focused Explore search for this web-show shelf.</p>
          </Link>
        ))}
      </section>

      <div className="container mx-auto px-6 pb-20 md:px-12 lg:px-20">
        <Button asChild variant="netflix" className="rounded-2xl font-black uppercase tracking-widest">
          <Link href="/movies">Browse all titles</Link>
        </Button>
      </div>
    </main>
  );
}
