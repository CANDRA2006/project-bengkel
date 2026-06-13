import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "danger" | "amber" | "premium";

const variants: Record<Variant, string> = {
  default: "bg-zinc-800 text-zinc-300 border border-zinc-700",
  success: "bg-emerald-950 text-emerald-400 border border-emerald-800",
  warning: "bg-amber-950 text-amber-400 border border-amber-800",
  danger: "bg-red-950 text-red-400 border border-red-800",
  amber: "bg-amber-500 text-black",
  premium: "bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
