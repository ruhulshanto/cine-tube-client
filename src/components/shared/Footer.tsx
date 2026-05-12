"use client";

import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { name: "Browse Movies", href: "/movies" },
        { name: "Live TV", href: "/live-tv" },
        { name: "Pricing Plans", href: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Terms", href: "/terms" },
        { name: "Privacy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="bg-[#080808] border-t border-white/10 text-zinc-400">
      <div className="container mx-auto px-6 py-8 md:px-12 lg:px-20">
        <div className="grid gap-8 md:grid-cols-[1.25fr_repeat(3,0.9fr)]">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-base font-black text-white"
            >
              <div className="rounded-lg bg-[#e50914] p-2">
                <Film className="h-5 w-5 text-white" />
              </div>
              CineTube
            </Link>
            <p className="max-w-sm text-sm leading-6 text-zinc-500">
              A quieter finish for browsing, with easy access to support and
              policies.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                {section.title}
              </p>
              <ul className="space-y-2 text-sm text-zinc-400">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="transition hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-sm text-zinc-500">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs">
              © {currentYear} CineTube. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
