"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Settings, Shield, Bell, User, Lock, Database, LogOut, ChevronRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DashboardSettingsPage() {
  const { user, logout } = useAuth();

  const sections = [
    {
      title: "Core Identity",
      items: [
        { label: "Profile Metadata", icon: User, desc: "Manage your director port identity", action: "Configure" },
        { label: "Communication Email", icon: Database, desc: user?.email, action: "Update" },
      ],
    },
    {
      title: "Authority Protocol",
      items: [
        { label: "Security Keys", icon: Lock, desc: "Rotate cinematic access tokens", action: "Change" },
        { label: "Tier Access", icon: Shield, desc: user?.role === "ADMIN" ? "Executive Master" : "Premium Buff", action: "View" },
      ],
    },
    {
      title: "Experience",
      items: [
        { label: "Cinematic Notifications", icon: Bell, desc: "New release & rating alerts", action: "Set" },
        { label: "Platform Theme", icon: Sparkles, desc: "Ultra Dark (Default)", action: "Change" },
      ],
    },
  ];

  return (
    <div className="relative overflow-hidden pb-12">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-16 space-y-4">
          <div className="flex w-fit items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-1">
            <Settings className="h-3 w-3 text-zinc-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Configuration</span>
          </div>
          <h1 className="text-5xl font-black uppercase leading-tight tracking-tighter text-white md:text-7xl">Authority Deck</h1>
          <p className="max-w-2xl text-sm font-bold uppercase leading-relaxed tracking-widest text-zinc-500">
            Refine your cinematic experience and manage your platform authority from this centralized control console.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="space-y-6"
            >
              <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {section.title}
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="group flex cursor-pointer items-center justify-between rounded-[2rem] border border-white/5 bg-white/5 p-8 transition-all hover:bg-white/10"
                    onClick={() => toast.info("Maintenance Mode", { description: "Management interface is temporarily locked." })}
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition-all group-hover:bg-white group-hover:text-black">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-black text-white transition-transform group-hover:translate-x-1">{item.label}</p>
                        <p className="max-w-[200px] truncate text-[10px] font-bold uppercase tracking-tighter text-zinc-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-md bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-700 opacity-0 transition-opacity group-hover:opacity-100">
                        {item.action}
                      </span>
                      <ChevronRight className="h-4 w-4 text-zinc-700 transition-colors group-hover:text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-12 md:flex-row"
          >
            <div className="flex items-center gap-6">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/20 text-primary">
                <Check className="h-8 w-8" />
                <div className="absolute inset-0 scale-150 animate-pulse rounded-full bg-primary/20 blur-xl" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Security Protocol: Active</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Global Encryption Standards Compliant</p>
              </div>
            </div>

            <Button
              onClick={() => {
                const tid = toast.loading("Termination Protocol Initiated...");
                setTimeout(() => {
                  logout();
                  toast.dismiss(tid);
                }, 1500);
              }}
              className="h-16 gap-4 rounded-2xl border border-rose-600/20 bg-rose-600/10 px-10 text-xs font-black uppercase tracking-widest text-rose-600 shadow-2xl transition-all hover:bg-rose-600 hover:text-white active:scale-95"
            >
              <LogOut className="h-5 w-5" /> Terminate Session
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
