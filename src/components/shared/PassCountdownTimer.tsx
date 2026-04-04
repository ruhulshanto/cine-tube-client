"use client";

import { useEffect, useState } from "react";

interface PassCountdownTimerProps {
  endDate: string | null;
  planName: string;
}

export function PassCountdownTimer({ endDate, planName }: PassCountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("...");

  useEffect(() => {
    if (!endDate) {
      setTimeLeft("SYNCING...");
      return;
    }

    const targetDate = new Date(endDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <span className="flex items-center gap-1.5 sm:gap-2">
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-400">
        PREMIUM
      </span>
      <span className="text-emerald-500/50">•</span>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-500/70">
        ENDS IN:
      </span>
      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-300 tabular-nums">
        {timeLeft}
      </span>
    </span>
  );
}
