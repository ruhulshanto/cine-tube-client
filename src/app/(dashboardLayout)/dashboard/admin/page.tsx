"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Film, LayoutDashboard, Loader2, Plus, ShieldCheck, Sparkles } from "lucide-react";

export default function AdminDashboardHubPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role !== "ADMIN") router.replace("/");
  }, [isLoading, user?.role, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== "ADMIN") return null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 border-b border-white/10 pb-8">
        <div className="flex items-center gap-2 text-amber-500">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Admin dashboard</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-white md:text-5xl">Command center</h1>
        <p className="text-zinc-400">
          Everything under <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-zinc-300">/dashboard/admin</code>{" "}
          — library, uploads, and moderation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/admin/movies">
          <Card className="h-full border-white/10 bg-zinc-950/60 transition-colors hover:border-primary/30 hover:bg-white/[0.04]">
            <CardHeader>
              <Film className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-white">Movie library</CardTitle>
              <CardDescription>List, search, edit, and delete titles.</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Open →</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/admin/home-curation">
          <Card className="h-full border-white/10 bg-zinc-950/60 transition-colors hover:border-primary/30 hover:bg-white/[0.04]">
            <CardHeader>
              <Sparkles className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-white">Homepage curation</CardTitle>
              <CardDescription>Manage Featured + Editor’s Picks.</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Open →</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/admin/movies/create">
          <Card className="h-full border-amber-500/20 bg-amber-500/[0.06] transition-colors hover:border-amber-500/40">
            <CardHeader>
              <Plus className="mb-2 h-8 w-8 text-amber-400" />
              <CardTitle className="text-white">Upload movie</CardTitle>
              <CardDescription>Add a title with Cloudinary / HTTPS URLs (Postman-style payload).</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Upload →</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/admin/payments">
          <Card className="h-full border-emerald-500/20 bg-emerald-500/[0.04] transition-colors hover:border-emerald-500/40">
            <CardHeader>
              <CircleDollarSign className="mb-2 h-8 w-8 text-emerald-400" />
              <CardTitle className="text-white">Payments</CardTitle>
              <CardDescription>Transactions, revenue summary, and Stripe activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Open →</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/admin/reviews" className="sm:col-span-2">
          <Card className="border-white/10 bg-zinc-950/60 transition-colors hover:border-sky-500/30">
            <CardHeader>
              <LayoutDashboard className="mb-2 h-8 w-8 text-sky-400" />
              <CardTitle className="text-white">Review queue</CardTitle>
              <CardDescription>Approve or reject pending reviews.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/movies">
          <Button variant="outline" className="rounded-xl border-white/15">
            View public site
          </Button>
        </Link>
      </div>
    </div>
  );
}
