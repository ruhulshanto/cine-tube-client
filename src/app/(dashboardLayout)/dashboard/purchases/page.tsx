"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyPaymentHistory } from "@/services/payment.services";
import { CreditCard, Film, Clock, CheckCircle2, AlertCircle, CalendarDays, RefreshCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PurchaseHistoryPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["payment-history"],
    queryFn: () => getMyPaymentHistory(),
  });

  const payments = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
            Purchase <span className="text-primary italic">History</span>
          </h1>
          <p className="text-zinc-400 mt-3 font-medium text-lg">
            Manage your past billing, subscriptions, and cinematic acquisitions.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => refetch()} 
          className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 gap-2 text-zinc-300 shadow-xl transition-all active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full h-28 bg-white/5 animate-pulse rounded-[2rem] border border-white/5" />
          ))}
        </div>
      )}

      {/* Error Interface */}
      {isError && (
        <div className="p-12 border border-rose-500/20 bg-rose-500/5 backdrop-blur-3xl rounded-[3rem] flex flex-col items-center justify-center text-center gap-6">
          <div className="p-4 bg-rose-500/20 rounded-full">
             <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white italic">Protocol Error</h3>
            <p className="text-zinc-400 max-w-sm">There was an issue fetching your transaction logs from the archives.</p>
          </div>
          <Button onClick={() => refetch()} size="lg" className="bg-rose-500 hover:bg-rose-600 rounded-2xl px-10">Try Again</Button>
        </div>
      )}

      {/* Empty Vault State */}
      {!isLoading && !isError && payments.length === 0 && (
        <div className="py-32 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center gap-8 glass-morphism relative overflow-hidden group">
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="w-24 h-24 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-700">
            <Film className="w-12 h-12 text-primary opacity-80" />
          </div>
          <div className="space-y-3 relative z-10">
            <h3 className="text-3xl font-black text-white tracking-tight">Your Vault is Empty</h3>
            <p className="text-zinc-400 max-w-md mx-auto text-lg leading-relaxed font-medium">
              You haven't acquired any premium cinematic experience yet. Subscribe or purchase a movie to begin your collection.
            </p>
          </div>
          <Link href="/movies">
            <Button size="lg" variant="netflix" className="h-14 px-12 rounded-2xl gap-3 text-lg font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                Explore Gallery <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Main Transaction List */}
      {!isLoading && payments.length > 0 && (
        <div className="bg-zinc-950/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
          <div className="overflow-x-auto w-full no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">
                  <th className="px-8 py-6 whitespace-nowrap">Cinematic Item</th>
                  <th className="px-8 py-6 whitespace-nowrap">Tier / Type</th>
                  <th className="px-8 py-6 whitespace-nowrap">Amount</th>
                  <th className="px-8 py-6 whitespace-nowrap">Access Date</th>
                  <th className="px-8 py-6 whitespace-nowrap">Transmission Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {payments.map((payment: any) => {
                  // ✅ Refined Data Mapping Logic
                  const isMovie = !!payment.movie;
                  const isSubscription = !!payment.subscription;
                  
                  const title = isMovie 
                    ? payment.movie.title 
                    : isSubscription 
                      ? `${payment.subscription.plan} PASS` 
                      : payment.description || "Generic Payment";

                  // Extract Rent vs Buy from description if it's a movie
                  const typeLabel = isSubscription 
                    ? "UNLIMITED PASS" 
                    : payment.description?.includes("Rent") 
                      ? "RENTAL" 
                      : "PURCHASE";

                  const isSuccess = payment.status === "COMPLETED";

                  return (
                    <tr key={payment.id} className="hover:bg-white/[0.02] transition-all group duration-300">
                      
                      {/* Item Details with Thumbnail */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          {/* Thumbnail / Icon */}
                          <div className={cn(
                            "w-12 h-16 md:w-16 md:h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-all duration-500",
                            !payment.movie?.posterUrl && "bg-zinc-900 flex items-center justify-center"
                          )}>
                            {payment.movie?.posterUrl ? (
                              <img src={payment.movie.posterUrl} alt="Poster" className="w-full h-full object-cover" />
                            ) : isSubscription ? (
                              <CreditCard className="w-6 h-6 text-amber-500 opacity-60" />
                            ) : (
                              <Film className="w-6 h-6 text-zinc-700" />
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="font-black text-white text-base md:text-xl group-hover:text-primary transition-colors leading-tight italic tracking-tight">{title}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded uppercase">ID: {payment.id.split("-")[0]}</span>
                                <span className={cn(
                                    "text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded border uppercase",
                                    isMovie ? "border-sky-500/20 text-sky-500 bg-sky-500/5" : "border-amber-500/30 text-amber-500 bg-amber-500/5"
                                )}>
                                    {isMovie ? "DIGITAL MEDIA" : "SUBSCRIPTION"}
                                </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type Logic */}
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm",
                          typeLabel === "PURCHASE" ? "bg-[#e50914]/10 text-[#e50914] border-[#e50914]/20" :
                          typeLabel === "RENTAL" ? "bg-sky-500/10 text-sky-500 border-sky-500/20" :
                          "bg-amber-400/10 text-amber-500 border-amber-400/20"
                        )}>
                          {typeLabel}
                        </span>
                      </td>

                      {/* Financials */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                            <span className="font-black text-white text-lg tracking-tight italic">${payment.amount?.toFixed(2) || "0.00"}</span>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase">{payment.currency || "USD"}</span>
                        </div>
                      </td>

                      {/* Date of Transmission */}
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                          <div className="p-2 bg-white/5 rounded-lg">
                             <CalendarDays className="w-4 h-4 text-zinc-500" />
                          </div>
                          <span className="tracking-tight">
                            {new Date(payment.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Status Protocol */}
                      <td className="px-8 py-6">
                        <div className={cn(
                            "inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border backdrop-blur-3xl shadow-sm",
                            isSuccess ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
                        )}>
                          <div className={cn(
                              "w-2 h-2 rounded-full shadow-lg transition-all",
                              isSuccess ? "bg-emerald-500 shadow-emerald-500/40 animate-pulse" : "bg-amber-500 shadow-amber-500/40 animate-bounce"
                          )} />
                          <span className={cn(
                            "text-xs font-black uppercase tracking-widest italic",
                            isSuccess ? "text-emerald-500" : "text-amber-500"
                          )}>
                            {payment.status}
                          </span>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
