"use client";

import Link from "next/link";
import { Film, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { IoLogoGithub, IoLogoInstagram, IoLogoTwitter, IoLogoYoutube } from "react-icons/io5";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { name: "Browse Movies", href: "/movies" },
        { name: "Live TV", href: "/live-tv" },
        { name: "Pricing Plans", href: "/pricing" },
        { name: "Gift Cards", href: "/gift-cards" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Story", href: "/story" },
        { name: "Careers", href: "/careers" },
        { name: "Press Kit", href: "/press" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Contact Support", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="relative bg-[#0b0b0b] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#e50914]/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#e50914]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-[#e50914] p-2 rounded-xl shadow-[0_0_20px_rgba(229,9,20,0.3)] group-hover:scale-110 transition-transform duration-500">
                <Film className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                Cine<span className="text-[#e50914]">Tube</span>
              </span>
            </Link>
            
            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm font-medium">
              Experience the next generation of cinematic entertainment. Stream thousands of titles in breathtaking 4K quality, anywhere, anytime.
            </p>

            <div className="flex items-center gap-4">
              {[
                { icon: IoLogoTwitter, href: "#", label: "Twitter" },
                { icon: IoLogoGithub, href: "#", label: "Github" },
                { icon: IoLogoInstagram, href: "#", label: "Instagram" },
                { icon: IoLogoYoutube, href: "#", label: "Youtube" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#e50914] hover:border-[#e50914] transition-all duration-300 group"
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group text-sm font-semibold"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
              Stay in the Loop
            </h3>
            <p className="text-zinc-400 text-sm font-medium">
              Join our newsletter for exclusive previews and cinematic updates.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#e50914] transition-colors" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#e50914]/50 focus:border-[#e50914]/50 transition-all"
                />
              </div>
              <button className="w-full h-12 bg-[#e50914] hover:bg-[#ff1f1f] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_8px_16px_-4px_rgba(229,9,20,0.3)] transition-all active:scale-95">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            &copy; {currentYear} Cine<span className="text-zinc-400">Tube</span>. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <div className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
              <MapPin className="w-3 h-3 text-[#e50914]" />
              <span>Global Protocol</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-[#e50914]" />
              <span>Priority Intel</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative side element */}
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#e50914]/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
    </footer>
  );
}
