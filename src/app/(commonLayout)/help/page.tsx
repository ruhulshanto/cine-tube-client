"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CircleHelp,
  CreditCard,
  KeyRound,
  MonitorPlay,
  ShieldAlert,
  ArrowRight,
  Film,
  Mail,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

const topics = [
  {
    title: "Account Access",
    text: "Reset passwords, manage profile details, and update account settings.",
    icon: KeyRound,
  },
  {
    title: "Watching Titles",
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
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:px-12 lg:px-20">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[20s] scale-105"
          style={{
            backgroundImage:
              "linear-gradient(to top, #0b0b0b 5%, rgba(11,11,11,0.6) 40%, rgba(11,11,11,0.2)), url('https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2200&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-[#0b0b0b]" />

        <div className="relative max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-6 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-primary">
              <CircleHelp className="h-4 w-4" />
              Support Center
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-6xl font-normal leading-[1.1] tracking-wider md:text-8xl lg:text-9xl"
          >
            How Can We <br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">Help You?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl md:leading-9"
          >
            Quick answers for browsing, watching, payments, and account safety. 
            Our team is always here to ensure your cinematic journey stays smooth.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-5"
          >
            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="#topics">View Help Topics</Link>
            </Button>
          </motion.div>
        </div>

        {/* Center bottom scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Help Topics Grid */}
      <section id="topics" className="relative container mx-auto px-6 py-32 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
        
        <div className="grid gap-6 md:grid-cols-2">
          {topics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <motion.article
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative flex flex-col items-start rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl transition-all hover:bg-white/[0.06] hover:border-primary/40"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="mb-4 text-3xl font-normal tracking-wide text-white uppercase">
                  {topic.title}
                </h3>
                <p className="text-base leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {topic.text}
                </p>
                
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  Read Articles <ArrowRight className="h-3 w-3" />
                </div>

                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Still Stuck? Contact Section */}
      <section className="container mx-auto px-6 pb-32 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-12 backdrop-blur-xl md:p-20 text-center"
        >
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
          
          <div className="relative flex flex-col items-center gap-8">
            <div className="max-w-2xl">
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl font-normal tracking-wide md:text-7xl">
                Still Need <span className="text-primary">Support</span>?
              </h2>
              <p className="mt-6 text-base text-zinc-400 md:text-lg">
                Can&apos;t find what you&apos;re looking for? Reach out to our 24/7 
                cinematic support team for personalized assistance.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="outline" size="lg" className="h-14 rounded-full px-8 border-white/10 bg-white/5 hover:bg-white/10">
                <Mail className="mr-2 h-4 w-4" /> Email Support
              </Button>
              <Button variant="outline" size="lg" className="h-14 rounded-full px-8 border-white/10 bg-white/5 hover:bg-white/10">
                <MessageSquare className="mr-2 h-4 w-4" /> Live Chat
              </Button>
            </div>

            <Button asChild variant="netflix" size="lg" className="h-14 rounded-full px-12 text-base font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.3)]">
              <Link href="/movies">Back to Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Decorative footer element */}
      <div className="flex justify-center pb-12">
        <Film className="h-5 w-5 text-primary/40 animate-pulse" />
      </div>
    </main>
  );
}
