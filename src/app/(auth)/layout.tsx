import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative flex flex-col bg-[#0f0f0f] font-sans overflow-x-hidden">
      {/* Cinematic Background with Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(15, 15, 15, 1), rgba(15, 15, 15, 0.3), rgba(15, 15, 15, 1)), url('https://images.unsplash.com/photo-1574267432553-4b4628041c31?q=80&w=2073&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Global Logo Header */}
      <header className="relative z-20 w-full px-4 md:px-12 py-6">
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
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-10 w-full py-8 text-center border-t border-white/5 bg-[#0f0f0f]/80 backdrop-blur-md">
        <p className="text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} Cine-Tube. Crafted for Movie Enthusiasts.
        </p>
      </footer>
    </div>
  );
}
