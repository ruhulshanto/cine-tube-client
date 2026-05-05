import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift, Mail, PartyPopper, WalletCards } from "lucide-react";

const steps = [
  { title: "Pick a value", text: "Choose a gift amount for movie nights, premium access, or a watch-party surprise.", icon: WalletCards },
  { title: "Send the code", text: "Share a digital code with a friend, family member, or fellow film fan.", icon: Mail },
  { title: "Start watching", text: "The recipient signs in and uses the balance toward Cine-Tube access.", icon: PartyPopper },
];

export default function GiftCardsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <section
        className="relative isolate flex min-h-[58vh] items-end bg-cover bg-center px-6 pb-16 pt-28 md:px-12 lg:px-20"
        style={{
          backgroundImage:
            "linear-gradient(to top, #0b0b0b 6%, rgba(11,11,11,0.74) 52%, rgba(11,11,11,0.14)), url('https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2200&auto=format&fit=crop')",
        }}
      >
        <div className="max-w-3xl">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            <Gift className="h-4 w-4" />
            Gift cards
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">Give Someone Their Next Favorite Story</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            A simple gift-card landing page for Cine-Tube access, movie nights, and premium discovery.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-4 px-6 py-16 md:grid-cols-3 md:px-12 lg:px-20">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
              <Icon className="mb-5 h-7 w-7 text-primary" />
              <h2 className="text-xl font-black">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{step.text}</p>
            </article>
          );
        })}
      </section>

      <div className="container mx-auto px-6 pb-20 md:px-12 lg:px-20">
        <Button asChild variant="netflix" className="rounded-2xl font-black uppercase tracking-widest">
          <Link href="/pricing">View pricing</Link>
        </Button>
      </div>
    </main>
  );
}
