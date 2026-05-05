import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Globe2, MapPinned } from "lucide-react";

const regions = [
  { name: "Hollywood", tag: "Big-screen hits, franchises, and prestige drama" },
  { name: "Korea", tag: "K-dramas, thrillers, romance, and web originals" },
  { name: "Japan", tag: "Anime, action, mystery, and festival favorites" },
  { name: "India", tag: "Hindi, Bangla, Tamil, and Telugu crowd-pleasers" },
  { name: "Europe", tag: "Crime stories, arthouse cinema, and bold originals" },
  { name: "Global", tag: "Handpicked international titles from every shelf" },
];

export default function BrowseRegionPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <Navbar />
      <section
        className="relative isolate flex min-h-[56vh] items-end bg-cover bg-center px-6 pb-16 pt-28 md:px-12 lg:px-20"
        style={{
          backgroundImage:
            "linear-gradient(to top, #0b0b0b 5%, rgba(11,11,11,0.72) 48%, rgba(11,11,11,0.18)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2200&auto=format&fit=crop')",
        }}
      >
        <div className="max-w-3xl">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            <Globe2 className="h-4 w-4" />
            Browse by region
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">Stories From Everywhere</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Explore regional shelves and jump into the full catalog when you find the mood you want.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-4 px-6 py-14 md:grid-cols-2 md:px-12 lg:grid-cols-3 lg:px-20">
        {regions.map((region) => (
          <Link
            key={region.name}
            href={`/movies?streamingPlatform=&q=${encodeURIComponent(region.name)}`}
            className="group rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition hover:border-primary/40 hover:bg-white/15"
          >
            <MapPinned className="mb-5 h-6 w-6 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">{region.name}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{region.tag}</p>
          </Link>
        ))}
      </section>

      <div className="container mx-auto px-6 pb-20 md:px-12 lg:px-20">
        <Button asChild variant="netflix" className="rounded-2xl font-black uppercase tracking-widest">
          <Link href="/movies">Explore all titles</Link>
        </Button>
      </div>
    </main>
  );
}
