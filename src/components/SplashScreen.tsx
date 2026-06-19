import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onDone?: () => void;
}

export function SplashScreen({ onDone }: Props) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2000);
    const t2 = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-zinc-950 transition-opacity duration-600",
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/[0.06] blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-5 animate-fade-in-blur">
        {/* Logo Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.4)] animate-pulse-subtle">
          <Wrench size={36} className="text-[#0a0a0a]" strokeWidth={2.5} />
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-[-0.03em] text-white">
            Bengkel{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Harun
            </span>
          </h1>
          <p className="mt-2 text-xs tracking-[0.35em] text-zinc-500 uppercase font-medium">
            Drive · Perform · Trust
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-40 h-[2px] bg-zinc-800 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-[loading_2s_ease-in-out_forwards]" />
        </div>
      </div>

      <style>{`
        @keyframes loading {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
