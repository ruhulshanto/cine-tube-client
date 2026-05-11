import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Avery James",
    rating: 5,
    comment:
      "Cine-Tube made browsing new titles effortless. The recommendations feel like they were built just for me.",
  },
  {
    name: "Riley Morgan",
    rating: 4,
    comment:
      "The streaming experience is fast, the discovery tools are excellent, and I can watch across every device.",
  },
  {
    name: "Jordan Lee",
    rating: 5,
    comment:
      "I love the curated collections and the homepage feels like a premium entertainment dashboard.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="container mx-auto px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          Testimonials
        </p>
        <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">
          What movie lovers are saying.
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-zinc-400">
          Real feedback from viewers who use Cine-Tube to discover, compare, and
          watch with confidence.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <Card key={item.name} className="border-white/10 bg-white/5 p-6">
            <CardHeader className="p-0">
              <div className="flex items-center gap-2">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 text-amber-400" />
                ))}
              </div>
              <CardTitle className="mt-4 text-xl">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 text-zinc-300">
              {item.comment}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
