import { cn } from "@/lib/utils";
import logoBengkel from "@/assets/logo/logo-bengkel.png";

export function Logo({ className, showText = false }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={logoBengkel}
        alt="Bengkel Harun"
        className="h-10 w-10 object-contain drop-shadow-[0_0_12px_oklch(0.62_0.24_26/0.4)]"
      />
      {showText && (
        <span className="font-display text-lg font-bold tracking-tight">
          Bengkel <span className="text-brand">Harun</span>
        </span>
      )}
    </div>
  );
}
