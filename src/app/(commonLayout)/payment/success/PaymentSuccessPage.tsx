"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Film, CreditCard, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<"VERIFYING" | "COMPLETED" | "ERROR">("VERIFYING");
  const [retryCount, setRetryCount] = useState(0);

  const verifyPayment = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const response = await httpClient.get<{ status: string }>(`/payments/verify-session/${sessionId}`);
      
      // response is already the ApiResponse object from httpClient.get
      // so response.data contains { status: "..." }
      if (response.success && response.data?.status === "COMPLETED") {
        setStatus("COMPLETED");
        // Force refresh critical data
        queryClient.invalidateQueries({ queryKey: ["movie-access"] });
        queryClient.invalidateQueries({ queryKey: ["payment-history"] });
        queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        toast.success("Access granted! Your movie is unlocked.");
      } else {
        // Still processing or pending, retry in 2s
        if (retryCount < 15) { // Max 30 seconds of polling
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        } else {
          setStatus("ERROR");
          toast.error("Process taking longer than expected. Please check your dashboard in a moment.");
        }
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setStatus("ERROR");
    }
  }, [sessionId, retryCount, queryClient]);

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId, verifyPayment]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-12 duration-1000 relative">
      
      {/* Cinematic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Success Icon HUD */}
        <div className="relative inline-block mb-12">
          <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
          <div className="relative p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-[3rem] shadow-2xl backdrop-blur-3xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
            <CheckCircle2 className="w-24 h-24 text-emerald-500" />
          </div>

          {/* Sparkles decorations */}
          <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-amber-400 opacity-60 animate-bounce" />
          <Film className="absolute -bottom-6 -left-8 w-12 h-12 text-zinc-700 opacity-40 -rotate-12" />
        </div>

        <div className="space-y-6 mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic drop-shadow-2xl">
            Payment <span className="text-emerald-500">Confirmed!</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto">
            Protocol completed. Your cinematic access is being synchronized across the global network.
          </p>
        </div>

        {/* Transaction Proof HUD */}
        <div className="bg-zinc-950/40 border border-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 mb-12 shadow-inner group transition-all hover:border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Archive Reference</p>
              <p className="font-mono text-xs text-white truncate max-w-[200px]">{sessionId || "PROTOCOL_SYNC_ACTIVE"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Transmission Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40 animate-pulse" />
                <p className="font-black text-white italic text-sm">ENCRYPTED & COMPLETED</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {status === "VERIFYING" ? (
                <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
              ) : status === "COMPLETED" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              )}
              <p className="text-sm font-bold text-zinc-400">
                {status === "VERIFYING" 
                  ? "Authenticating transaction with Stripe network..." 
                  : status === "COMPLETED" 
                    ? "Content Unlocked successfully!" 
                    : "Verification timeout (Webhooks may be delayed)"}
              </p>
            </div>
            {status === "COMPLETED" ? (
               <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
               </div>
            ) : (
              <Link href="/dashboard/purchases">
                <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 gap-2 px-6">
                  View Status <CreditCard className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Final CTA Trio */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/movies">
            <Button size="lg" variant="netflix" className="h-16 px-12 rounded-2xl gap-3 text-xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
              Return to Gallery <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/dashboard/purchases">
            <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-lg font-bold">
              Purchase History
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}