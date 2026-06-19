import { useEffect, useRef, useState } from "react";
import { Crown, Check, Star, Zap, Shield, Gift, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const TIERS = [
  {
    id: "basic",
    name: "Basic",
    icon: Shield,
    tagline: "Untuk pemilik kendaraan",
    monthly: 0,
    annual: 0,
    free: true,
    color: "#71717a",
    gradient: "from-zinc-800/60 to-zinc-900/40",
    border: "border-white/[0.08]",
    features: [
      "Booking servis online",
      "Riwayat perawatan kendaraan",
      "Notifikasi jadwal servis",
      "Akses katalog produk",
      "Dukungan via WhatsApp",
    ],
    limited: ["Antrean prioritas tidak tersedia", "Tanpa diskon tambahan"],
    cta: "Daftar Gratis",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    tagline: "Pengalaman servis terbaik",
    monthly: 89000,
    annual: 799000,
    free: false,
    color: "#f59e0b",
    gradient: "from-amber-500/10 to-orange-500/5",
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
  {
    id: "fleet",
    name: "Fleet",
    icon: Sparkles,
    tagline: "Untuk armada bisnis",
    monthly: 299000,
    annual: 2690000,
    free: false,
    color: "#a855f7",
    gradient: "from-purple-500/8 to-violet-500/5",
    border: "border-purple-500/20",
    features: [
      "Semua fitur Premium",
      "Manajemen hingga 10 kendaraan",
      "Diskon 25% semua layanan",
      "Laporan armada terintegrasi",
      "Account manager dedicated",
      "Faktur & laporan pajak digital",
      "SLA 24 jam respons",
      "API integrasi fleet management",
    ],
    cta: "Hubungi Sales",
    popular: false,
  },
];

const PERKS = [
  { icon: "Target", title: "Antrean Prioritas", desc: "Langsung dilayani tanpa tunggu" },
  { icon: "Car", title: "Pick-up & Antar", desc: "Gratis radius 5 km dari bengkel" },
  { icon: "MessageSquare", title: "Konsultasi 24/7", desc: "Chat langsung dengan mekanik" },
  { icon: "BarChart3", title: "Laporan Bulanan", desc: "Histori & kondisi kendaraan detail" },
  { icon: "Gift", title: "Reward Poin 2×", desc: "Tukar poin untuk servis gratis" },
  { icon: "Tag", title: "Diskon Eksklusif", desc: "Hingga 25% untuk semua layanan" },
];

export function Membership() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);
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
    if (tierId === "fleet") {
      const el = document.querySelector("#contact");
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
      return;
    }
    if (tierId === "premium") {
      navigate("/membership");
    }
  };

  const annualSavingsPremium = TIERS[1].monthly * 12 - TIERS[1].annual;

  return (
    <section id="membership" className="py-24 md:py-32 bg-[#090909] relative overflow-hidden">
      {/* BG */}
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

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full bg-[#111113] border border-white/[0.07]">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                !annual ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Bulanan
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                annual ? "bg-amber-500 text-[#0a0a0a] font-bold" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Tahunan
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all",
                annual ? "bg-[#0a0a0a]/20 text-[#0a0a0a]" : "bg-green-500/20 text-green-400"
              )}>
                -25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const price = annual && !tier.free ? tier.annual : tier.monthly;
            const isCurrentPlan = user?.membershipTier === tier.id;

            return (
              <div
                key={tier.id}
                className={cn(
                  "relative flex flex-col rounded-2xl p-6 border transition-all duration-500",
                  tier.border,
                  tier.popular ? "md:scale-[1.03] md:-mt-2 md:-mb-2" : "",
                  headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{
                  background: `linear-gradient(135deg, ${tier.gradient.replace("from-", "").replace("to-", "")})`,
                  background: `linear-gradient(160deg, rgba(20,20,22,0.8) 0%, rgba(15,15,17,0.95) 100%)`,
                  transitionDelay: `${i * 120}ms`,
                  boxShadow: tier.glow ?? undefined,
                }}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-[#0a0a0a] text-[11px] font-black shadow-[0_4px_16px_rgba(245,158,11,0.4)] whitespace-nowrap">
                    <Star size={9} fill="currentColor" /> PALING POPULER
                  </div>
                )}

                {/* Icon + Name */}
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
                    <div>
                      <div className="flex items-end gap-1.5">
                        <span className="font-display text-[32px] font-black text-white">
                          Rp {price.toLocaleString("id")}
                        </span>
                        <span className="text-zinc-500 text-sm mb-1.5">/{annual ? "tahun" : "bln"}</span>
                      </div>
                      {annual && !tier.free && (
                        <p className="text-[12px] text-green-400 font-medium mt-0.5">
                          Hemat Rp {(tier.monthly * 12 - tier.annual).toLocaleString("id")}/tahun
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.06] mb-5" />

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px]">
                      <Check
                        size={14}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: tier.color }}
                      />
                      <span className="text-zinc-300">{f}</span>
                    </li>
                  ))}
                  {tier.limited?.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[12.5px] opacity-40">
                      <span className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 flex items-center justify-center text-zinc-600">—</span>
                      <span className="text-zinc-500 line-through">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleCTA(tier.id)}
                  disabled={isCurrentPlan && tier.id !== "fleet"}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2",
                    isCurrentPlan && tier.id !== "fleet"
                      ? "bg-zinc-800 text-zinc-500 cursor-default"
                      : tier.popular
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#0a0a0a] hover:from-amber-300 hover:to-orange-400 shadow-[0_6px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_28px_rgba(245,158,11,0.4)] hover:-translate-y-px"
                      : "bg-white/[0.06] text-zinc-200 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white"
                  )}
                >
                  {isCurrentPlan && tier.id !== "fleet" ? "Plan Aktif" : tier.cta}
                  {!isCurrentPlan && <ChevronRight size={14} />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Perks grid */}
        <div className={cn(
          "transition-all duration-700 delay-300",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-center text-sm text-zinc-600 font-medium uppercase tracking-widest mb-8">
            Keuntungan Member Premium
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {PERKS.map((perk) => (
              <div
                key={perk.title}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#0f0f11] border border-white/[0.06] hover:border-amber-500/20 transition-all duration-200 hover:bg-amber-500/[0.03]"
              >
                <span className="text-2xl mb-2.5 text-amber-400" aria-hidden="true">●</span>
                <p className="text-[12.5px] font-semibold text-zinc-200 mb-1">{perk.title}</p>
                <p className="text-[11px] text-zinc-600 leading-snug">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}