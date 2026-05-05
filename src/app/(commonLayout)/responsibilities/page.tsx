import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartHandshake, ShieldCheck } from "lucide-react";

export default function ResponsibilitiesPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <section
        className="relative isolate flex min-h-[62vh] items-end bg-cover bg-center px-6 pb-16 pt-28 md:px-12 lg:px-20"
        style={{
          backgroundImage:
            "linear-gradient(to top, #0b0b0b 6%, rgba(11,11,11,0.7) 50%, rgba(11,11,11,0.12)), url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2200&auto=format&fit=crop')",
        }}
      >
        <div className="max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Responsibilities
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Built with Care
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            We're committed to creating a responsible platform for viewers and
            creators alike.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 md:px-12 lg:px-20">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">
          Our Commitment
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tighter md:text-5xl">
          Built with care for viewers and creators.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <ShieldCheck className="mb-5 h-6 w-6 text-primary" />
            <h3 className="text-xl font-black">Safer access</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Clear account states, moderated reviews, and premium prompts keep
              the experience predictable.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <HeartHandshake className="mb-5 h-6 w-6 text-primary" />
            <h3 className="text-xl font-black">Responsible cataloging</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Titles are presented with helpful context so viewers can choose
              with confidence.
            </p>
          </article>
        </div>
        <Button
          asChild
          variant="netflix"
          className="mt-10 rounded-2xl font-black uppercase tracking-widest"
        >
          <Link href="/movies">Start exploring</Link>
        </Button>
      </section>
    </main>
  );
}
