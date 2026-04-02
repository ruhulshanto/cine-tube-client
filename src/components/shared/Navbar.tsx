"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Film,
  LogOut,
  Menu,
  X,
  Bookmark,
  User,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Bell,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAdminPendingReviewCount } from "@/hooks/useAdminPendingReviewCount";
import { Skeleton } from "@/components/ui/skeleton";

export function Navbar() {
  const pathname = usePathname();
  const showBrowseContext = pathname === "/movies";

  const { user, logout: handleLogout } = useAuth();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");
  const isAdmin = user?.role === "ADMIN";
  const { data: pendingReviewCount = 0, isPending: pendingCountLoading } = useAdminPendingReviewCount(!!user && isAdmin);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 z-[100] w-full">
      <nav
        role="navigation"
        aria-label="Main"
        className={cn(
          "w-full border-b transition-[height,background,box-shadow] duration-300 ease-out",
          scrolled
            ? "border-white/10 bg-[#070707]/94 shadow-[0_10px_40px_rgba(0,0,0,0.72)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#070707]/88"
            : "border-transparent bg-gradient-to-b from-black via-black/75 to-transparent"
        )}
      >
        <div
          className={cn(
            "container mx-auto grid min-h-14 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-4 sm:min-h-16 sm:gap-x-4 sm:px-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-6 md:px-10 lg:px-16 xl:px-20",
            scrolled ? "py-2" : "py-3 sm:py-3.5"
          )}
        >
          {/* Left: brand + primary nav */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-5 md:gap-6">
            <Link
              href="/"
              className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
            >
              <div className="relative shrink-0">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/50 via-primary/20 to-transparent opacity-60 blur-[1px] transition-opacity group-hover:opacity-100" />
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="relative rounded-2xl border border-white/10 bg-zinc-900/80 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-2"
                >
                  <Film className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </motion.div>
              </div>
              <div className="min-w-0 leading-none">
                <span className="block truncate font-black text-lg tracking-[-0.04em] text-white sm:text-xl md:text-2xl lg:text-[1.65rem]">
                  CINE-TUBE
                </span>
                <span className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.28em] text-zinc-600 sm:block">
                  Stream · Review · Save
                </span>
              </div>
            </Link>

            <div className="hidden h-9 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:block" aria-hidden />

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/movies"
                className={cn(
                  "rounded-xl px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-all duration-200",
                  pathname === "/movies"
                    ? "bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-primary/35"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                )}
              >
                Browse
              </Link>
              {isAdmin && (
                <Link href="/dashboard/admin/movies/create" className="hidden lg:block">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 rounded-xl border-amber-500/35 bg-amber-500/[0.07] text-[10px] font-black uppercase tracking-widest text-amber-100/90 hover:bg-amber-500/20 hover:text-white"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Center: search OR catalog context on /movies */}
          {showBrowseContext ? (
            <div className="hidden min-w-0 flex-col items-center justify-center justify-self-center md:col-start-2 md:flex">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#e50914]" />
                </span>
                Browse catalog
              </span>
              <span className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600 lg:block">
                Search below
              </span>
            </div>
          ) : (
            <div className="hidden md:block md:col-start-2 md:h-10" />
          )}

          {/* Desktop actions — unchanged cluster; dropdown hover fixed below */}
          <div className="hidden min-w-0 shrink-0 items-center justify-self-end gap-2 md:col-start-3 md:flex md:gap-3">
            {user ? (
              <div className="relative flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 sm:gap-2">
                <Link href="/watchlist" title="Watchlist">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.04] p-0 hover:bg-white/10 lg:h-11 lg:w-11"
                      aria-label="Watchlist"
                    >
                      <Bookmark className="h-5 w-5 text-zinc-400" />
                    </Button>
                  </motion.div>
                </Link>

                {isAdmin &&
                  (pendingCountLoading ? (
                    <Skeleton className="h-10 w-10 shrink-0 rounded-2xl border border-white/10 lg:h-11 lg:w-11" />
                  ) : (
                    <Link href="/dashboard/admin/reviews" title="Review queue">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          type="button"
                          variant="ghost"
                          className="relative h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.04] p-0 hover:bg-white/10 lg:h-11 lg:w-11"
                          aria-label={
                            pendingReviewCount > 0
                              ? `${pendingReviewCount} reviews awaiting moderation`
                              : "No pending reviews"
                          }
                        >
                          <Bell
                            className={cn(
                              "h-5 w-5 text-zinc-400",
                              pendingReviewCount > 0 && "text-amber-400"
                            )}
                          />
                          {pendingReviewCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full border border-[#070707] bg-primary px-0.5 text-[9px] font-black leading-none text-white">
                              {pendingReviewCount > 99 ? "99+" : pendingReviewCount}
                            </span>
                          )}
                        </Button>
                      </motion.div>
                    </Link>
                  ))}

                <div className="mx-0.5 hidden h-6 w-px bg-white/10 sm:block" />

                {/* Invisible hover bridge (pt-2) removes dead zone between trigger and card */}
                <div
                  className="relative inline-flex"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 pr-2.5 transition-colors hover:bg-white/10 lg:pr-3"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-xl ring-1 ring-white/10 sm:h-9 sm:w-9">
                      <img
                        src={
                          user.profileImage ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="hidden max-w-[110px] truncate text-[10px] font-black uppercase tracking-widest text-zinc-300 lg:block">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={cn(
                        "hidden h-4 w-4 text-zinc-500 transition-transform sm:block",
                        dropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <div className="absolute right-0 top-full z-[200] flex w-[min(100vw-2rem,19rem)] flex-col items-stretch pt-2">
                        <motion.div
                          key="account-menu"
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0f0f0f]/96 p-2.5 shadow-[0_24px_64px_rgba(0,0,0,0.85)] backdrop-blur-xl"
                          role="menu"
                        >
                        <div className="relative mb-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="absolute right-3 top-3">
                            {user.role === "ADMIN" ? (
                              <span className="rounded-md border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-400">
                                Admin
                              </span>
                            ) : (
                              <span className="rounded-md border border-zinc-600/40 bg-zinc-600/15 px-2 py-0.5 text-[8px] font-black uppercase text-zinc-400">
                                Member
                              </span>
                            )}
                          </div>
                          <p className="mb-1 text-[9px] font-black uppercase tracking-[0.25em] text-primary">My account</p>
                          <p className="truncate text-base font-black text-white">{displayName}</p>
                          <p className="truncate text-[10px] font-medium text-zinc-500">{user.email}</p>
                        </div>

                        <div className="space-y-1 p-1">
                          {user.role === "ADMIN" && (
                            <>
                              <Link
                                href="/dashboard/admin/insights"
                                className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/10"
                                onClick={() => setDropdownOpen(false)}
                                role="menuitem"
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-500">
                                  <LayoutDashboard className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wide text-white">Dashboard</span>
                              </Link>
                              <Link
                                href="/dashboard/admin/movies/create"
                                className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/10"
                                onClick={() => setDropdownOpen(false)}
                                role="menuitem"
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/15 text-primary">
                                  <Upload className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wide text-white">Upload movies</span>
                              </Link>
                            </>
                          )}
                          <div className="grid grid-cols-2 gap-1">
                            <Link
                              href="/dashboard/profile"
                              className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:bg-white/10"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <User className="h-5 w-5 text-zinc-400" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Profile</span>
                            </Link>
                            <Link
                              href="/dashboard/settings"
                              className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:bg-white/10"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <Settings className="h-5 w-5 text-zinc-400" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Settings</span>
                            </Link>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const id = toast.loading("Signing out…");
                              setTimeout(() => {
                                handleLogout();
                                toast.dismiss(id);
                              }, 600);
                            }}
                            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 transition-colors hover:bg-rose-500/10"
                            role="menuitem"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white sm:px-6"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="netflix" className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest sm:px-6">
                    Join
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1 md:hidden">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-white/10 bg-[#070707]/98 backdrop-blur-xl md:hidden"
            >
              <div className="space-y-6 px-4 py-6 sm:px-6">
                {user && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt=""
                        className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-white">{displayName}</p>
                        <p className="truncate text-[10px] font-medium text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                  <Link href="/movies" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="h-14 w-full justify-start gap-4 rounded-2xl text-base font-black uppercase tracking-wide">
                      <Film className="h-5 w-5" />
                      Browse all
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/dashboard/admin/movies/create" onClick={() => setMobileOpen(false)} className="lg:hidden">
                      <Button
                        variant="ghost"
                        className="h-14 w-full justify-start gap-4 rounded-2xl text-base font-black uppercase tracking-wide text-amber-400"
                      >
                        <Upload className="h-5 w-5" />
                        Upload movies
                      </Button>
                    </Link>
                  )}
                  {user ? (
                    <>
                      <Link href="/watchlist" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="h-14 w-full justify-start gap-4 rounded-2xl text-base font-black uppercase tracking-wide">
                          <Bookmark className="h-5 w-5" />
                          Watchlist
                        </Button>
                      </Link>
                      {user.role === "ADMIN" && (
                        <>
                          <Link href="/dashboard/admin" onClick={() => setMobileOpen(false)} className="block">
                            <Button
                              variant="ghost"
                              className="h-14 w-full justify-start gap-4 rounded-2xl text-base font-black uppercase tracking-wide text-amber-400"
                            >
                              <LayoutDashboard className="h-5 w-5" />
                              Command center
                            </Button>
                          </Link>
                          <Link href="/dashboard/admin/reviews" onClick={() => setMobileOpen(false)} className="block">
                            <Button
                              variant="ghost"
                              className="relative h-14 w-full justify-start gap-4 rounded-2xl text-base font-black uppercase tracking-wide text-amber-400"
                            >
                              <Bell className="h-5 w-5" />
                              Review queue
                              {pendingReviewCount > 0 && !pendingCountLoading && (
                                <span className="ml-auto flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-primary px-2 text-sm font-black text-white">
                                  {pendingReviewCount > 99 ? "99+" : pendingReviewCount}
                                </span>
                              )}
                            </Button>
                          </Link>
                        </>
                      )}
                      <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="h-14 w-full justify-start gap-4 rounded-2xl text-base font-black uppercase tracking-wide">
                          <User className="h-5 w-5" />
                          Profile
                        </Button>
                      </Link>
                      <Link href="/dashboard/settings" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="h-14 w-full justify-start gap-4 rounded-2xl text-base font-black uppercase tracking-wide">
                          <Settings className="h-5 w-5" />
                          Settings
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="h-14 w-full justify-start gap-4 rounded-2xl text-base font-black uppercase tracking-wide text-rose-400"
                        onClick={() => {
                          setMobileOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)} className="block">
                        <Button variant="ghost" className="h-14 w-full rounded-2xl text-base font-black uppercase tracking-widest">
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)} className="block">
                        <Button variant="netflix" className="h-14 w-full rounded-2xl text-base font-black uppercase tracking-widest shadow-xl">
                          Get started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
