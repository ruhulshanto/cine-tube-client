import { Footer } from "@/components/shared/Footer";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { Navbar } from "@/components/shared/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0b] text-foreground">
      <Navbar />
      <div className="flex flex-1 flex-col">
        <DashboardShell>{children}</DashboardShell>
      </div>
      <Footer />
    </div>
  );
}

