"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

function getVisiblePages(current: number, total: number): (number | "gap")[] {
  if (total <= 0) return [];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]!;
    if (i > 0 && n - sorted[i - 1]! > 1) result.push("gap");
    result.push(n);
  }
  return result;
}

interface MoviesPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
  isFetching: boolean;
}

export function MoviesPagination({
  page,
  totalPages,
  total,
  onPageChange,
  isFetching,
}: MoviesPaginationProps) {
  const visible = useMemo(() => getVisiblePages(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) {
    return (
      <div className="flex flex-col items-center gap-3 pt-10 sm:flex-row sm:justify-between">
        <p className="text-center text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
          {total === 0 ? "No titles" : `All ${total} ${total === 1 ? "title" : "titles"}`}
        </p>
      </div>
    );
  }

  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="mt-12 flex flex-col items-stretch gap-6 border-t border-white/5 pt-10 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 sm:text-left">
        <span className="text-zinc-300">Showing </span>
        {start}–{end}
        <span className="text-zinc-300"> of </span>
        {total}
      </p>

      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-2 transition-opacity duration-200",
          isFetching && "opacity-70"
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11 gap-1.5 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:border-primary/30 hover:bg-primary/10 hover:text-white"
          disabled={page <= 1 || isFetching}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-black/30 p-1.5 backdrop-blur-sm">
          {visible.map((item, idx) =>
            item === "gap" ? (
              <span
                key={`gap-${idx}`}
                className="flex h-10 min-w-[2.25rem] items-center justify-center px-1 text-zinc-600"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                disabled={isFetching}
                className={cn(
                  "flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl text-sm font-bold transition-all duration-200",
                  item === page
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(229,9,20,0.35)] ring-1 ring-primary/60"
                    : "text-zinc-400 hover:bg-white/10 hover:text-white"
                )}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </button>
            )
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11 gap-1.5 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:border-primary/30 hover:bg-primary/10 hover:text-white"
          disabled={page >= totalPages || isFetching}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
