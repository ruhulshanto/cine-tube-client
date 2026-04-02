import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DashboardShell } from "@/components/shared/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0b] text-foreground">
      <Navbar />
      <div className="flex flex-1 flex-col pt-24">
        <DashboardShell>{children}</DashboardShell>
      </div>
      <Footer />
    </div>
  );
}
