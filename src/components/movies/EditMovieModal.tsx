"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMovie } from "@/services/movie.services";
import { Movie } from "@/types/movie.types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Film, Image as ImageIcon, Video, FileText, Calendar, Clock, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";

interface EditMovieModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

export function EditMovieModal({ movie, isOpen, onClose }: EditMovieModalProps) {
  const queryClient = useQueryClient();

  const { mutate: handleUpdate, isPending } = useMutation({
    mutationFn: (data: Partial<Movie>) => updateMovie(movie.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movie", movie.id] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie Updated", { description: `${movie.title} has been successfully updated.` });
      onClose();
    },
    onError: (error: any) => {
      toast.error("Update Failed", { description: error.message || "An error occurred while updating the movie." });
    },
  });

  const form = useForm({
    defaultValues: {
      title: movie.title,
      synopsis: movie.synopsis,
      posterUrl: movie.posterUrl || "",
      backdropUrl: movie.backdropUrl || "",
      trailerUrl: movie.trailerUrl || "",
      releaseYear: movie.releaseYear,
      duration: movie.duration,
    },
    onSubmit: async ({ value }) => {
      handleUpdate(value);
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl h-fit max-h-[90vh] bg-[#141414] border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left Preview */}
            <div className="hidden lg:block w-1/3 bg-black/40 relative overflow-hidden group">
               <img 
                 src={movie.posterUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000"} 
                 alt="Preview" 
                 className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
               <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <p className="text-[#e50914] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Live Preview Protocol</p>
                  <h3 className="text-2xl font-black text-white tracking-tighter leading-tight line-clamp-2">{movie.title}</h3>
                  <div className="flex gap-4 mt-4 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    <span>{movie.releaseYear}</span>
                    <span>{movie.duration}m</span>
                  </div>
               </div>
            </div>

            {/* Right Form */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Admin Deck</h2>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed uppercase tracking-widest">Refine the cinematic master</p>
                </div>
                <button 
                   onClick={onClose}
                   className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }} 
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Poster URL
                    </label>
                    <form.Field
                      name="posterUrl"
                      children={(field) => (
                        <Input 
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="h-14 bg-white/5 border-white/5 px-6 rounded-2xl text-xs font-medium focus:bg-white/10 transition-colors" 
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Backdrop URL
                    </label>
                    <form.Field
                      name="backdropUrl"
                      children={(field) => (
                        <Input 
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="h-14 bg-white/5 border-white/5 px-6 rounded-2xl text-xs font-medium focus:bg-white/10 transition-colors" 
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                    <Film className="w-3 h-3" /> Movie Title
                  </label>
                  <form.Field
                      name="title"
                      children={(field) => (
                        <Input 
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="h-16 bg-white/5 border-white/5 px-6 rounded-2xl text-xl font-black focus:bg-white/10 transition-colors" 
                        />
                      )}
                    />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Synopsis
                  </label>
                  <form.Field
                      name="synopsis"
                      children={(field) => (
                        <Textarea 
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="min-h-[120px] bg-white/5 border-white/5 p-6 rounded-[1.5rem] text-sm leading-relaxed font-semibold focus:bg-white/10 transition-colors resize-none" 
                        />
                      )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                      <Video className="w-3 h-3" /> Trailer URL
                    </label>
                    <form.Field
                      name="trailerUrl"
                      children={(field) => (
                        <Input 
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="h-14 bg-white/5 border-white/5 px-6 rounded-2xl text-xs font-medium focus:bg-white/10 transition-colors" 
                        />
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Year
                        </label>
                        <form.Field
                          name="releaseYear"
                          children={(field) => (
                            <Input 
                              type="number"
                              value={field.state.value || 0}
                              onChange={(e) => field.handleChange(Number(e.target.value))}
                              className="h-14 bg-white/5 border-white/5 px-6 rounded-2xl text-xs font-bold focus:bg-white/10 transition-colors" 
                            />
                          )}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Dur (m)
                        </label>
                        <form.Field
                          name="duration"
                          children={(field) => (
                            <Input 
                              type="number"
                              value={field.state.value || 0}
                              onChange={(e) => field.handleChange(Number(e.target.value))}
                              className="h-14 bg-white/5 border-white/5 px-6 rounded-2xl text-xs font-bold focus:bg-white/10 transition-colors" 
                            />
                          )}
                        />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="flex-1 h-16 bg-primary hover:bg-[#b80711] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl active:scale-[0.98] transition-all gap-3"
                  >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Master Copy
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
