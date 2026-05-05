import { Navbar } from "@/components/shared/Navbar";
import { Sparkles } from "lucide-react";

const values = [
  {
    title: "Curated discovery",
    text: "We make it easier to find a title that fits the night, not just the algorithm.",
  },
  {
    title: "Creator respect",
    text: "Our platform is built around clear access, visible context, and responsible presentation.",
  },
  {
    title: "Community trust",
    text: "Reviews, moderation, and account controls help keep the experience useful and human.",
  },
];

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <Navbar />
      <section
        className="relative isolate flex min-h-[62vh] items-end bg-cover bg-center px-6 pb-16 pt-28 md:px-12 lg:px-20"
        style={{
          backgroundImage:
            "linear-gradient(to top, #0b0b0b 6%, rgba(11,11,11,0.72) 50%, rgba(11,11,11,0.14)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2200&auto=format&fit=crop')",
        }}
      >
        <div className="max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Our Story
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Built on Core Values
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Cine-Tube was created with three core values that drive everything
            we do.
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto grid gap-4 px-6 py-16 md:grid-cols-3 md:px-12 lg:px-20">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md"
            >
              <Sparkles className="mb-5 h-6 w-6 text-primary" />
              <h3 className="text-xl font-black">{value.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
