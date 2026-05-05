"use client";

import { useState } from "react";
import { X, Crown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName?: string;
}

export const PremiumModal = ({
  isOpen,
  onClose,
  channelName = "Premium Channel",
}: PremiumModalProps) => {
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    // Simulate subscription
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubscribing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800/50 p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50" />
            <Crown className="w-12 h-12 text-yellow-400 fill-yellow-400 relative" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-black text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Premium Content
        </h2>

        <div className="flex items-center justify-center gap-2 mb-6 text-neutral-400">
          <Lock className="w-4 h-4" />
          <p className="text-sm">{channelName} is a premium channel</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Premium Subscription
            </h3>
            <p className="text-sm text-neutral-300">
              Unlock exclusive channels and ad-free streaming
            </p>
            <div className="text-lg font-bold text-blue-400 pt-2">
              $9.99<span className="text-xs text-neutral-400">/month</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-neutral-300">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              Access to 100+ premium channels
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              4K streaming available
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              Watch on 4 devices simultaneously
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              Cancel anytime, no commitment
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className={cn(
              "w-full py-3 rounded-lg font-bold transition-all duration-300",
              "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
              "hover:shadow-lg hover:shadow-blue-500/50 hover:from-blue-500 hover:to-purple-500",
              "disabled:opacity-75 disabled:cursor-not-allowed",
            )}
          >
            {isSubscribing ? "Subscribing..." : "Subscribe Now"}
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(115, 115, 115, 0.5)",
              color: "rgb(212, 212, 212)",
            }}
          >
            Maybe Later
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-neutral-500 text-center mt-6">
          Free trial available for new members
        </p>
      </div>
    </div>
  );
};
