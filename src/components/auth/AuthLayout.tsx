import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { Logo } from "@/components/Logo";

export function AuthLayout({ title, subtitle, children, footer }: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-md">
          <Logo showText className="mb-6" />
          <h2 className="text-3xl font-display font-bold">Bengkel mobil <span className="text-gradient-brand">terpercaya</span> di Pekalongan.</h2>
          <p className="mt-3 text-muted-foreground">
            Akses cepat untuk booking servis, riwayat, dan layanan member premium.
          </p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-6 lg:p-12"
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo showText /></div>
          <h1 className="text-3xl font-display font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-center text-muted-foreground">{footer}</div>}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Kembali ke beranda</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
