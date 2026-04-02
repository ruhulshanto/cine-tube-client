"use client";

import { X, Play, Pause, Volume2, Maximize, RotateCcw, FastForward } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MoviePlayerProps {
  movie: any;
  url: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MoviePlayer({ movie, url, isOpen, onClose }: MoviePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const isTrailer = url === movie.trailerUrl;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ✅ Don't intercept if typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA" || 
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "Escape") {
         if (document.fullscreenElement) document.exitFullscreen();
         onClose();
      }
      if (e.key === " ") {
         e.preventDefault();
         togglePlay();
      }
      if (e.key === "ArrowRight") skipForward();
      if (e.key === "ArrowLeft") skipBackward();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
     if (videoRef.current) videoRef.current.currentTime += 10;
  };

  const skipBackward = () => {
     if (videoRef.current) videoRef.current.currentTime -= 10;
  };

  const toggleMute = () => {
     if (videoRef.current) {
       videoRef.current.muted = !videoRef.current.muted;
       setIsMuted(videoRef.current.muted);
     }
  };

  const toggleFullscreen = () => {
     if (!document.fullscreenElement) {
       playerRef.current?.requestFullscreen().catch(err => console.log(err));
     } else {
       document.exitFullscreen();
     }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
     if (progressBarRef.current && videoRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * videoRef.current.duration;
     }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={playerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center"
        onMouseMove={handleMouseMove}
      >
        {/* Cinematic Backdrop & Vignette Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${movie.backdropUrl})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_90%)] z-10 pointer-events-none opacity-60" />

        {/* Video Canvas - Edge-to-Edge Fill */}
        <video
          ref={videoRef}
          src={url || movie.streamingUrl || movie.trailerUrl}
          className="absolute inset-0 w-full h-full bg-black object-cover z-10"
          // With object-cover, adjust which part of the video is visible vertically.
          style={{ objectPosition: "center 45%" }}
          autoPlay
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* HUD: Top Bar */}
        <div className="absolute top-0 inset-x-0 z-50 px-4 sm:px-8 pt-5 sm:pt-8 md:pt-10 flex justify-between items-start pointer-events-none">
           <motion.div 
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             className="flex flex-col gap-1"
           >
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-[#e50914] text-[10px] font-black uppercase tracking-[0.2em] rounded-sm text-white">
                   Cinema Mode
                 </span>
                 {isTrailer && (
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-3xl border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm text-white">
                      Trailer
                    </span>
                 )}
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl">
                 {movie.title}
              </h2>
           </motion.div>

           <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={onClose}
            className="p-5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 backdrop-blur-3xl transition-all active:scale-90 pointer-events-auto shadow-2xl"
          >
            <X className="w-8 h-8" />
          </motion.button>
        </div>

        {/* HUD: Bottom Controls */}
        <motion.div
          animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 40 }}
          className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-16 pb-4 px-4 sm:pt-18 sm:pb-6 sm:px-8 md:pt-20 md:pb-8 md:px-12 flex flex-col gap-6 pointer-events-none"
        >
          {/* Pro Progress Bar */}
          <div 
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden cursor-pointer pointer-events-auto group relative transition-all hover:h-4"
          >
            <motion.div 
               className="absolute inset-y-0 left-0 bg-[#e50914] z-10 rounded-full group-hover:bg-[#ff1a26]" 
               style={{ width: `${progress}%` }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-10">
              <button 
                onClick={togglePlay}
                className="text-white hover:scale-125 transition-transform active:scale-95 drop-shadow-glow"
              >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 sm:w-12 sm:h-12 fill-current" />
                  ) : (
                    <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-current ml-1" />
                  )}
              </button>
              
              <div className="flex items-center gap-6 text-white/60">
                  <RotateCcw
                    onClick={skipBackward}
                    className="w-6 h-6 sm:w-7 sm:h-7 hover:text-white transition-colors cursor-pointer active:scale-90"
                  />
                  <FastForward
                    onClick={skipForward}
                    className="w-6 h-6 sm:w-7 sm:h-7 hover:text-white transition-colors cursor-pointer active:scale-90"
                  />
              </div>
              
              <div 
                onClick={toggleMute}
                className="flex items-center gap-4 group px-6 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors"
              >
                <Volume2 className={cn("w-6 h-6 transition-colors", isMuted ? "text-rose-500" : "text-white/50 group-hover:text-white")} />
                  <div className="w-16 h-1 sm:w-24 bg-white/10 rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all", isMuted ? "bg-rose-500 w-0" : "bg-white w-2/3")} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden lg:flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e50914]">Stream Quality</span>
                 <span className="text-white font-bold text-sm">ULTRA HD 4K</span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <button onClick={toggleFullscreen}>
                 <Maximize className="w-8 h-8 text-white/50 hover:text-white cursor-pointer transition-all hover:scale-110 active:scale-90" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Central Interruption HUD */}
        <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
              >
                <div className="w-32 h-32 rounded-full bg-[#e50914]/20 backdrop-blur-3xl border border-[#e50914]/30 flex items-center justify-center shadow-[0_0_80px_rgba(229,9,20,0.3)]">
                  <Play className="w-16 h-16 text-white fill-current ml-2" />
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
