import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-[#090909] py-20">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/20 sm:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Ready to start?
              </p>
              <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">
                Start watching now with Cine-Tube.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-zinc-400">
                Join thousands of members who stream smarter, save favorites,
                and enjoy premium collections.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-[2rem] bg-[#0b0b0b] p-8">
              <Button asChild variant="netflix" size="lg" className="w-full">
                <Link href="/register">Create account</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/movies">Browse movies</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
