"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
  submenu?: NavItem[];
}

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
}

export function NavDrawer({ isOpen, onClose, items }: NavDrawerProps) {
  // Lock page scroll while the overlay is open. The drawer itself still scrolls.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const drawerVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.15 + i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[190] bg-white/10 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 z-[200] flex h-dvh w-[min(400px,90vw)] flex-col overflow-hidden border border-balck/20 bg-black/10 shadow-2xl backdrop-blur-xl"
          >
            {/* Header with Close Button */}
            <div className="z-10 flex shrink-0 items-center justify-between border-b border-black/20 bg-black/10 px-6 py-4 backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#e50914]">
                  Menu
                </p>
                <h2 className="mt-1 text-xl font-black text-white tracking-tight">
                  Navigation
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-all duration-200 hover:bg-white/20"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {/* Navigation Items */}
              <nav className="space-y-2 px-4 py-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.label}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="group relative block rounded-lg border border-white/20 bg-white/10 px-4 py-3.5 backdrop-blur-xl transition-all duration-200 hover:bg-white/20"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold uppercase tracking-[0.08em] text-white">
                            {item.label}
                          </span>
                          {item.submenu && (
                            <motion.span
                              className="text-xs font-bold text-[#e50914]"
                              animate={{ x: 0 }}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              →
                            </motion.span>
                          )}
                        </div>

                        {/* Submenu indicator (if exists) */}
                        {item.submenu && (
                          <p className="mt-1.5 text-xs text-zinc-400">
                            {item.submenu.length} options
                          </p>
                        )}

                        {/* Hover indicator line */}
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#e50914] to-[#ff4d4d] transition-all duration-300 group-hover:w-full rounded-full" />
                      </Link>
                    </motion.div>

                    {/* Submenu Items */}
                    {item.submenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 mt-2 space-y-1 border-l-2 border-white/10 pl-3"
                      >
                        {item.submenu.map((submenu, subIndex) => (
                          <motion.div
                            key={submenu.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 + subIndex * 0.02 }}
                            whileHover={{ x: 2 }}
                          >
                            <Link
                              href={submenu.href}
                              onClick={onClose}
                              className="group relative block rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm uppercase tracking-[0.06em] text-zinc-300 backdrop-blur-xl transition-all duration-200 hover:bg-white/20 hover:text-white hover:pl-5"
                            >
                              <span>{submenu.label}</span>
                              <div className="absolute left-0 top-0 hidden h-full w-0.5 rounded-full bg-[#e50914] group-hover:block" />
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="border-t border-white/20 bg-white/10 p-6 backdrop-blur-xl"
              >
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Version 1.0
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Premium streaming. Infinite stories.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
