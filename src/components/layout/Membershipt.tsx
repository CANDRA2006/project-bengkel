import { useEffect, useRef, useState } from "react";
import { Crown, Check, Shield, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const TIERS = [
  {
    id: "basic",
    name: "Basic",
    icon: Shield,
    tagline: "Paket yang sedang kamu pakai",
    price: 0,
    free: true,
    color: "#71717a",
    border: "border-white/[0.08]",
    features: [
      "Booking servis online",
      "Riwayat perawatan kendaraan",
      "Notifikasi jadwal servis",
      "Akses katalog produk",
      "Dukungan via WhatsApp",
    ],
    cta: "Sedang Dipakai",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    tagline: "Pengalaman servis terbaik",
    price: 599000,
    free: false,
    color: "#f59e0b",
    border: "border-amber-500/30",
    glow: "0 0 40px rgba(245,158,11,0.12)",
    features: [
      "Semua fitur Basic",
      "Diskon 15% semua layanan",
      "Antrean prioritas (skip antri)",
      "Free pick-up & antar (radius 5km)",
      "Laporan kesehatan kendaraan bulanan",
      "Konsultasi mekanik via WhatsApp",
      "Akses member-only promo",
      "Poin reward 2× lebih banyak",
    ],
    cta: "Mulai Premium",
    popular: true,
  },
];

export function Membership() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [headerVisible, setHeaderVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeaderVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCTA = (tierId: string) => {
    if (tierId === "premium") navigate("/membership");
  };

  return (
    <section id="membership" className="py-24 md:py-32 bg-[#090909] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/[0.03] blur-[120px]" />
      </div>

      <div ref={sectionRef} className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className={cn(
          "text-center max-w-2xl mx-auto mb-14 transition-all duration-700",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.15] text-amber-400 text-[11.5px] font-semibold tracking-widest uppercase mb-5">
            <Crown size={11} />
            Membership
          </div>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] font-black text-white leading-tight tracking-tight mb-4">
            Pilih Paket{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Terbaik
            </span>{" "}
            untuk Anda
          </h2>
          <p className="text-[15.5px] text-zinc-500 mb-8">
            Bergabung dan nikmati keistimewaan member — servis lebih cepat, lebih hemat, lebih nyaman.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-20">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const isCurrentPlan = tier.free
              ? !user || user.membershipStatus !== "active"
              : user?.membershipStatus === "active";

            return (
              <div
                key={tier.id}
                className={cn(
                  "relative flex flex-col rounded-2xl p-6 border transition-all duration-500",
                  tier.border,
                  tier.popular ? "md:scale-[1.03]" : "",
                  headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{
                  background: `linear-gradient(160deg, rgba(20,20,22,0.8) 0%, rgba(15,15,17,0.95) 100%)`,
                  transitionDelay: `${i * 120}ms`,
                  boxShadow: tier.glow ?? undefined,
                }}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-[#0a0a0a] text-[11px] font-black shadow-[0_4px_16px_rgba(245,158,11,0.4)] whitespace-nowrap">
                    PALING POPULER
                  </div>
                )}

                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}25` }}
                    >
                      <Icon size={18} style={{ color: tier.color }} />
                    </div>
                    <h3 className="font-display text-[18px] font-bold text-white">{tier.name}</h3>
                    <p className="text-[12.5px] text-zinc-500 mt-0.5">{tier.tagline}</p>
                  </div>

                  {isCurrentPlan && (
                    <div className="px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-[10.5px] font-bold">
                      Aktif
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mb-5">
                  {tier.free ? (
                    <div className="font-display text-[32px] font-black text-white">Gratis</div>
                  ) : (
                    <div className="flex items-end gap-1.5">
                      <span className="font-display text-[32px] font-black text-white">
                        Rp {tier.price.toLocaleString("id")}
                      </span>
                      <span className="text-zinc-500 text-sm mb-1.5">/tahun</span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/[0.06] mb-5" />

                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px]">
                      <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                      <span className="text-zinc-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCTA(tier.id)}
                  disabled={isCurrentPlan && tier.free}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2",
                    isCurrentPlan && tier.free
                      ? "bg-zinc-800 text-zinc-500 cursor-default"
                      : isCurrentPlan
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 cursor-default"
                      : tier.popular
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#0a0a0a] hover:from-amber-300 hover:to-orange-400 shadow-[0_6px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_28px_rgba(245,158,11,0.4)] hover:-translate-y-px"
                      : "bg-white/[0.06] text-zinc-200 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white"
                  )}
                >
                  {isCurrentPlan && tier.free ? "Sedang Dipakai" : isCurrentPlan ? "✓ Aktif 👑" : tier.cta}
                  {!isCurrentPlan && <ChevronRight size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}