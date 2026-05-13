"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Search,
  Bookmark,
  Home,
  Gift,
  CreditCard,
  Compass,
  Info,
  Globe,
  Film,
  LayoutGrid,
  Tv,
  List,
  Target,
  BookOpen,
  Shield,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";
import { HiOutlineMenu } from "react-icons/hi";
import { NavDrawer } from "@/components/shared/NavDrawer";
import { SearchModal } from "@/components/shared/SearchModal";
import { useAuth } from "@/context/AuthContext";

const fullNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Live TV", href: "/live-tv", icon: Tv },
  { label: "Gift Cards", href: "/gift-cards", icon: Gift },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
  {
    label: "Browse",
    href: "/movies",
    icon: Compass,
    submenu: [
      { label: "By Region", href: "/browse/region", icon: Globe },
      { label: "By Genre", href: "/browse/genre", icon: Film },
      { label: "By Categories", href: "/browse/categories", icon: LayoutGrid },
      { label: "Web Shows", href: "/browse/web-shows", icon: Tv },
      { label: "All Titles", href: "/movies", icon: List },
    ],
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
    submenu: [
      { label: "Our Story", href: "/story", icon: BookOpen },
      { label: "Responsibilities", href: "/responsibilities", icon: Shield },
      { label: "Merch Store", href: "/merch", icon: ShoppingBag },
      { label: "Help Center", href: "/help", icon: HelpCircle },
    ],
  },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Live TV", href: "/live-tv" },
  { label: "Movies", href: "/movies" },
];

const quickLinks = [
  { label: "Browse", href: "/movies" },
  { label: "Live TV", href: "/live-tv" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Help Center", href: "/help" },
];

const getDisplayName = (user: {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  username?: string | null;
  email: string;
}) => {
  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (fullName) return fullName;
  if (user.name) return user.name;
  if (user.username) return user.username;
  return user.email.split("@")[0];
};

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const profileImageUrl = user?.profileImage || user?.avatar || "";
  const displayName = user ? getDisplayName(user) : "User";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join("") || "U";

  const closeProfileMenu = () => setProfileOpen(false);
  const toggleProfileMenu = () => setProfileOpen((value) => !value);
  const openProfileMenu = () => setProfileOpen(true);
  const handleProfileMouseLeave = () => setProfileOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.6;
      setScrolled(window.scrollY > heroHeight);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const profileBtn = (e.target as HTMLElement).closest(
        "[data-profile-button]",
      );
      const profileMenu = (e.target as HTMLElement).closest(
        "[data-profile-menu]",
      );

      if (!profileBtn && !profileMenu) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [profileOpen]);

  // Handle Search Modal Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === "Escape") {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"}`}
      >
        <div className="flex w-full h-16 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setDrawerOpen(false);
                  setMobileOpen((prev) => !prev);
                } else {
                  setMobileOpen(false);
                  setDrawerOpen(true);
                }
              }}
              onPointerEnter={() => {
                if (window.innerWidth >= 768) {
                  setMobileOpen(false);
                  setDrawerOpen(true);
                }
              }}
              onFocus={() => {
                if (window.innerWidth >= 768) {
                  setMobileOpen(false);
                  setDrawerOpen(true);
                }
              }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/30"
              aria-label={mobileOpen || drawerOpen ? "Close menu" : "Open menu"}
            >
              <HiOutlineMenu className="h-6 w-6" />
            </motion.button>

            <Link href="/" className="group flex items-center">
              <span
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                className="text-3xl md:text-4xl text-white tracking-[0.18em] font-normal relative transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:tracking-[0.30em] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-white/0 after:via-white after:to-white/0 after:transition-all after:duration-700 after:rounded-full group-hover:after:w-full group-hover:after:animate-[pulse_2s_infinite]"
              >
                CINE-TUBE

                {/* Floating particles */}
                <span className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <span className="absolute top-0 left-1/4 w-[1px] h-[2px] bg-white/80 rounded-full animate-[float_3s_infinite_0.2s]"></span>
                  <span className="absolute top-1/2 left-1/3 w-[1px] h-[1px] bg-white/60 rounded-full animate-[float_2.8s_infinite_0.5s]"></span>
                  <span className="absolute top-1/4 right-1/3 w-[1px] h-[2px] bg-white/70 rounded-full animate-[float_3.2s_infinite_0.3s]"></span>
                  <span className="absolute top-3/4 left-1/2 w-[1px] h-[1px] bg-white/50 rounded-full animate-[float_2.5s_infinite_0.7s]"></span>
                  <span className="absolute top-1/3 right-1/4 w-[1px] h-[2px] bg-white/80 rounded-full animate-[float_3.5s_infinite_0.1s]"></span>
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div
                className="relative z-50"
                onMouseEnter={openProfileMenu}
                onMouseLeave={handleProfileMouseLeave}
              >
                {/* Dummy placeholder to maintain layout width and prevent shifting */}
                <div className="invisible flex items-center gap-3 px-3 py-2 border border-transparent select-none pointer-events-none">
                  <div className="h-9 w-9" />
                  <div className="hidden md:flex flex-col">
                    <span className="text-sm font-semibold">{displayName}</span>
                    <span className="text-[11px] uppercase tracking-[0.24em]">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    width: profileOpen ? (window.innerWidth < 768 ? 220 : 280) : "100%",
                    borderRadius: profileOpen ? 28 : 99,
                    backgroundColor: profileOpen
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(255, 255, 255, 0.05)",
                    boxShadow: profileOpen
                      ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                      : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                  transition={{
                    type: "tween",
                    ease: [0.23, 1, 0.32, 1],
                    duration: 0.3,
                  }}
                  className="absolute top-0 right-0 rounded-[10px] border border-white/15 bg-white/5 backdrop-blur-3xl overflow-hidden will-change-[width,height,border-radius]"
                >
                  {/* Profile Trigger (Top of the card) */}
                  <div
                    className="group flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors duration-200 hover:bg-white/5"
                    onClick={toggleProfileMenu}
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/20 bg-slate-900/80 transition-transform duration-300 group-hover:scale-105">
                      {profileImageUrl ? (
                        <Image
                          src={profileImageUrl}
                          alt={displayName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#e50914] to-[#b80711] text-xs font-bold uppercase text-white shadow-inner">
                          {initials}
                        </span>
                      )}
                    </div>
                    <div className="hidden md:flex flex-col leading-tight min-w-0">
                      <span className="text-sm font-semibold text-white truncate">
                        {displayName}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.24em] text-white/60 truncate">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-white/70 transition-transform duration-300 ${profileOpen ? "rotate-180" : "group-hover:text-white"}`}
                    />
                  </div>

                  {/* Expanded Menu Content */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/10"
                      >
                        <div className="px-4 py-2 bg-white/5">
                          <p className="truncate text-[11px] text-white/40">
                            {user.email}
                          </p>
                        </div>

                        <div className="p-2">
                          <div className="grid gap-0.5">
                            {user.role === "ADMIN" && (
                              <Link
                                href="/dashboard/admin/movies"
                                onClick={closeProfileMenu}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-white/10">
                                  <Settings className="h-4 w-4 shrink-0" />
                                </div>
                                <span className="font-medium">Admin Panel</span>
                              </Link>
                            )}

                            <Link
                              href="/watchlist"
                              onClick={closeProfileMenu}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-white/10">
                                <Bookmark className="h-4 w-4 shrink-0" />
                              </div>
                              <span className="font-medium">Watchlist</span>
                            </Link>

                            <Link
                              href="/dashboard/profile"
                              onClick={closeProfileMenu}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-white/10">
                                <User className="h-4 w-4 shrink-0" />
                              </div>
                              <span className="font-medium">My Profile</span>
                            </Link>

                            <div className="my-1 border-t border-white/5" />

                            <button
                              onClick={() => {
                                logout();
                                closeProfileMenu();
                              }}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400/70 transition-all duration-200 hover:bg-red-400/10 hover:text-red-400"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/5 transition-colors group-hover:bg-red-400/10">
                                <LogOut className="h-4 w-4 shrink-0" />
                              </div>
                              <span className="font-medium">Sign Out</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden rounded-full text-white md:inline-flex"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  variant="netflix"
                  size="sm"
                  className="hidden rounded-full md:inline-flex"
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}


          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="md:hidden"
            >
              <div className="space-y-2 border border-white/20 bg-white/10 px-4 py-5 backdrop-blur-xl max-h-[70vh] overflow-y-auto">
                <div className="grid gap-2">
                  {fullNavItems.map((item) =>
                    item.submenu ? (
                      <div key={item.label}>
                        <button
                          onClick={() =>
                            setMobileExpanded(
                              mobileExpanded === item.label ? null : item.label
                            )
                          }
                          className="flex w-full items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white/20"
                        >
                          {item.icon && (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                              <item.icon className="h-4 w-4 text-primary" />
                            </span>
                          )}
                          <span className="flex-1 text-left">{item.label}</span>
                          <motion.span
                            animate={{
                              rotate: mobileExpanded === item.label ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="text-xs text-primary"
                          >
                            ▾
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-2 mt-2 grid gap-1.5">
                                {item.submenu.map((sub) => {
                                  const SubIcon = sub.icon;
                                  return (
                                    <Link
                                      key={sub.label}
                                      href={sub.href}
                                      onClick={() => {
                                        setMobileOpen(false);
                                        setMobileExpanded(null);
                                      }}
                                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm uppercase tracking-[0.12em] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.12] hover:text-white"
                                    >
                                      {SubIcon && (
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                          <SubIcon className="h-4 w-4 text-primary" />
                                        </span>
                                      )}
                                      <span>{sub.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white/20"
                      >
                        {item.icon && (
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                            <item.icon className="h-4 w-4 text-primary" />
                          </span>
                        )}
                        {item.label}
                      </Link>
                    )
                  )}
                </div>


                {!isAuthenticated && (
                  <div className="grid gap-3 pt-2 border-t border-white/10">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full rounded-full py-4"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      variant="netflix"
                      size="lg"
                      className="w-full rounded-full py-4"
                    >
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* NavDrawer Component */}
      <NavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={fullNavItems}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
