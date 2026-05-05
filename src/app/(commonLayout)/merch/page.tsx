import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Package, Shirt, ShoppingBag, Ticket } from "lucide-react";

const merch = [
  { name: "Logo Hoodie", detail: "Heavyweight black fleece with Cine-Tube mark", icon: Shirt },
  { name: "Premiere Tee", detail: "Soft cotton tee inspired by midnight screenings", icon: ShoppingBag },
  { name: "Collector Poster", detail: "Minimal wall print for the home theater corner", icon: Package },
  { name: "Watch Party Pass", detail: "Giftable merch bundle for movie nights", icon: Ticket },
];

export default function MerchPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <Navbar />
      <section
        className="relative isolate flex min-h-[58vh] items-end bg-cover bg-center px-6 pb-16 pt-28 md:px-12 lg:px-20"
        style={{
          backgroundImage:
            "linear-gradient(to top, #0b0b0b 6%, rgba(11,11,11,0.7) 50%, rgba(11,11,11,0.12)), url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2200&auto=format&fit=crop')",
        }}
      >
        <div className="max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">Merch store</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">Wear the Watchlist</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            A small storefront preview for Cine-Tube gear, gifts, and watch-party essentials.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-4 px-6 py-16 md:grid-cols-2 md:px-12 lg:grid-cols-4 lg:px-20">
        {merch.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.name} className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
              <Icon className="mb-5 h-7 w-7 text-primary" />
              <h2 className="text-xl font-black">{item.name}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{item.detail}</p>
            </article>
          );
        })}
      </section>

      <div className="container mx-auto px-6 pb-20 md:px-12 lg:px-20">
        <Button asChild variant="outline" className="rounded-2xl border-white/10 bg-white/5">
          <Link href="/movies">Browse before you buy</Link>
        </Button>
      </div>
    </main>
  );
}
