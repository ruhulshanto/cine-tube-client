import { Film } from "lucide-react";
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
        <Link href="/" className="flex items-center gap-2 group transition-all duration-300">
          <div className="bg-[#e50914] p-1.5 rounded-lg shadow-[0_0_20px_rgba(229,9,20,0.3)] group-hover:scale-105 transition-transform">
             <Film className="w-7 h-7 text-white fill-current" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-[#e50914] transform-gpu">
            CINE-TUBE
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
