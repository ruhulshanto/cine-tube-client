"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSidebarContent } from "@/components/shared/DashboardSidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="relative flex min-h-0 flex-1">
      {/* Desktop sidebar — sticky, scrollable */}
      <aside className="relative hidden shrink-0 md:block md:w-[17.5rem] lg:w-72">
        <div className="sticky top-24 max-h-[calc(100dvh-6rem)] overflow-y-auto border-r border-white/[0.07] bg-gradient-to-b from-[#0e0e0e] via-[#070707] to-black px-3 py-6 shadow-[4px_0_24px_rgba(0,0,0,0.45)]">
          <div className="mb-6 px-3">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Studio</p>
            <h2 className="mt-1.5 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-xl font-black tracking-tight text-transparent">
              Dashboard
            </h2>
            <p className="mt-1 text-xs text-zinc-600">Manage your Cine-Tube account</p>
          </div>
          <DashboardSidebarContent />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[95] md:hidden" role="dialog" aria-modal="true" aria-label="Dashboard menu">
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(19rem,90vw)] animate-in slide-in-from-left duration-200 flex-col border-r border-white/10 bg-[#0a0a0a] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Studio</p>
                <span className="text-base font-black text-white">Dashboard</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-4">
              <DashboardSidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <main className="relative min-w-0 flex-1 bg-gradient-to-b from-[#0b0b0b] via-black/90 to-zinc-950">
        <div className="sticky top-24 z-40 flex items-center gap-3 border-b border-white/[0.06] bg-[#0b0b0b]/85 px-4 py-3 backdrop-blur-xl md:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 gap-2 rounded-xl border-white/15 bg-white/[0.06] text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-white/10"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" />
            Menu
          </Button>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Quick nav</span>
        </div>
        <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-4 sm:px-6 md:px-8 md:pb-12 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
