"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { LivePlayer } from "@/components/player/LivePlayer";
import { PremiumModal } from "@/components/player/PremiumModal";
import { Channel } from "@/lib/channels";
import { cn } from "@/lib/utils";
import { Play, Lock } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import {
  PlayerSkeleton,
  ChannelSkeleton,
  CategorySkeleton,
  ProgramGuideSkeleton,
} from "@/components/skeleton/Skeleton";

type Category = "All" | "News" | "Sports" | "Movies";

export default function LiveTVPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [mounted, setMounted] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [premiumModal, setPremiumModal] = useState<{
    isOpen: boolean;
    channelName?: string;
  }>({ isOpen: false });

  // Fetch channels from API
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch("/api/channels");
        const data = await response.json();
        setChannels(data.data);

        // Initialize from localStorage
        const savedChannelId = localStorage.getItem("lastSelectedChannel");
        if (savedChannelId) {
          const channel = data.data.find(
            (ch: Channel) => ch.id === savedChannelId,
          );
          setSelectedChannel(channel || data.data[0]);
        } else {
          setSelectedChannel(data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setIsInitialLoading(false);
        setMounted(true);
      }
    };

    fetchChannels();
  }, []);

  const handleChannelSwitch = (channel: Channel) => {
    if (channel.isPremium && selectedChannel?.id !== channel.id) {
      setPremiumModal({ isOpen: true, channelName: channel.name });
      return;
    }

    if (channel.id === selectedChannel?.id) return;

    setIsLoading(true);
    localStorage.setItem("lastSelectedChannel", channel.id);
    setSelectedChannel(channel);
  };

  const handlePlayerLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handlePlayerError = useCallback(
    (error: string) => {
      console.error("Player error:", error);
      // Auto-switch to next available non-premium channel after a short delay
      setTimeout(() => {
        const currentIndex = channels.findIndex(
          (ch) => ch.id === selectedChannel?.id,
        );
        // Find next non-premium channel
        let nextIndex = (currentIndex + 1) % channels.length;
        let attempts = 0;
        while (attempts < channels.length) {
          const candidate = channels[nextIndex];
          if (!candidate.isPremium && candidate.id !== selectedChannel?.id) {
            handleChannelSwitch(candidate);
            return;
          }
          nextIndex = (nextIndex + 1) % channels.length;
          attempts++;
        }
        // If no suitable channel found, just stop loading
        setIsLoading(false);
      }, 2000); // 2 second delay before auto-switching
    },
    [channels, selectedChannel, handleChannelSwitch],
  );

  const handlePlayerRetry = useCallback(() => {
    setIsLoading(true);
    setSelectedChannel((prev) => (prev ? { ...prev } : null));
  }, []);

  // Failsafe: ensure loading never gets stuck
  useEffect(() => {
    if (!selectedChannel) return;

    setIsLoading(true);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 12000);

    return () => clearTimeout(timeout);
  }, [selectedChannel]);

  const filteredChannels =
    selectedCategory === "All"
      ? channels
      : channels.filter((ch) => ch.category === selectedCategory);

  const categorizedChannels = {
    News: filteredChannels.filter((ch) => ch.category === "News"),
    Sports: filteredChannels.filter((ch) => ch.category === "Sports"),
    Movies: filteredChannels.filter((ch) => ch.category === "Movies"),
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white p-4 lg:p-8">
        <div className="space-y-8">
          <CategorySkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <PlayerSkeleton />
              <ProgramGuideSkeleton />
            </div>
            <div className="lg:col-span-1 space-y-2">
              {[...Array(5)].map((_, i) => (
                <ChannelSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories: Category[] = ["All", "News", "Sports", "Movies"];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header - Clean, minimal design */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-[#e50914] rounded-full"></div>
            <h1 className="text-5xl font-black text-white">Live TV</h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Watch live streams from your favorite channels
          </p>
        </motion.div>

        {/* Category Filter Tabs - Unified styling */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex gap-3 overflow-x-auto pb-2"
        >
          {categories.map((category, idx) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-6 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-300",
                "border",
                selectedCategory === category
                  ? "bg-[#e50914] text-white border-[#e50914]"
                  : "bg-[#1f1f1f] text-white hover:bg-[#2a2a2a] border-white/10",
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Player Section - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Player Card - Clean unified design */}
            <motion.div
              layout
              className="rounded-lg overflow-hidden border border-white/10 bg-[#141414] transition-all duration-300"
            >
              {isInitialLoading ? (
                <PlayerSkeleton />
              ) : selectedChannel ? (
                <LivePlayer
                  streamUrl={selectedChannel.streamUrl}
                  title={selectedChannel.name}
                  autoplay={true}
                  controls={true}
                  isLoading={isLoading}
                  onLoaded={handlePlayerLoaded}
                  onError={handlePlayerError}
                  onRetry={handlePlayerRetry}
                />
              ) : null}
            </motion.div>

            {/* Program Guide Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              layout
              className="rounded-lg overflow-hidden border border-white/10 bg-[#141414] p-6 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-[#e50914] rounded-full"></div>
                <span>Program Guide</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Program */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="group"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#e50914] rounded-full animate-pulse"></div>
                    <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                      Now Playing
                    </p>
                  </div>
                  <p className="text-2xl font-bold group-hover:text-[#e50914] transition-colors duration-300 mb-2">
                    {selectedChannel?.nowPlaying.title}
                  </p>
                  <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    <span className="text-[#e50914] font-semibold">
                      {selectedChannel?.nowPlaying.startTime}
                    </span>{" "}
                    -{" "}
                    <span className="text-zinc-300 font-semibold">
                      {selectedChannel?.nowPlaying.endTime}
                    </span>
                  </p>
                </motion.div>

                {/* Next Program */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="group"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
                    <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                      Coming Next
                    </p>
                  </div>
                  <p className="text-2xl font-bold group-hover:text-[#e50914] transition-colors duration-300 mb-2">
                    {selectedChannel?.nextPlaying.title}
                  </p>
                  <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    <span className="text-zinc-400 font-semibold">
                      {selectedChannel?.nextPlaying.startTime}
                    </span>{" "}
                    -{" "}
                    <span className="text-zinc-300 font-semibold">
                      {selectedChannel?.nextPlaying.endTime}
                    </span>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Channels Sidebar - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="rounded-lg overflow-hidden sticky top-24 border border-white/10 bg-[#141414] transition-all duration-300">
              {/* Channels Header */}
              <div className="px-6 py-5 border-b border-white/10 bg-[#0b0b0b]">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#e50914] rounded-full"></div>
                  {filteredChannels.length} Channels
                </h2>
              </div>

              {/* Channels List */}
              <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                {isInitialLoading
                  ? [...Array(5)].map((_, i) => <ChannelSkeleton key={i} />)
                  : Object.entries(categorizedChannels).map(
                      ([category, channels]) =>
                        channels.length > 0 ? (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* Category Header */}
                            <div className="px-6 py-3 bg-[#0b0b0b] text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
                              {category}
                            </div>

                            {/* Category Channels */}
                            {channels.map((channel, idx) => (
                              <motion.button
                                key={channel.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: 0.3 + idx * 0.05,
                                }}
                                onClick={() => handleChannelSwitch(channel)}
                                className={cn(
                                  "w-full px-4 py-3.5 text-left border-b border-white/5 transition-all duration-300 group relative",
                                  "hover:bg-[#1f1f1f]",
                                  selectedChannel?.id === channel.id &&
                                    "bg-[#e50914]/15 border-l-4 border-l-[#e50914]",
                                )}
                                disabled={
                                  isLoading &&
                                  selectedChannel?.id === channel.id
                                }
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-start gap-3">
                                  {/* Channel Logo Container */}
                                  <motion.div
                                    className={cn(
                                      "w-12 h-9 rounded flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300",
                                      "bg-[#1f1f1f] border border-white/10",
                                      selectedChannel?.id === channel.id &&
                                        "ring-2 ring-[#e50914] border-[#e50914]",
                                    )}
                                    whileHover={{ scale: 1.08 }}
                                  >
                                    <img
                                      src={channel.logo}
                                      alt={channel.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const img =
                                          e.target as HTMLImageElement;
                                        img.style.display = "none";
                                      }}
                                    />
                                  </motion.div>

                                  {/* Channel Info */}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-sm leading-tight truncate group-hover:text-[#e50914] transition-colors duration-300">
                                        {channel.name}
                                      </p>
                                      {channel.isPremium && (
                                        <Lock className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                                      )}
                                      {selectedChannel?.id === channel.id && (
                                        <div className="flex items-center gap-1 bg-[#e50914] px-2 py-0.5 rounded-full animate-pulse flex-shrink-0">
                                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                          <span className="text-white text-[10px] font-bold tracking-widest">
                                            LIVE
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs text-zinc-500 line-clamp-1 group-hover:text-zinc-400 transition-colors duration-300 mt-0.5">
                                      {channel.nowPlaying.title}
                                    </p>
                                  </div>

                                  {/* Active Indicator */}
                                  {selectedChannel?.id === channel.id && (
                                    <Play className="w-4 h-4 flex-shrink-0 fill-[#e50914] text-[#e50914] animate-pulse" />
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </motion.div>
                        ) : null,
                    )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={premiumModal.isOpen}
        channelName={premiumModal.channelName}
        onClose={() => setPremiumModal({ isOpen: false })}
      />
    </div>
  );
}
