import { Star, Clock, Calendar, Heart, PlayCircle, Share2, Edit3, Trash2, ShoppingCart, Key, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { EditMovieModal } from "./EditMovieModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { MoviePlayer } from "./MoviePlayer";
import { buyMovie, rentMovie, subscribeToPlan } from "@/services/payment.services";
import { useMovieAccess } from "@/hooks/useMovieAccess";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "@/services/interaction.services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MovieHeroProps {
  movie: any;
}

export function MovieHero({ movie }: MovieHeroProps) {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // ✅ STREAMING ACCESS CONTROL
  const { hasAccess, reason, isLoading: accessLoading } = useMovieAccess(
    movie.id,
    movie.pricingType
  );
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // ✅ WATCHLIST DYNAMIC LOGIC
  const { data: watchlistResponse } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => getWatchlist(),
    enabled: isAuthenticated,
  });

  const watchlist = watchlistResponse?.data || [];
  const isInWatchlist = watchlist.some((item: any) => item.movie.id === movie.id);

  const { mutate: toggleWatchlist, isPending: isWatchlistLoading } = useMutation({
    mutationFn: async () => {
      if (isInWatchlist) {
         return removeFromWatchlist(movie.id);
      } else {
         return addToWatchlist(movie.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success(isInWatchlist ? "Removed from Watchlist" : "Added to Watchlist");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Watchlist operation failed");
    }
  });

  const handleToggleWatchlist = () => {
    if (!isAuthenticated) return toast.error("Sign in to manage your collection");
    toggleWatchlist();
  };

  const handlePlayVideo = (url: string) => {
    setActiveVideoUrl(url);
    setIsPlayerOpen(true);
  };

  const handleBuy = async () => {
    try {
      setIsPaymentLoading(true);
      console.log("[Buy] Initiating purchase for Movie ID:", movie.id);
      const res: any = await buyMovie(movie.id);
      console.log("[Buy] Server Response:", res);
      
      // Note: The buyMovie service already returns the 'data' part of the response
      if (res && res.checkoutUrl) {
        console.log("[Buy] Redirecting to Stripe:", res.checkoutUrl);
        window.location.href = res.checkoutUrl;
      } else {
        console.error("[Buy] No checkoutUrl found in response object:", res);
        toast.error("Failed to generate checkout link");
      }
    } catch (error: any) {
      console.error("[Buy] Error:", error);
      toast.error(error.response?.data?.message || "Failed to initiate purchase");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleRent = async () => {
    try {
      setIsPaymentLoading(true);
      console.log("[Rent] Initiating rental for Movie ID:", movie.id);
      const res: any = await rentMovie(movie.id);
      console.log("[Rent] Server Response:", res);
      
      // Note: The rentMovie service already returns the 'data' part of the response
      if (res && res.checkoutUrl) {
        console.log("[Rent] Redirecting to Stripe:", res.checkoutUrl);
        window.location.href = res.checkoutUrl;
      } else {
        console.error("[Rent] No checkoutUrl found in response object:", res);
        toast.error("Failed to generate checkout link");
      }
    } catch (error: any) {
      console.error("[Rent] Error:", error);
      toast.error(error.response?.data?.message || "Failed to initiate rental");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleSubscribe = async (plan: "MONTHLY" | "YEARLY") => {
    try {
      setIsPaymentLoading(true);
      console.log("[Subscription] Initiating checkout for plan:", plan);
      const res: any = await subscribeToPlan(plan);
      
      if (res && res.checkoutUrl) {
         window.location.href = res.checkoutUrl;
      } else {
         toast.error("Failed to initiate subscription");
      }
    } catch (error: any) {
       toast.error(error.response?.data?.message || "Subscription failed");
    } finally {
       setIsPaymentLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden group">
      {/* Background Image with Parallax-like scaling */}
      <div className="absolute inset-x-0 top-0 h-[110%] w-full">
        <img
          src={movie.backdropUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000"}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover object-top opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
        />
      </div>

      {/* Modern Gradient Overlays (Netflix Style) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b] via-transparent to-transparent z-10 hidden md:block" />
      
      {/* Dynamic Content Container - Adjusted pt-18 for Spider-Man Style tags */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 md:pb-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 pt-18 w-full flex flex-col md:flex-row gap-8 items-end animate-in fade-in slide-in-from-bottom-8 duration-1000 overflow-y-visible">
          
          {/* Floating Poster - Apple Class Style */}
          <div className="hidden md:block w-56 lg:w-72 aspect-[2/3] shrink-0 rounded-[2rem] overflow-hidden border border-white/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] relative group/poster">
            <img 
              src={movie.posterUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000"} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover/poster:scale-110" 
              alt="Poster" 
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2rem]" />
          </div>
          
          {/* Movie Details Info */}
          <div className="flex flex-col gap-4 max-w-4xl">
             {/* Admin Tooling HUD */}
             {isAdmin && (
              <div className="mb-4 flex items-center gap-4 animate-in fade-in slide-in-from-left-6 duration-1000 delay-300">
                <div className="px-3 py-1 bg-primary/20 backdrop-blur-3xl border border-primary/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Admin Protocol Active
                </div>
                <div className="h-px w-12 bg-white/10" />
                <div className="flex gap-2">
                   <button 
                      onClick={() => setIsEditOpen(true)}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                      title="Edit Master Copy"
                   >
                      <Edit3 className="w-4 h-4" />
                   </button>
                   <button 
                      onClick={() => setIsDeleteOpen(true)}
                      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                      title="Delete Entry"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            )}

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2.5">
               {movie.genres?.map((g: string) => (
                  <span key={g} className="px-4 py-1.5 bg-white/10 backdrop-blur-2xl rounded-full text-[10px] font-black uppercase tracking-widest text-[#e50914] border border-white/10">
                    {g}
                  </span>
               ))}
               <span className="px-4 py-1.5 bg-[#e50914]/20 backdrop-blur-2xl rounded-full text-[10px] font-black uppercase tracking-widest text-[#ff4d4d] border border-[#e50914]/30">
                 HD 4K
               </span>
               <span className={cn(
                 "px-4 py-1.5 backdrop-blur-2xl rounded-full text-[10px] font-black uppercase tracking-widest border",
                 movie.pricingType === "FREE" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" : 
                 movie.pricingType === "RENTAL" ? "bg-amber-500/20 text-amber-500 border-amber-500/30" :
                 "bg-primary/20 text-primary border-primary/30"
               )}>
                 {movie.pricingType} Access
               </span>
            </div>

            {/* Title Header */}
            <div className="space-y-1">
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl text-shadow-glow leading-[1.1]">
                {movie.title}
              </h1>
              <div className="flex items-center gap-8 text-sm font-bold text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-[#e50914]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-3.5 h-3.5", i < Math.round(movie.averageRating || 5) ? "fill-current" : "fill-zinc-800 text-zinc-800")} />
                    ))}
                  </div>
                  <span className="text-white ml-1">{movie.averageRating?.toFixed(1) || "New"}</span>
                </div>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {movie.duration}m</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {movie.releaseYear}</span>
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-lg text-zinc-300 line-clamp-3 leading-relaxed mt-1 font-medium max-w-2xl">
              {movie.synopsis}
            </p>
            
            {/* ✅ STREAMING ACCESS CONTROL */}
            <div className="flex flex-wrap gap-4 mt-6">

              {/* === CASE 1: Loading access check === */}
              {accessLoading && (
                <div className="h-14 w-48 rounded-2xl bg-white/10 animate-pulse" />
              )}

              {/* === CASE 2: Has Access → Show Play Now === */}
              {!accessLoading && hasAccess && (
                <Button 
                  onClick={() => handlePlayVideo(movie.streamingUrl || movie.trailerUrl)}
                  variant="netflix" 
                  size="lg" 
                  className="h-14 px-10 rounded-2xl text-lg font-black uppercase tracking-widest gap-3 shadow-[0_0_40px_rgba(229,9,20,0.4)] hover:scale-105 transition-transform"
                >
                  <PlayCircle className="w-6 h-6" />
                  {reason === "FREE_MOVIE" ? "Play Free" : "Play Now"}
                </Button>
              )}

              {/* === CASE 3: No Access → Buy / Rent Gate === */}
              {!accessLoading && !hasAccess && (
                <>
                  {/* Locked Banner */}
                  <div className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold">
                    <Lock className="w-5 h-5 shrink-0" />
                    <span>
                      {!isAuthenticated
                        ? "Sign in to watch this title"
                        : "Premium content — Buy or Rent to unlock full access"}
                    </span>
                  </div>

                  {/* Multi-Payment Gate */}
                  <div className="flex flex-wrap gap-4 items-center">
                    {/* Buy Now Option */}
                    <Button 
                      onClick={handleBuy}
                      disabled={isPaymentLoading || !isAuthenticated}
                      variant="netflix" 
                      size="lg" 
                      className="h-14 px-10 rounded-2xl text-lg font-black uppercase tracking-widest gap-3"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {isPaymentLoading ? "Processing..." : "Buy Now"}
                    </Button>

                    {/* Rent Option (Standard 48hr access) */}
                    {(movie.pricingType === "RENTAL" || (movie.pricingType === "PREMIUM" && movie.rentalPrice)) && (
                      <Button 
                        onClick={handleRent}
                        disabled={isPaymentLoading || !isAuthenticated}
                        variant="outline" 
                        size="lg" 
                        className="h-14 px-8 rounded-2xl bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500 hover:text-white gap-3 transition-all"
                      >
                        <Key className="w-6 h-6" /> 
                        Rent ${movie.rentalPrice || "4.99"} (48h)
                      </Button>
                    )}

                    {/* Subscription Pass Option (The most logical choice) */}
                    <Button 
                      onClick={() => handleSubscribe("MONTHLY")}
                      disabled={isPaymentLoading || !isAuthenticated}
                      variant="outline" 
                      size="lg" 
                      className="h-14 px-8 rounded-2xl bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white gap-3 transition-all font-bold"
                    >
                      <CreditCard className="w-6 h-6" />
                      Get Premium Pass ($9.99/mo)
                    </Button>
                  </div>
                </>
              )}

              {/* === ALWAYS: Trailer Button === */}
              {movie.trailerUrl && (
                <Button 
                  onClick={() => handlePlayVideo(movie.trailerUrl)}
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 gap-3 text-white/70"
                >
                  <PlayCircle className="w-6 h-6" /> Trailer
                </Button>
              )}

              {/* === ALWAYS: Watchlist + Share === */}
              <Button 
                onClick={handleToggleWatchlist}
                disabled={isWatchlistLoading}
                size="lg" 
                variant="outline" 
                className={cn(
                  "h-14 px-8 rounded-2xl backdrop-blur-xl gap-3 transition-all duration-500",
                  isInWatchlist 
                    ? "bg-[#e50914]/20 border-[#e50914]/40 text-[#ff4d4d] hover:bg-[#e50914]/30" 
                    : "bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10"
                )}
              >
                <Heart className={cn("w-6 h-6 transition-all", isInWatchlist && "fill-current animate-pulse-slow")} /> 
                {isInWatchlist ? "In Watchlist" : "Watchlist"}
              </Button>
              <Button size="lg" variant="outline" className="h-14 w-14 rounded-2xl bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 flex items-center justify-center p-0">
                <Share2 className="w-6 h-6 text-zinc-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Player */}
      <MoviePlayer 
        movie={movie} 
        url={activeVideoUrl}
        isOpen={isPlayerOpen} 
        onClose={() => setIsPlayerOpen(false)} 
      />

      {/* Admin Modals */}
      <EditMovieModal 
        movie={movie} 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
      />
      <DeleteConfirmModal 
        movieId={movie.id} 
        movieTitle={movie.title} 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
      />
    </div>
  );
}
