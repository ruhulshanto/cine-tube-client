import Link from "next/link";
import Image from "next/image";
import React from "react";

const AUTH_BG_URL = "https://res.cloudinary.com/dtph8gqgi/image/upload/v1778705809/sup2_i1wo80.jpg";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative flex flex-col bg-[#0b0b0b] font-sans selection:bg-primary/30 selection:text-white">
      {/* ══════════════════════════════════════════════════
          CINEMATIC BACKGROUND SYSTEM (Fixed to Viewport)
      ══════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0">
        <Image
          src={AUTH_BG_URL}
          alt="CineTube Auth Backdrop"
          fill
          priority
          className="object-cover object-center scale-105"
        />
        {/* Main cinematic dark overlay */}
        <div className="absolute inset-0 bg-[#060606]/90 backdrop-blur-[1px]" />

        {/* Edge blending gradients */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#060606] via-[#060606]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#060606] via-[#060606]/40 to-transparent" />

        {/* Atmospheric atmospheric glows */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(229,9,20,0.08),transparent_70%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.02),transparent_70%)]" />
      </div>

      {/* ══════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════ */}
      <header className="relative z-20 w-full px-6 md:px-12 py-8 flex justify-center md:justify-start">
        <Link href="/" className="group flex items-center scale-90 md:scale-100">
          <span
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-3xl md:text-4xl text-white tracking-[0.18em] font-normal relative transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:tracking-[0.30em] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] group-hover:after:w-full"
          >
            CINE-TUBE
            <span className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
              <span className="absolute top-0 left-1/4 w-[1px] h-[2px] bg-white/80 rounded-full animate-[float_3s_infinite_0.2s]"></span>
              <span className="absolute top-1/2 left-1/3 w-[1px] h-[1px] bg-white/60 rounded-full animate-[float_2.8s_infinite_0.5s]"></span>
            </span>
          </span>
        </Link>
      </header>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT AREA (Positioned Upper)
      ══════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start  pb-20 px-4 md:px-12 overflow-y-auto">
        <div className="w-full flex justify-center py-4">
          {children}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════
          FOOTER (Subtle)
      ══════════════════════════════════════════════════ */}
      <footer className="relative z-10 w-full py-10 text-center border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Cine-Tube · Cinematic Streaming Hub
          </p>
          <div className="flex gap-6">
            <Link href="/help" className="text-zinc-500 text-xs hover:text-white transition-colors uppercase tracking-widest font-bold">Help</Link>
            <Link href="/terms" className="text-zinc-500 text-xs hover:text-white transition-colors uppercase tracking-widest font-bold">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

