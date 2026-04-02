"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMovie } from "@/services/movie.services";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteConfirmModalProps {
  movieId: string;
  movieTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteConfirmModal({ movieId, movieTitle, isOpen, onClose }: DeleteConfirmModalProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: () => deleteMovie(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie Deleted", { description: `${movieTitle} has been removed from the platform.` });
      onClose();
      router.push("/movies");
    },
    onError: (error: any) => {
      toast.error("Deletion Failed", { description: error.message || "An error occurred while deleting the movie." });
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] overflow-hidden p-8 md:p-10"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Warning Icon */}
              <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-[#e50914]/10 border border-[#e50914]/20">
                 <AlertTriangle className="w-10 h-10 text-primary" />
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Delete Master Copy?</h2>
                <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                   Are you sure you want to permanently remove <span className="text-white font-bold">"{movieTitle}"</span>? This action cannot be undone.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col w-full gap-3 pt-4">
                 <Button 
                    onClick={() => handleDelete()}
                    disabled={isPending}
                    className="h-16 bg-primary hover:bg-[#b80711] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 gap-3"
                 >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    Confirm Deletion
                 </Button>
                 <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="h-16 bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                 >
                    Discard Action
                 </Button>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
            >
               <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
