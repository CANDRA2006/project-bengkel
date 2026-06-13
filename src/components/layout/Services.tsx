import { useState } from "react";
import {
  Droplets, Wind, Settings, RotateCw, Octagon, Sparkles, Zap, Wrench,
  Clock, ChevronRight, Phone
} from "lucide-react";
import { services, membershipTiers, formatIDR } from "@/lib/data/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { waBooking } from "@/lib/whatsapp";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/lib/auth";
import { upgradeMembership } from "@/lib/auth";

const iconMap: Record<string, React.ReactNode> = {
  droplets: <Droplets size={20} />,
  wind: <Wind size={20} />,
  settings: <Settings size={20} />,
  "rotate-cw": <RotateCw size={20} />,
  octagon: <Octagon size={20} />,
  sparkles: <Sparkles size={20} />,
  zap: <Zap size={20} />,
  wrench: <Wrench size={20} />,
};

function ServiceCard({ svc, isPremium }: { svc: typeof services[0]; isPremium: boolean }) {
  const price = isPremium ? Math.floor(svc.price * 0.9) : svc.price;
  return (
    <div className="group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/40 hover:bg-zinc-900/80 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
          {iconMap[svc.icon]}
        </div>
        {svc.price > 0 && isPremium && (
          <Badge variant="amber" className="text-[10px]">-10%</Badge>
        )}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{svc.name}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed mb-4">{svc.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <div>
          {svc.price > 0 ? (
            <div>
              <p className="text-base font-bold text-amber-400">
                {formatIDR(price)}
              </p>
              {isPremium && svc.price !== price && (
                <p className="text-xs text-zinc-600 line-through">{formatIDR(svc.price)}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">Konsultasi dulu</p>
          )}
          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
            <Clock size={11} />
            <span>{svc.duration}</span>
          </div>
        </div>
        <a
          href={waBooking(svc.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          <Phone size={12} />
          Booking
        </a>
      </div>
    </div>
  );
}

function MembershipCard({ tier, user, onUpgrade }: { tier: typeof membershipTiers[0]; user: User | null; onUpgrade: () => void }) {
  const isCurrent = user?.membershipTier === tier.id;
  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 ${
        tier.highlight
          ? "bg-gradient-to-b from-zinc-900 to-zinc-900 border-2 border-amber-500 shadow-2xl shadow-amber-500/10"
          : "bg-zinc-900/60 border border-zinc-800"
      }`}
    >
      {tier.highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg">
            Paling Populer
          </span>
        </div>
      )}

      <div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4 shadow-lg`}>
          <Zap size={22} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">{tier.name}</h3>
        <div className="mt-2">
          {tier.pricePerYear === 0 ? (
            <p className="text-3xl font-black text-white">Gratis</p>
          ) : (
            <div>
              <p className="text-3xl font-black text-amber-400">
                {formatIDR(tier.pricePerYear)}
                <span className="text-base font-normal text-zinc-400"> /tahun</span>
              </p>
              <p className="text-sm text-zinc-500 mt-1">atau {formatIDR(tier.pricePerMonth)}/bulan</p>
              <p className="text-xs text-emerald-400 mt-1.5">
                Hemat {formatIDR(tier.pricePerMonth * 12 - tier.pricePerYear)} vs bulanan
              </p>
            </div>
          )}
        </div>
      </div>

      <ul className="space-y-3 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <ChevronRight size={15} className={`mt-0.5 shrink-0 ${tier.highlight ? "text-amber-400" : "text-zinc-500"}`} />
            <span className="text-zinc-300">{f}</span>
          </li>
        ))}
      </ul>

      {tier.id === "free" ? (
        <Button variant="secondary" size="lg" className="w-full" disabled>
          {isCurrent ? "Paket Aktif" : "Mulai Gratis"}
        </Button>
      ) : isCurrent ? (
        <Button size="lg" className="w-full" disabled>
          Member Aktif
        </Button>
      ) : (
        <Button size="lg" className="w-full" onClick={onUpgrade}>
          {user ? "Upgrade Sekarang" : "Daftar & Upgrade"}
        </Button>
      )}
    </div>
  );
}

export function Services() {
  const { user } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      document.querySelector<HTMLButtonElement>("[data-auth-trigger]")?.click();
      return;
    }
    setUpgrading(true);
    try {
      await upgradeMembership(user.id);
      alert("Selamat! Akun Anda telah diupgrade ke Premium. Konfirmasi pembayaran akan dikirim via WhatsApp.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <>
      {/* Services */}
      <section id="services" className="py-20 lg:py-28 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="amber" className="mb-4">Layanan</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Layanan <span className="text-amber-500">Lengkap</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Dari servis rutin hingga modifikasi custom — semua dikerjakan oleh teknisi berpengalaman dengan spare part berkualitas.
            </p>
            {user?.membershipTier === "premium" && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
                Harga sudah dipotong diskon 10% member
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((svc) => (
              <ServiceCard key={svc.id} svc={svc} isPremium={user?.membershipTier === "premium"} />
            ))}
          </div>
        </div>
      </section>

      {/* Membership */}
      <section id="membership" className="py-20 lg:py-28 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="premium" className="mb-4">Membership</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Bergabung Jadi <span className="text-amber-500">Member Premium</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Nikmati keuntungan eksklusif: layanan home service antar-jemput kendaraan, diskon 10% semua servis, dan merchandise MAXGIC eksklusif — cukup <strong className="text-white">Rp 599.000/tahun</strong>.
            </p>
          </div>

          {/* Merchandise highlight */}
          <div className="mb-10 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Home Service", desc: "Antar-jemput kendaraan gratis", icon: "🚗" },
              { label: "Kaos Eklusif", desc: "Gratis", icon: "👕" },
              { label: "Keychain", desc: "Gratis", icon: "🔑" },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-zinc-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {membershipTiers.map((tier) => (
              <MembershipCard
                key={tier.id}
                tier={tier}
                user={user}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>
          {upgrading && (
            <p className="text-center text-amber-400 text-sm mt-4">Memproses upgrade...</p>
          )}
        </div>
      </section>
    </>
  );
}
