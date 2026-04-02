"use client";

import { CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionFeedbackCardProps = {
  open: boolean;
  message: string;
  subMessage?: string;
  variant?: "success" | "info";
  onDismiss?: () => void;
};

export function ActionFeedbackCard({
  open,
  message,
  subMessage,
  variant = "success",
  onDismiss,
}: ActionFeedbackCardProps) {
  if (!open) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[450] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6 sm:left-auto sm:right-6 sm:justify-end"
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-md animate-in slide-in-from-bottom-4 gap-4 rounded-2xl border p-4 shadow-2xl duration-300 sm:rounded-3xl sm:p-5",
          variant === "success"
            ? "border-emerald-500/30 bg-[#0f0f0f]/95 backdrop-blur-xl"
            : "border-sky-500/30 bg-[#0f0f0f]/95 backdrop-blur-xl",
        )}
      >
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            variant === "success" ? "bg-emerald-500/15 text-emerald-400" : "bg-sky-500/15 text-sky-400",
          )}
        >
          {variant === "success" ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <Info className="h-6 w-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black text-white">{message}</p>
          {subMessage && <p className="mt-1 text-sm text-zinc-500">{subMessage}</p>}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-xl p-2 text-zinc-500 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
