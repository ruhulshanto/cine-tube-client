"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMovieDetails } from "@/services/movie.services";
import { getMovieReviews, postReview } from "@/services/interaction.services";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MovieHero } from "@/components/movies/MovieHero";
import { MovieReviews } from "@/components/movies/MovieReviews";
import { useMovieAccess } from "@/hooks/useMovieAccess";
import { ADMIN_PENDING_REVIEW_COUNT_QUERY_KEY } from "@/hooks/useAdminPendingReviewCount";
import { cn } from "@/lib/utils";
import { filterReviewsForDisplay } from "@/lib/reviewVisibility";
import { useAuth } from "@/context/AuthContext";
import { useMemo, useState } from "react";

export default function MovieDetailsPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [reviewFormVersion, setReviewFormVersion] = useState(0);

  const { data: movieResponse, isLoading: movieLoading } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId && movieId !== "undefined",
  });

  const { data: reviewsResponse, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", movieId],
    queryFn: () => getMovieReviews(movieId),
    enabled: !!movieId && movieId !== "undefined",
  });

  const { mutate: mutateReview, isPending: isReviewing } = useMutation({
    mutationFn: (data: Parameters<typeof postReview>[1]) => postReview(movieId as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      queryClient.invalidateQueries({ queryKey: ADMIN_PENDING_REVIEW_COUNT_QUERY_KEY });
      setReviewFormVersion((v) => v + 1);
      toast.success("Review posted successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to post review", { description: err?.response?.data?.message || "Something went wrong."});
    }
  });

  const handleSubmitReview = (
    rating: number,
    comment: string,
    opts?: { hasSpoiler: boolean; tags: string[] }
  ) => {
    mutateReview({
      rating,
      comment,
      hasSpoiler: opts?.hasSpoiler ?? false,
      tags: opts?.tags ?? [],
    });
  };

  const movie = movieResponse?.data;
  const reviews = reviewsResponse?.data || [];
  const visibleReviewCount = useMemo(
    () => filterReviewsForDisplay(reviews, user).length,
    [reviews, user]
  );

  // ✅ New Review Permission Check Logic
  // Only check if user is logged in and movie is NOT free
  const { hasAccess } = useMovieAccess(movieId as string, movie?.pricingType || "");

  if (movieLoading) return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!movie) return <div className="text-center py-20 text-zinc-400">Movie not found</div>;

  return (
    <div className="relative bg-[#0b0b0b] min-h-screen pb-24">
      <MovieHero movie={movie} />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 -translate-y-4 relative z-30">
         <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="h-16 p-1.5 glass-morphism rounded-3xl border-white/5 mb-16 inline-flex shadow-2xl">
                <TabsTrigger value="details" className="h-full rounded-2xl px-12 text-sm font-black uppercase tracking-widest data-[state=active]:bg-[#e50914] data-[state=active]:text-white transition-all duration-500">Overview</TabsTrigger>
                <TabsTrigger value="reviews" className="h-full rounded-2xl px-12 text-sm font-black uppercase tracking-widest data-[state=active]:bg-[#e50914] data-[state=active]:text-white transition-all duration-500">
                  Reviews <span className={cn("ml-3 px-2.5 py-0.5 rounded-full text-[10px] bg-black/40 border border-white/10")}>{visibleReviewCount}</span>
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4 focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Main Story Column */}
                <div className="lg:col-span-7 space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-4xl font-black text-white tracking-tighter uppercase border-b border-primary w-fit pb-2 drop-shadow-lg">Synopsis</h3>
                      <p className="text-zinc-400 leading-[1.8] text-xl font-medium tracking-wide first-letter:text-5xl first-letter:font-black first-letter:text-[#e50914] first-letter:mr-3 first-letter:float-left">
                        {movie.synopsis}
                      </p>
                   </div>
                </div>

                {/* Sidebar Info Column */}
                <div className="lg:col-span-5 space-y-8">
                   <div className="p-8 rounded-[2.5rem] glass-morphism border-white/10 space-y-8 shadow-2xl">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Production Intel</h3>
                      
                      <div className="space-y-6">
                        <div className="group/item">
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#e50914] block mb-2 transition-transform group-hover/item:translate-x-1">Director</span>
                           <span className="text-2xl font-bold text-zinc-100 line-clamp-1">{movie.director}</span>
                        </div>

                        <div className="h-[1px] bg-gradient-to-r from-white/10 to-transparent" />

                        <div className="group/item">
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#e50914] block mb-3 transition-transform group-hover/item:translate-x-1">Leading Cast</span>
                           <div className="flex flex-wrap gap-2">
                              {movie.cast?.map((actor: string) => (
                                <span key={actor} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm font-semibold text-zinc-300 hover:bg-white/10 transition-colors uppercase tracking-tight">
                                  {actor}
                                </span>
                              ))}
                           </div>
                        </div>

                        <div className="h-[1px] bg-gradient-to-r from-white/10 to-transparent" />

                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Release</span>
                              <span className="text-lg font-bold text-zinc-200">{movie.releaseYear}</span>
                           </div>
                           <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Language</span>
                              <span className="text-lg font-bold text-zinc-200">English</span>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="focus-visible:outline-none">
               <MovieReviews 
                 movieId={movieId}
                 hasAccess={hasAccess}
                 reviews={reviews} 
                 reviewsLoading={reviewsLoading} 
                 isReviewing={isReviewing} 
                 onSubmitReview={handleSubmitReview}
                 reviewFormVersion={reviewFormVersion}
               />
            </TabsContent>
         </Tabs>
      </div>
    </div>
  );
}
