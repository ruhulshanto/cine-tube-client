/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { Movie } from "@/types/movie.types";
import { Play, Info, Star, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function HomeBillboard({ movie }: { movie: Movie }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [movie?.id, isVideoLoaded]);

  if (!movie) return null;

  const isYouTube =
    movie.trailerUrl?.includes("youtube.com") ||
    movie.trailerUrl?.includes("youtu.be");
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoSrc =
    movie.trailerUrl ||
    "https://joy1.videvo.net/videvo_files/video/free/2014-12/mp4_main/Night_Sky_Timelapse_Video_Background_Loop_HD_Free.mp4";

  return (
    <div className="relative -mt-24 w-full h-[90vh] min-h-[700px] flex items-center overflow-hidden md:-mt-28">
      {/* 1. Background Video/Image Layer - UNDER navbar */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          {/* Fallback Image */}
          <img
            src={
              movie.backdropUrl ||
              movie.posterUrl ||
              "https://images.unsplash.com/photo-1485846234645-a62644ef7467?q=80&w=2000"
            }
            alt=""
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-0" : "opacity-60"
            }`}
          />

          {/* Video / Iframe */}
          {isYouTube ? (
            <div className="absolute inset-0 w-full h-full scale-[1.3] pointer-events-none opacity-60">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(movie.trailerUrl!)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(movie.trailerUrl!)}&controls=0&showinfo=0&rel=0&iv_load_policy=3`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onPlay={() => setIsVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${
                isVideoLoaded ? "opacity-70" : "opacity-0"
              }`}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}

          {/* Cinematic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-full md:w-[60%] lg:w-[45%] bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 pt-24 md:pt-28">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="max-w-2xl lg:max-w-3xl space-y-6"
        >
          {/* Apple-style Premium Badge */}
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Film className="w-3.5 h-3.5 text-primary" />
            <span>Exclusive Premier</span>
          </div>

          <div className="space-y-4">
            {/* Rating Section */}
            <div className="flex items-center gap-4 text-xs font-bold text-white/70">
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-sm border border-green-500/30">
                <Star className="w-3 h-3 fill-current" />
                {movie.averageRating?.toFixed(1) || "New"}
              </span>
              <span>{movie.releaseYear}</span>
              <span className="px-2 py-0.5 border border-white/20 rounded-sm text-white/50">
                {movie.mediaType || "MOVIE"}
              </span>
              <span className="text-primary tracking-wider">
                {movie.genres?.[0]}
              </span>
            </div>

            {/* High-Impact Headline - Netflix Style */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white drop-shadow-2xl">
              {movie.title}
            </h1>

            {/* Synopsis */}
            <p className="text-base md:text-lg text-white/80 line-clamp-3 font-medium max-w-xl text-shadow-glow leading-relaxed">
              {movie.synopsis ||
                "Witness the greatest cinematic event of the year. Stream it exclusively right here, right now, in stunning 4K Ultra HD."}
            </p>
          </div>

          {/* SaaS-Style Clean Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Link
              href={movie.id ? `/movies/${movie.id}` : "#"}
              prefetch={!!movie.id}
            >
              <Button
                variant="netflix"
                size="lg"
                className="h-12 md:h-14 px-8 md:px-10 rounded-xl font-bold text-base md:text-lg gap-3 shadow-[0_10px_40px_rgba(229,9,20,0.4)] hover:scale-105 transition-transform duration-300"
              >
                <Play className="w-6 h-6 fill-current" />
                Play
              </Button>
            </Link>
            <Link
              href={movie.id ? `/movies/${movie.id}` : "#"}
              prefetch={!!movie.id}
            >
              <Button
                variant="outline"
                size="lg"
                className="h-12 md:h-14 px-8 md:px-10 rounded-xl font-bold text-base md:text-lg bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 gap-3 hover:scale-105 transition-transform duration-300"
              >
                <Info className="w-6 h-6" />
                More Info
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Audio Control */}
      {!isYouTube && (
        <div className="absolute right-6 bottom-32 z-[60]">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-orange-500 hover:border-orange-500 transition-all shadow-2xl"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v9l6 6V6l-6-3z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Lang Tags */}
      <div className="absolute bottom-6 left-6 z-[60] flex gap-4 text-[10px] md:text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">
        <span>EN</span>
        <span>ES</span>
        <span>PO</span>
        <span>FR</span>
      </div>
    </div>
  );
}
