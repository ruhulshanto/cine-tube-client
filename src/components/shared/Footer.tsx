"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AtSign,
  Camera,
  Film,
  Globe,
  Mail,
  MapPin,
  Send,
  Video,
} from "lucide-react";

/* ─── Swap this URL to your Spider-Man backdrop ─────────────── */
const SPIDERMAN_URL =
  "https://res.cloudinary.com/dtph8gqgi/image/upload/v1778611400/spider-man--21603_gjwpvh.jpg";

const FOOTER_NAV = [
  {
    title: "Explore",
    links: [
      { name: "Browse Movies", href: "/movies" },
      { name: "Live TV", href: "/live-tv" },
      { name: "Pricing Plans", href: "/pricing" },
      { name: "New Releases", href: "/movies?sort=newest" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press Kit", href: "/press" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Terms of Use", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Settings", href: "/cookies" },
    ],
  },
];

const SOCIALS = [
  { icon: AtSign, href: "#", label: "Twitter / X" },
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Video, href: "#", label: "YouTube" },
  { icon: Globe, href: "#", label: "Website" },
];

const LEGAL_LINKS = ["Terms", "Privacy", "Cookies", "Accessibility"];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* ══════════════════════════════════════════════════
          FULL-BLEED BACKGROUND IMAGE
      ══════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        <Image
          src={SPIDERMAN_URL}
          alt="CineTube footer backdrop"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
        {/* primary dark overlay — keeps everything readable */}
        <div className="absolute inset-0 bg-[#060606]/90" />
        {/* top edge — seamless blend from page */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#060606] to-transparent" />
        {/* bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#060606] to-transparent" />
        {/* left cinematic red atmospheric glow */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(229,9,20,0.15),transparent_65%)]" />
        {/* right soft white glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_65%)]" />
      </div>

      {/* top accent line */}
      <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* ══════════════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════════════ */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-12 md:px-12 lg:px-20">

        {/* ── ROW 1: Brand + Newsletter ───────────────────── */}
        <div className="grid gap-10 border-b border-white/[0.08] pb-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">

          {/* Brand */}
          <div>
            <Link href="/" className="group flex items-center">
              <span
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                className="text-3xl md:text-4xl text-white tracking-[0.18em] font-normal relative transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:tracking-[0.30em] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-white/0 after:via-white after:to-white/0 after:transition-all after:duration-700 after:rounded-full group-hover:after:w-full group-hover:after:animate-[pulse_2s_infinite]"
              >
                CINE-TUBE

                {/* Floating particles */}
                <span className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <span className="absolute top-0 left-1/4 w-[1px] h-[2px] bg-white/80 rounded-full animate-[float_3s_infinite_0.2s]"></span>
                  <span className="absolute top-1/2 left-1/3 w-[1px] h-[1px] bg-white/60 rounded-full animate-[float_2.8s_infinite_0.5s]"></span>
                  <span className="absolute top-1/4 right-1/3 w-[1px] h-[2px] bg-white/70 rounded-full animate-[float_3.2s_infinite_0.3s]"></span>
                  <span className="absolute top-3/4 left-1/2 w-[1px] h-[1px] bg-white/50 rounded-full animate-[float_2.5s_infinite_0.7s]"></span>
                  <span className="absolute top-1/3 right-1/4 w-[1px] h-[2px] bg-white/80 rounded-full animate-[float_3.5s_infinite_0.1s]"></span>
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">
              One place for movies, reviews, and picks you actually want to
              watch. No noise — just cinema, the way it should be.
            </p>

            <p className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-600">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Global · Est. 2024
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-500 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm">
            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
              <Mail className="h-3.5 w-3.5" />
              Stay in the loop
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              New releases, curated picks, and platform updates — delivered
              weekly. No spam, ever.
            </p>
            <div className="mt-4 flex overflow-hidden rounded-xl border border-white/10 bg-black/30 focus-within:border-primary/40 transition-colors">
              <input
                type="email"
                placeholder="your@email.com"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none"
              />
              <button className="flex shrink-0 items-center gap-2 bg-primary px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#ff1f1f] active:scale-95">
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </div>
            <p className="mt-3 text-[10px] text-zinc-700">
              By subscribing you agree to our Privacy Policy.
            </p>
          </div>
        </div>

        {/* ── ROW 2: Nav Columns ──────────────────────────── */}
        <div className="grid grid-cols-2 gap-8 border-b border-white/[0.08] py-12 sm:grid-cols-3">
          {FOOTER_NAV.map((section) => (
            <div key={section.title}>
              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
                {section.title}
              </p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 rounded-full bg-primary transition-all duration-200 group-hover:w-3" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── ROW 3: Bottom bar ───────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-6 pt-10 sm:flex-row">
          <p className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-[11px] font-bold text-zinc-500 backdrop-blur-sm transition hover:border-white/20 hover:text-zinc-300">
            © {year} CineTube. All rights reserved.
          </p>

          {/* live signal */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-sm transition hover:border-primary/40 hover:bg-primary/5 group cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <p className="text-[11px] font-bold text-zinc-500 transition group-hover:text-white">
              18,400 watching right now
            </p>
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-[11px] font-bold text-zinc-500 backdrop-blur-sm transition hover:border-primary/40 hover:bg-primary/10 hover:text-white"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CINEMATIC WATERMARK — sits on top of the image
      ══════════════════════════════════════════════════ */}
      <div
        aria-hidden
        className="pointer-events-none relative z-10 select-none overflow-hidden pb-4 text-center"
      >
        <p className="whitespace-nowrap text-[clamp(5rem,14vw,11rem)] font-black uppercase leading-none tracking-[0.04em] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.1] via-white/[0.03] to-transparent drop-shadow-[0_0_30px_rgba(229,9,20,0.05)]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.03)' }}>
          CineTube
        </p>
      </div>
    </footer>
  );
}
