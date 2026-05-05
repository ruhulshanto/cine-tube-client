import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Crown, Play, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    note: "Browse and watch free titles",
    features: [
      "Free catalog access",
      "Search and filters",
      "Community reviews",
    ],
  },
  {
    name: "Monthly",
    price: "$9.99",
    note: "Premium access with flexible billing",
    features: ["Premium movies", "Live entertainment", "Cancel anytime"],
    featured: true,
  },
  {
    name: "Yearly",
    price: "$99.99",
    note: "Best value for regular viewers",
    features: [
      "All monthly features",
      "Lower yearly price",
      "Priority releases",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <section className="container mx-auto px-6 pb-10 pt-32 text-center md:px-12 lg:px-20">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
          Pricing
        </p>
        <h1 className="mx-auto max-w-4xl text-4xl font-black uppercase tracking-tighter md:text-6xl">
          Choose the Access That Fits Your Nights
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Start free, upgrade for premium titles, and keep your watchlist
          moving.
        </p>
      </section>

      <section className="container mx-auto grid gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-2xl border p-6 backdrop-blur-md ${plan.featured ? "border-primary/35 bg-white/10" : "border-white/10 bg-white/10"}`}
          >
            {plan.featured ? (
              <Crown className="mb-5 h-7 w-7 text-primary" />
            ) : (
              <Play className="mb-5 h-7 w-7 text-primary" />
            )}
            <h2 className="text-2xl font-black">{plan.name}</h2>
            <p className="mt-2 text-sm text-zinc-400">{plan.note}</p>
            <div className="mt-6 text-4xl font-black">{plan.price}</div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8 inline-flex items-center rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300">
              {plan.featured
                ? "Popular choice"
                : plan.name === "Free"
                  ? "Always free"
                  : "Best value"}
            </div>
          </article>
        ))}
      </section>

      <section className="container mx-auto px-6 pb-20 md:px-12 lg:px-20">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md md:flex-row md:items-center md:justify-between">
          <div>
            <Sparkles className="mb-4 h-6 w-6 text-primary" />
            <h2 className="text-2xl font-black">Not sure yet?</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Explore the catalog first and upgrade when premium calls.
            </p>
          </div>
          <Button
            asChild
            variant="netflix"
            className="rounded-2xl font-black uppercase tracking-widest"
          >
            <Link href="/login">Get started</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
