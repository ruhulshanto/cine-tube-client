import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-0 bg-background/95 supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-7xl">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-primary" />
          <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
            Built by <span className="font-semibold text-foreground">Cine-Tube</span> &copy; {new Date().getFullYear()}. Source code is available on GitHub.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm font-medium text-muted-foreground hover:text-foreground">Terms</Link>
          <Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
