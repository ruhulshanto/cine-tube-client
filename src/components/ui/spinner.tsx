import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-[#e50914]", sizeClasses[size], className)}
      {...props}
    />
  );
}

interface FullScreenLoaderProps {
  label?: string;
  className?: string;
}

export function FullScreenLoader({ label = "Loading...", className }: FullScreenLoaderProps) {
  return (
    <div className={cn("flex min-h-[60vh] w-full flex-col items-center justify-center gap-4", className)}>
      <Spinner size="lg" />
      {label && <p className="text-sm font-semibold tracking-widest text-zinc-400 uppercase animate-pulse">{label}</p>}
    </div>
  );
}
