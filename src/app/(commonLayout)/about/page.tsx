import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <Navbar />
      <section
        className="relative isolate flex min-h-[62vh] items-end bg-cover bg-center px-6 pb-16 pt-28 md:px-12 lg:px-20"
        style={{
          backgroundImage:
            "linear-gradient(to top, #0b0b0b 6%, rgba(11,11,11,0.72) 50%, rgba(11,11,11,0.14)), url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=2200&auto=format&fit=crop')",
        }}
      >
        <div className="max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            About Cine-Tube
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
            A Home for Infinite Stories
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Cine-Tube helps viewers discover movies, shows, and live
            entertainment through a fast, polished catalog experience.
          </p>
        </div>
      </section>

      <section
        id="mission"
        className="container mx-auto grid scroll-mt-24 gap-8 px-6 py-20 md:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-20"
      >
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Mission
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tighter md:text-5xl">
            Make great viewing easier to choose.
          </h2>
        </div>
        <p className="text-lg leading-8 text-zinc-400">
          We believe discovery should feel quick, cinematic, and personal. Our
          mission is to bring the catalog, filters, reviews, and premium access
          into one steady experience that helps every viewer move from browsing
          to watching.
        </p>
      </section>

      <section className="container mx-auto px-6 py-20 md:px-12 lg:px-20">
        <Button
          asChild
          variant="netflix"
          className="rounded-2xl font-black uppercase tracking-widest"
        >
          <Link href="/movies">Start exploring</Link>
        </Button>
      </section>
    </main>
  );
}
