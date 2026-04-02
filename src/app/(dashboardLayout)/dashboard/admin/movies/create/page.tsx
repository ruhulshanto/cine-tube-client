"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MovieForm } from "@/components/admin/MovieForm";
import { Loader2 } from "lucide-react";

export default function AdminCreateMoviePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "ADMIN") router.replace("/");
  }, [authLoading, user?.role, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== "ADMIN") return null;

  return (
    <div className="relative mx-auto w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" aria-hidden />
      <div className="relative">
        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-500">Admin · Catalog upload</p>
        <h1 className="text-3xl font-black tracking-tighter text-white md:text-4xl lg:text-5xl">
          Upload a movie or series
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
          Add titles directly to the catalog — same API as Postman. Paste poster, backdrop, trailer, and streaming URLs
          (e.g. from Cloudinary).
        </p>
        <p className="mt-2 text-sm font-medium text-zinc-500">
          <span className="text-amber-500/90">Admin only</span> · multipart + validation match the server.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-br from-zinc-900/80 via-[#0c0c0c] to-black p-6 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.05)] ring-1 ring-white/[0.04] md:rounded-[2rem] md:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <MovieForm mode="create" />
      </div>
    </div>
  );
}
