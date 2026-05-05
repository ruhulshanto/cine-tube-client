"use client";

import { Footer } from "@/components/shared/Footer"
import { Navbar } from "@/components/shared/Navbar";

export default function CommonLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
     <main className="flex-1 text-foreground bg-background">{children}</main>

      {/* Modal renders on top */}
      {modal}

      <Footer />
    </div>
  );
}
  