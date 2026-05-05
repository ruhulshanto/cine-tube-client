import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CircleHelp,
  CreditCard,
  KeyRound,
  MonitorPlay,
  ShieldAlert,
} from "lucide-react";

const topics = [
  {
    title: "Account access",
    text: "Reset passwords, manage profile details, and update account settings.",
    icon: KeyRound,
  },
  {
    title: "Watching titles",
    text: "Find movies, open details, use premium access, and manage playback.",
    icon: MonitorPlay,
  },
  {
    title: "Payments",
    text: "Review purchases, subscription status, and payment success flows.",
    icon: CreditCard,
  },
  {
    title: "Safety",
    text: "Understand moderation, reports, and responsible review visibility.",
    icon: ShieldAlert,
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <section className="container mx-auto px-6 pb-10 pt-32 md:px-12 lg:px-20">
        <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
          <CircleHelp className="h-4 w-4" />
          Help center
        </p>
        <h1 className="max-w-4xl text-4xl font-black uppercase tracking-tighter md:text-6xl">
          How Can We Help?
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Quick answers for browsing, watching, payments, account access, and
          platform safety.
        </p>
      </section>

      <section className="container mx-auto grid gap-4 px-6 pb-16 md:grid-cols-2 md:px-12 lg:px-20">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <article
              key={topic.title}
              className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md"
            >
              <Icon className="mb-5 h-7 w-7 text-primary" />
              <h2 className="text-2xl font-black">{topic.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {topic.text}
              </p>
            </article>
          );
        })}
      </section>

      <section className="container mx-auto px-6 pb-20 md:px-12 lg:px-20">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md md:p-8">
          <h2 className="text-2xl font-black">Still stuck?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Visit your dashboard for profile and purchase details, or return to
            Explore and retry the action.
          </p>
          <div className="mt-6">
            <Button
              asChild
              variant="netflix"
              className="rounded-2xl font-black uppercase tracking-widest"
            >
              <Link href="/movies">Go to Explore</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
