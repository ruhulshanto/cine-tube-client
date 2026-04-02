import { LucideIcon, Sparkles } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center relative overflow-hidden glass-morphism rounded-[3rem] border-white/5 shadow-2xl">
      {/* Cinematic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-50 z-0 pointer-events-none" />
      
      {/* Icon Icon Container - Apple Glass Style */}
      <div className="relative z-10 w-24 h-24 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_16px_32px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 duration-500">
        <Icon className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
        {/* Flare Detail */}
        <div className="absolute -top-2 -right-2 p-1.5 rounded-lg bg-primary/20 backdrop-blur-md border border-primary/30">
           <Sparkles className="w-3 h-3 text-primary" />
        </div>
      </div>

      {/* Primary Content */}
      <div className="relative z-10 space-y-3 mb-10 max-w-sm">
        <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{title}</h3>
        <p className="text-zinc-500 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {/* Conditional Action Section */}
      {action && <div className="relative z-10 animate-in zoom-in-95 duration-500 delay-300">{action}</div>}
    </div>
  );
}
