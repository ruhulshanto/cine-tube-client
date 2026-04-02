"use client";

import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "warning";
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "danger",
  isLoading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-end justify-center bg-black/75 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={() => !isLoading && onCancel()}
    >
      <div
        className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200 sm:zoom-in-95 sm:slide-in-from-bottom-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border shadow-2xl sm:rounded-3xl",
            tone === "danger"
              ? "border-rose-500/30 bg-[#141414]"
              : "border-amber-500/30 bg-[#141414]",
          )}
        >
          <div
            className={cn(
              "h-1 w-full",
              tone === "danger"
                ? "bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500"
                : "bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500",
            )}
          />
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 id="confirm-dialog-title" className="text-lg font-black tracking-tight text-white sm:text-xl">
                {title}
              </h2>
              <button
                type="button"
                onClick={() => !isLoading && onCancel()}
                className="rounded-xl p-2 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">{description}</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-xl border-white/15 sm:w-auto sm:min-w-[120px]"
                disabled={isLoading}
                onClick={onCancel}
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                variant="netflix"
                className={cn(
                  "h-12 w-full rounded-xl sm:w-auto sm:min-w-[140px]",
                  tone === "danger" && "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400",
                )}
                disabled={isLoading}
                onClick={onConfirm}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait…
                  </>
                ) : (
                  confirmLabel
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
