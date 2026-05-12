import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Can I browse before creating an account?",
    answer:
      "Yes. You can explore the library first, then create an account when you want to save, review, subscribe, rent, or continue watching.",
  },
  {
    question: "What unlocks with premium access?",
    answer:
      "Premium access is designed for deeper collections, personalized rails, and eligible premium titles while free browsing remains available.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Cancellation stays available from account settings, and access continues through the current billing period.",
  },
];

export function FAQSection() {
  return (
    <section className="container mx-auto px-6 py-10 md:px-12 lg:px-20">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Common questions
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tighter text-white md:text-4xl">
            Quick answers before you watch.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
            Everything here is about browsing, premium access, and the first
            steps into CineTube.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item) => (
            <details
              key={item.question}
              className="group rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-white">
                {item.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="mt-3 text-sm leading-6 text-zinc-400">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
