"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Clapperboard,
  CreditCard,
  Film,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Plus,
  Settings,
  CircleDollarSign,
  BarChart3,
  Sparkles,
} from "lucide-react";

function NavLink({
  href,
  children,
  icon: Icon,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (() => {
    if (pathname === href) return true;
    if (href === "/dashboard/admin") return pathname === "/dashboard/admin";
    if (href === "/dashboard/admin/movies/create")
      return pathname === "/dashboard/admin/movies/create";
    if (href === "/dashboard/admin/movies")
      return (
        pathname === "/dashboard/admin/movies" ||
        /^\/dashboard\/admin\/movies\/[^/]+\/edit$/.test(pathname)
      );
    if (href === "/dashboard/admin/reviews") return pathname.startsWith("/dashboard/admin/reviews");
    if (href === "/dashboard/admin/payments") return pathname === "/dashboard/admin/payments";
    return pathname.startsWith(href + "/");
  })();

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold tracking-tight transition-all",
        isActive
          ? "bg-gradient-to-r from-primary/25 to-primary/5 text-white shadow-[inset_0_0_0_1px_rgba(229,9,20,0.35)]"
          : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
      )}
    >
      {Icon ? (
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300"
          )}
        />
      ) : null}
      {children}
    </Link>
  );
}

/** Nav list — used in desktop sidebar and mobile drawer */
export function DashboardSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="space-y-0.5 pb-6">
      <NavLink href="/watchlist" icon={Clapperboard} onNavigate={onNavigate}>
        Watchlist
      </NavLink>
      <NavLink href="/dashboard/profile" icon={MessageSquare} onNavigate={onNavigate}>
        Profile
      </NavLink>
      <NavLink href="/dashboard/purchases" icon={CreditCard} onNavigate={onNavigate}>
        Purchase history
      </NavLink>
      <NavLink href="/dashboard/settings" icon={Settings} onNavigate={onNavigate}>
        Settings
      </NavLink>

      {isAdmin && (
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/90">
            Admin
          </p>
          <div className="space-y-0.5">
            <NavLink href="/dashboard/admin/insights" icon={BarChart3} onNavigate={onNavigate}>
              Admin insights
            </NavLink>
            <NavLink href="/dashboard/admin" icon={LayoutDashboard} onNavigate={onNavigate}>
              Command center
            </NavLink>
            <NavLink href="/dashboard/admin/home-curation" icon={Sparkles} onNavigate={onNavigate}>
              Homepage curation
            </NavLink>
            <NavLink href="/dashboard/admin/movies" icon={Film} onNavigate={onNavigate}>
              Movies
            </NavLink>
            <NavLink href="/dashboard/admin/movies/create" icon={Plus} onNavigate={onNavigate}>
              Upload movie
            </NavLink>
            <NavLink href="/dashboard/admin/reviews" icon={ListChecks} onNavigate={onNavigate}>
              Review queue
            </NavLink>
            <NavLink href="/dashboard/admin/payments" icon={CircleDollarSign} onNavigate={onNavigate}>
              Payments
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
