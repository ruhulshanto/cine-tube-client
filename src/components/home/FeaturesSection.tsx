import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Globe, ShieldCheck, Sparkles, Laptop } from "lucide-react";

const FEATURES = [
  {
    title: "Unlimited streaming",
    description:
      "Access thousands of movies and series without limits, all in one polished library.",
    Icon: Globe,
  },
  {
    title: "Personalized recommendations",
    description:
      "Find new favorites faster with movie suggestions tailored to your taste.",
    Icon: Sparkles,
  },
  {
    title: "Multi-device access",
    description:
      "Watch on desktop, tablet, or mobile with seamless playback and syncing.",
    Icon: Laptop,
  },
  {
    title: "Secure payments",
    description:
      "Subscribe confidently with encrypted checkout and recurring billing support.",
    Icon: ShieldCheck,
  },
];

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          Platform benefits
        </p>
        <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">
          Everything you need to discover, stream, and enjoy.
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-zinc-400">
          Cine-Tube brings curated collections, smart discovery, and premium
          access into a single cinematic experience.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-white/10 bg-white/5 p-6">
            <CardHeader className="gap-4 p-0">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/15 text-primary">
                <feature.Icon className="h-6 w-6" />
              </div>
              <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2 text-zinc-400">
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
