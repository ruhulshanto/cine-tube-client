import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Flame, Sparkles, Star, Trophy, Wand2 } from "lucide-react";

const categories = [
  { title: "Trending Now", href: "/movies?sortBy=views&sortOrder=desc", icon: Flame },
  { title: "Top Rated", href: "/movies?sortBy=highest-rated&sortOrder=desc", icon: Star },
  { title: "Latest Releases", href: "/movies?sortBy=latest&sortOrder=desc", icon: Sparkles },
  { title: "Most Reviewed", href: "/movies?sortBy=most-reviewed&sortOrder=desc", icon: BadgeCheck },
  { title: "Premium Picks", href: "/movies?q=premium", icon: Trophy },
  { title: "Hidden Gems", href: "/movies?sortBy=createdAt&sortOrder=desc", icon: Wand2 },
];

export default function BrowseCategoriesPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <section className="container mx-auto px-6 pb-10 pt-32 md:px-12 lg:px-20">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">Browse categories</p>
        <h1 className="max-w-4xl text-4xl font-black uppercase tracking-tighter md:text-6xl">
          Fast Lanes Into the Catalog
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Jump straight into popular collections, new drops, and editor-friendly discovery paths.
        </p>
      </section>

      <section className="container mx-auto grid gap-4 px-6 pb-20 md:grid-cols-2 md:px-12 lg:grid-cols-3 lg:px-20">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.title}
              href={category.href}
              className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition hover:border-primary/40 hover:bg-white/15"
            >
              <Icon className="mb-6 h-7 w-7 text-primary" />
              <h2 className="text-2xl font-black tracking-tight">{category.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">Open this collection in Explore with matching sorting.</p>
            </Link>
          );
        })}
      </section>

      <div className="container mx-auto px-6 pb-20 md:px-12 lg:px-20">
        <Button asChild variant="netflix" className="rounded-2xl font-black uppercase tracking-widest">
          <Link href="/movies">Explore all films</Link>
        </Button>
      </div>
    </main>
  );
}
