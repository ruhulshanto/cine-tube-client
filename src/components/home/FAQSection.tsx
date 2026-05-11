import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How does subscription work?",
    answer:
      "Premium plans unlock unlimited access to all titles, personalized recommendations, and priority support. Billing renews automatically unless cancelled.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel anytime from your account settings and keep access until the end of your current billing period.",
  },
  {
    question: "Do I need an account to browse?",
    answer:
      "No. Browsing is available without logging in, but you must register to save favorites, post reviews, and subscribe.",
  },
  {
    question: "What devices are supported?",
    answer:
      "Cine-Tube works on desktop, tablet, and mobile browsers so you can enjoy content wherever you are.",
  },
];

export function FAQSection() {
  return (
    <section className="container mx-auto px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          FAQ
        </p>
        <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">
          Common questions answered.
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-zinc-400">
          Quick answers to the most important questions before you join
          Cine-Tube.
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {FAQS.map((item) => (
          <details
            key={item.question}
            className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-all duration-300"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-white">
              {item.question}
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="mt-4 text-zinc-400 leading-7">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
