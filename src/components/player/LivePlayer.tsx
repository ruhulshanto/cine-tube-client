"use client";

import { useEffect, useRef, useState } from "react";
import HLS from "hls.js";
import { PlayerSkeleton } from "@/components/shared/AppSkeletons";

interface LivePlayerProps {
  streamUrl: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  isLoading?: boolean;
  onLoaded?: () => void;
  onError?: (error: string) => void;
  onRetry?: () => void;
}

export const LivePlayer = ({
  streamUrl,
  title = "Live Stream",
  autoplay = true,
  controls = true,
  isLoading = false,
  onLoaded,
  onError,
  onRetry,
}: LivePlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    console.log("[HLS] 🎬 INIT: Starting stream load for", streamUrl);
    queueMicrotask(() => setError(null));
    let isLoadedCalled = false;

    // Failsafe timeout - ALWAYS stop loading after 8 seconds
    const timeout = setTimeout(() => {
      console.error("[HLS] ⏰ TIMEOUT: Manifest not parsed in 8s", streamUrl);
      setError("Stream took too long to load. Please try again.");
      if (!isLoadedCalled) {
        isLoadedCalled = true;
        onLoaded?.();
      }
    }, 8000);

    // Check if HLS is supported
    if (HLS.isSupported()) {
      const hls = new HLS({
        debug: true, // 🔥 ENABLE debug logging to see hls.js internals
        enableWorker: true,
        lowLatencyMode: true,
      });

      console.log("[HLS] 📺 HLS instance created, loading source...");
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      // Log: Media attached to video element
      hls.on(HLS.Events.MEDIA_ATTACHED, () => {
        console.log("[HLS] 🎥 MEDIA_ATTACHED: Video element linked to HLS");
      });

      // Log: Manifest loading started
      hls.on(HLS.Events.MANIFEST_LOADING, () => {
        console.log("[HLS] 📥 MANIFEST_LOADING: Fetching manifest...");
      });

      // Log: Manifest loaded
      hls.on(HLS.Events.MANIFEST_LOADED, () => {
        console.log("[HLS] 📦 MANIFEST_LOADED: Manifest received");
      });

      // Log: Manifest parsed
      hls.on(HLS.Events.MANIFEST_PARSED, () => {
        console.log("[HLS] ✅ MANIFEST_PARSED: Stream ready to play!");
        clearTimeout(timeout);
        if (!isLoadedCalled) {
          isLoadedCalled = true;
          onLoaded?.();
        }
        if (autoplay) {
          video.play().catch((err) => {
            console.warn("[HLS] ⚠️ Autoplay prevented:", err.message);
          });
        }
      });

      // Log: Fragment loading
      hls.on(HLS.Events.FRAG_LOADING, () => {
        console.log("[HLS] 📨 FRAG_LOADING: Loading video segment...");
      });

      // Log: All errors with details
      hls.on(HLS.Events.ERROR, (event, data) => {
        console.error("[HLS] ❌ ERROR:", {
          type: data.type,
          details: data.details,
          fatal: data.fatal,
          error: data.error,
          response: data.response,
        });

        // Always call onLoaded on ANY fatal error to unstick loading
        if (data.fatal) {
          clearTimeout(timeout);
          if (!isLoadedCalled) {
            isLoadedCalled = true;
            onLoaded?.();
          }

          let errorMessage = "Stream failed to load. Please try again.";
          if (data.type === HLS.ErrorTypes.MEDIA_ERROR) {
            errorMessage = "Media error. The stream cannot be played.";
            console.warn("[HLS] Attempting to recover from MEDIA_ERROR...");
            hls.recoverMediaError();
          } else if (data.type === HLS.ErrorTypes.NETWORK_ERROR) {
            console.error("[HLS] 🌐 NETWORK_ERROR: Could not fetch resource");
            console.error("[HLS] Details:", data.details);
            errorMessage =
              "Network error. Check your connection or try another stream.";
          }

          setError(errorMessage);
          onError?.(errorMessage);
        } else {
          console.warn("[HLS] ⚠️ Non-fatal error - continuing...", data.type);
        }
      });

      return () => {
        console.log("[HLS] 🧹 Cleaning up HLS instance");
        clearTimeout(timeout);
        hls.off(HLS.Events.MEDIA_ATTACHED);
        hls.off(HLS.Events.MANIFEST_LOADING);
        hls.off(HLS.Events.MANIFEST_LOADED);
        hls.off(HLS.Events.MANIFEST_PARSED);
        hls.off(HLS.Events.FRAG_LOADING);
        hls.off(HLS.Events.ERROR);
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      console.log("[HLS] Using native Safari HLS support");
      clearTimeout(timeout);
      if (!isLoadedCalled) {
        isLoadedCalled = true;
        onLoaded?.();
      }
      video.src = streamUrl;
      if (autoplay) {
        video.play().catch((err) => {
          console.warn("[HLS] Autoplay prevented:", err.message);
        });
      }
      return () => {};
    } else {
      clearTimeout(timeout);
      console.error("[HLS] Device does not support HLS streaming");
      queueMicrotask(() =>
        setError("HLS streaming is not supported on your device."),
      );
      if (!isLoadedCalled) {
        isLoadedCalled = true;
        onLoaded?.();
      }
      return () => {};
    }
  }, [streamUrl, autoplay, onLoaded]);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative pt-[56.25%]">
        <video
          ref={videoRef}
          controls={controls}
          className="absolute top-0 left-0 w-full h-full"
          title={title}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-black">
            <PlayerSkeleton className="h-full rounded-none border-0" />
          </div>
        )}

        {/* Error Overlay */}
        {error && !isLoading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center max-w-md mx-4">
              <div className="w-16 h-16 bg-[#1f1f1f] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <svg
                  className="w-8 h-8 text-[#e50914]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Stream Unavailable
              </h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                {error}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setError(null);
                    onRetry?.();
                  }}
                  className="px-6 py-2.5 bg-[#e50914] hover:bg-[#ff4d4d] text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setError(null)}
                  className="px-6 py-2.5 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white font-semibold rounded-lg border border-white/10 transition-colors duration-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LIVE Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 bg-[#e50914] px-3 py-1.5 rounded-full animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-white text-xs font-bold tracking-widest">
            LIVE
          </span>
        </div>
      </div>

      {/* Title */}
      {title && (
        <div className="p-4 bg-[#0b0b0b] border-t border-white/10">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
        </div>
      )}
    </div>
  );
};
