import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { LogOut, User as UserIcon, Calendar, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Profil — Bengkel Harun" }, { name: "description", content: "Profil akun Bengkel Harun." }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth/login" });
  }, [ready, user, navigate]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="card-premium rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="grid place-items-center size-20 rounded-full bg-gradient-to-br from-brand to-accent text-brand-foreground text-3xl font-display font-bold">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold">{user.fullName}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <p className="text-muted-foreground text-sm">+{user.whatsapp}</p>
          </div>
          <Button onClick={() => { logout(); navigate({ to: "/" }); }} variant="outline" className="border-brand/50 text-brand hover:bg-brand/10">
            <LogOut /> Logout
          </Button>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { icon: UserIcon, title: "Profil Saya", desc: "Kelola informasi pribadi", to: "/profile" },
            { icon: Calendar, title: "Riwayat Booking", desc: "Lihat servis sebelumnya", to: "/profile" },
            { icon: HelpCircle, title: "FAQ & Bantuan", desc: "Pertanyaan umum", to: "/kontak" },
          ].map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link to={m.to} className="card-premium rounded-2xl p-6 block hover:border-brand/40 transition-colors">
                <div className="grid place-items-center size-10 rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground mb-3">
                  <m.icon className="size-5" />
                </div>
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 card-premium rounded-3xl p-8">
          <h2 className="text-xl font-display font-bold">Riwayat Booking</h2>
          <div className="mt-6 text-center py-12 text-muted-foreground">
            <Calendar className="size-12 mx-auto mb-3 opacity-40" />
            <p>Belum ada riwayat booking.</p>
            <Button asChild className="mt-4 bg-gradient-to-r from-brand to-accent text-brand-foreground">
              <Link to="/layanan">Booking Sekarang</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
