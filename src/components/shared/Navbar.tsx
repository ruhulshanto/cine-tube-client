"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Search,
} from "lucide-react";
import { HiOutlineMenu } from "react-icons/hi";
import { NavDrawer } from "@/components/shared/NavDrawer";
import { useAuth } from "@/context/AuthContext";

const fullNavItems = [
  { label: "Home", href: "/" },
  { label: "Live TV", href: "/live-tv" },
  {
    label: "Browse",
    href: "/movies",
    submenu: [
      { label: "By Region", href: "/browse/region" },
      { label: "By Genre", href: "/browse/genre" },
      { label: "By Categories", href: "/browse/categories" },
      { label: "Web Shows", href: "/browse/web-shows" },
      { label: "All Titles", href: "/movies" },
    ],
  },
  {
    label: "About",
    href: "/about",
    submenu: [
      { label: "Mission", href: "/about" },
      { label: "Our Story", href: "/story" },
      { label: "Responsibilities", href: "/responsibilities" },
      { label: "Merch Store", href: "/merch" },
      { label: "Help Center", href: "/help" },
    ],
  },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Live TV", href: "/live-tv" },
  { label: "Movies", href: "/movies" },
  { label: "Search", href: "/search" },
];

const quickLinks = [
  { label: "Browse", href: "/movies" },
  { label: "Live TV", href: "/live-tv" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Help Center", href: "/help" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"}`}
      >
        <div className="flex w-full h-16 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => {
                setMobileOpen(false);
                setDrawerOpen(true);
              }}
              onFocus={() => {
                setMobileOpen(false);
                setDrawerOpen(true);
              }}
              onPointerEnter={() => {
                setMobileOpen(false);
                setDrawerOpen(true);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/30"
              aria-label="Open menu"
            >
              <HiOutlineMenu className="h-6 w-6" />
            </motion.button>

            <Link
              href="/"
              className="text-lg font-black uppercase tracking-[-0.04em] text-white sm:text-xl md:text-2xl"
            >
              CINE-TUBE
            </Link>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                scroll={item.label === "Search" ? false : true}
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label={item.label}
              >
                {item.label === "Search" ? (
                  <Search className="h-4 w-4" />
                ) : (
                  item.label
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative group">
                <motion.button
                  data-profile-button
                  onClick={() => setProfileOpen(!profileOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-white/10"
                >
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#e50914] to-[#b80711] flex items-center justify-center text-xs font-bold text-white">
                    {user.username?.charAt(0).toUpperCase() ||
                      user.firstName?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                  <span className="hidden text-sm font-semibold text-white md:inline">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username || user.email.split("@")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-white/70 transition group-hover:rotate-180" />
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      data-profile-menu
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-black/90 shadow-xl backdrop-blur-xl z-50"
                    >
                      <div className="border-b border-white/10 p-4">
                        <p className="text-sm font-semibold text-white">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username || "User"}
                        </p>
                        <p className="text-xs text-white/60">{user.email}</p>
                        <p className="text-xs text-[#e50914] font-semibold mt-2 uppercase tracking-wider">
                          {user.role}
                        </p>
                      </div>

                      {user.role === "ADMIN" && (
                        <>
                          <Link
                            href="/dashboard/admin/movies"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition border-b border-white/10"
                          >
                            <Settings className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        </>
                      )}

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition border-b border-white/10"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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

            <motion.button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 md:hidden"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
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
              <div className="space-y-4 border border-white/20 bg-white/10 px-4 py-5 backdrop-blur-xl">
                <div className="grid gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      scroll={item.label === "Search" ? false : true}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white/20"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="grid gap-2 rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-xl">
                  {quickLinks.slice(0, 5).map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md transition hover:bg-white/20"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="grid gap-3">
                  {isAuthenticated && user ? (
                    <>
                      <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                        <p className="text-sm font-semibold text-white">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username || user.email.split("@")[0]}
                        </p>
                        <p className="text-xs text-white/60">{user.email}</p>
                        <p className="text-xs text-[#e50914] font-semibold mt-2 uppercase tracking-wider">
                          {user.role}
                        </p>
                      </div>

                      {user.role === "ADMIN" && (
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="w-full rounded-lg"
                        >
                          <Link
                            href="/dashboard/admin/movies"
                            onClick={() => setMobileOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        </Button>
                      )}

                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full rounded-lg"
                      >
                        <Link
                          href="/dashboard/user/profile"
                          onClick={() => setMobileOpen(false)}
                        >
                          My Profile
                        </Link>
                      </Button>

                      <Button
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        variant="outline"
                        size="lg"
                        className="w-full rounded-lg text-red-400 border-red-400/20 hover:bg-red-400/10"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
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
    </>
  );
}
