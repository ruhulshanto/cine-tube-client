"use client";

import { Footer } from "@/components/shared/Footer";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { Navbar } from "@/components/shared/Navbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isUserPage = !pathname.startsWith("/dashboard/admin");

  if (isUserPage) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0b0b0b] text-foreground pt-16">
        <Navbar />
        <div className="flex flex-1 flex-col min-h-0">
          <DashboardShell>{children}</DashboardShell>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0b] text-foreground pt-16">
      <Navbar />
      <div className="flex flex-1 min-h-0 flex-col">
        <DashboardShell>{children}</DashboardShell>
      </div>
      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
}
