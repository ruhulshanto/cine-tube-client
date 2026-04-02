"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Calendar, Shield, Bookmark, Play, Heart, Star, Sparkles, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMyProfileStats, updateProfileImage } from "@/services/user.services";
import { toast } from "sonner";

const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function DashboardProfilePage() {
  const { user, isLoading, setProfileImage, refreshProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: statsData, isPending: statsLoading } = useQuery({
    queryKey: ["my-profile-stats", user?.id],
    queryFn: async () => {
      const res = await getMyProfileStats();
      return res.data;
    },
    enabled: !!user?.id,
    staleTime: 20_000,
  });

  const currentAvatar =
    previewUrl ||
    user?.profileImage ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email ?? "cinetube"}`;
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("profileImage", file);
      return updateProfileImage(fd);
    },
    onSuccess: async (res) => {
      const imageUrl = res.data?.profileImage;
      if (imageUrl) setProfileImage(imageUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      await refreshProfile();
      toast.success("Profile picture updated");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload profile picture";
      toast.error(msg);
    },
  });

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (file?: File) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      toast.error("Image size must be 2MB or less.");
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden pb-12">
      <div className="container mx-auto max-w-6xl">
        <div className="relative z-10 flex flex-col items-start gap-16 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex w-full flex-col items-center space-y-8 text-center lg:w-1/3"
          >
            <div className="group relative">
              <div className="relative z-20 h-64 w-64 overflow-hidden rounded-full border-4 border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] ring-1 ring-white/10 transition-transform duration-700 group-hover:scale-105">
                <img
                  src={currentAvatar}
                  alt="Avatar"
                  className="h-full w-full bg-zinc-900 object-cover"
                />
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
                    <Camera className="h-4 w-4" />
                    Change photo
                  </span>
                </button>
              </div>
              <div className="absolute -inset-4 z-10 rounded-full bg-primary/20 opacity-50 blur-3xl transition-opacity group-hover:opacity-100" />
              
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />

            <div className="w-full max-w-md space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Profile Picture
              </p>
              <p className="text-xs text-zinc-400">
                Upload JPG/PNG (max 2MB). Preview appears before saving.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-white/15 bg-white/5"
                  onClick={handleChooseFile}
                  disabled={uploadMutation.isPending}
                >
                  Choose image
                </Button>
                <Button
                  type="button"
                  variant="netflix"
                  className="rounded-xl"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Save photo"
                  )}
                </Button>
                {selectedFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl text-zinc-300"
                    onClick={clearSelection}
                    disabled={uploadMutation.isPending}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black uppercase leading-tight tracking-tighter text-white md:text-5xl">
                {displayName}
              </h1>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{user?.role} Access</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-zinc-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Joined 2024</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-6 rounded-[2rem] border border-white/5 bg-white/5 p-8 text-left">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  <Mail className="h-3 w-3" /> Communication Line
                </p>
                <p className="truncate text-sm font-bold text-white">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  <Shield className="h-3 w-3 text-primary" /> Authority Protocol
                </p>
                <p className="text-sm font-bold uppercase tracking-tighter text-white">
                  {user?.role === "ADMIN" ? "Master Director" : "Cinema Enthusiast"}
                </p>
              </div>
              <Link href="/dashboard/settings" className="block pt-4">
                <Button
                  variant="outline"
                  className="h-14 w-full rounded-xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10"
                >
                  Configure Authority
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="w-full flex-1 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              <div className="cursor-default rounded-[2rem] border border-white/5 bg-white/5 p-8 transition-all hover:scale-[1.02] hover:bg-white/10">
                <Heart className="mb-6 h-8 w-8 text-primary" />
                <h3 className="text-3xl font-black tracking-tighter text-white">
                  {statsLoading ? "—" : (statsData?.heartsGiven ?? 0)}
                </h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">Hearts Given</p>
              </div>
              <div className="cursor-default rounded-[2rem] border border-white/5 bg-white/5 p-8 transition-all hover:scale-[1.02] hover:bg-white/10">
                <Bookmark className="mb-6 h-8 w-8 text-blue-500" />
                <h3 className="text-3xl font-black tracking-tighter text-white">
                  {statsLoading ? "—" : (statsData?.watchlistCount ?? 0)}
                </h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">In Watchlist</p>
              </div>
              <div className="cursor-default rounded-[2rem] border border-white/5 bg-white/5 p-8 transition-all hover:scale-[1.02] hover:bg-white/10">
                <Star className="mb-6 h-8 w-8 text-amber-500" />
                <h3 className="text-3xl font-black tracking-tighter text-white">
                  {statsLoading
                    ? "—"
                    : statsData?.avgRating === null || statsData?.avgRating === undefined
                      ? "—"
                      : statsData.avgRating.toFixed(1)}
                </h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">Avg Rating</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="group relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-12"
            >
              <div className="absolute right-0 top-0 scale-150 rotate-12 p-12 opacity-5 transition-transform duration-1000 group-hover:scale-[1.7] group-hover:rotate-0">
                <Play className="h-64 w-64 text-white" />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="space-y-3">
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-primary">Intelligence Report</p>
                  <h2 className="text-4xl font-black uppercase leading-none tracking-tighter text-white md:text-5xl">
                    Your Cinematic Footprint
                  </h2>
                </div>

                <p className="max-w-2xl text-lg font-medium leading-relaxed tracking-tight text-zinc-500">
                  You&apos;ve spent over 420 hours exploring independent stories and high-octane blockbusters this year.
                  Your preference for <span className="font-bold italic text-white">&quot;Sci-Fi&quot;</span> and{" "}
                  <span className="font-bold italic text-white">&quot;Noir&quot;</span> suggests an analytical, curious mind.
                </p>

                <div className="flex gap-4">
                  <Link href="/movies">
                    <Button className="h-14 gap-3 rounded-xl bg-white px-8 text-[10px] font-black uppercase tracking-widest text-black hover:bg-zinc-200">
                      Resume Exploring
                    </Button>
                  </Link>
                  <Link href="/watchlist">
                    <Button
                      variant="outline"
                      className="h-14 gap-3 rounded-xl border-white/10 bg-white/5 px-8 text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >
                      Open Vault
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
