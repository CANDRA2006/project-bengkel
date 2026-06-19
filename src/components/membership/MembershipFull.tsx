import { useState } from "react";
import { Crown, Check, Shield, Zap, Sparkles, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { createMembershipRequest } from "@/lib/auth";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const PAYMENT_METHODS = [
  { id: "dana", label: "DANA", emoji: "💙" },
  { id: "ovo", label: "OVO", emoji: "💜" },
  { id: "gopay", label: "GoPay", emoji: "💚" },
  { id: "shopeepay", label: "ShopeePay", emoji: "🧡" },
  { id: "bca", label: "BCA Mobile", emoji: "🏦" },
  { id: "bri", label: "BRImo", emoji: "🏦" },
  { id: "bni", label: "BNI Mobile", emoji: "🏦" },
  { id: "mandiri", label: "Livin' Mandiri", emoji: "🏦" },
];

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
    features: ["Booking servis online", "Riwayat perawatan kendaraan", "Notifikasi jadwal servis", "Akses katalog produk", "Dukungan via WhatsApp"],
    limited: ["Antrean prioritas tidak tersedia", "Tanpa diskon tambahan"],
    cta: "Paket Aktif",
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
    features: ["Semua fitur Basic", "Diskon 15% semua layanan", "Antrean prioritas (skip antri)", "Free pick-up & antar (radius 5km)", "Laporan kesehatan kendaraan bulanan", "Konsultasi mekanik via WhatsApp", "Akses member-only promo", "Poin reward 2× lebih banyak"],
    cta: "Mulai Premium",
    popular: true,
    plan: "premium" as const,
  },
  {
    id: "fleet",
    name: "Fleet",
    icon: Sparkles,
    tagline: "Untuk armada bisnis",
    monthly: 299000,
    annual: 2690000,
    free: false,
    color: "#8b5cf6",
    gradient: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-500/30",
    features: ["Semua fitur Premium", "Hingga 10 kendaraan", "Account manager dedikasi", "Invoice & laporan bulanan", "SLA garansi respon 2 jam", "Diskon 25% semua layanan", "Gratis antar-jemput tanpa batas"],
    cta: "Hubungi Sales",
    popular: false,
    plan: "fleet" as const,
  },
];

type BillingCycle = "monthly" | "annual";

export function MembershipFull() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [authModal, setAuthModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<typeof TIERS[0] | null>(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);

  const formatRp = (n: number) => "Rp " + n.toLocaleString("id-ID");

  const handleSelectTier = (tier: typeof TIERS[0]) => {
    if (tier.free) return;
    if (!user) { setAuthModal(true); return; }
    if (user.membershipStatus === "active") { toast.info("Kamu sudah memiliki membership aktif!"); return; }
    if (user.membershipStatus === "pending") { toast.info("Permintaan membership kamu sedang menunggu approval admin."); return; }
    setSelectedTier(tier);
    setPaymentModal(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedPayment || !selectedTier || !user) return;
    setLoading(true);
    try {
      const price = billing === "monthly" ? selectedTier.monthly : selectedTier.annual;
      createMembershipRequest({
        userId: user.id,
        userName: user.fullName,
        userEmail: user.email,
        plan: selectedTier.plan as "premium" | "fleet",
        price,
        paymentMethod: selectedPayment,
      });
      toast.success("Permintaan membership terkirim! Menunggu approval admin 👑");
      setPaymentModal(false);
      setSelectedTier(null);
      setSelectedPayment("");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getMembershipButton = (tier: typeof TIERS[0]) => {
    if (tier.free) return { text: "Paket Aktif", disabled: true, cls: "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-default" };
    if (!user) return { text: tier.cta, disabled: false, cls: "bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold shadow-[0_4px_16px_rgba(245,158,11,0.25)]" };
    if (user.membershipStatus === "active") return { text: "✓ Aktif 👑", disabled: true, cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 cursor-default" };
    if (user.membershipStatus === "pending") return { text: "⏳ Menunggu Approval", disabled: true, cls: "bg-blue-500/10 text-blue-400 border border-blue-500/20 cursor-default" };
    return { text: tier.cta, disabled: false, cls: tier.popular ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold shadow-[0_4px_16px_rgba(245,158,11,0.25)]" : "border border-white/[0.1] text-zinc-300 hover:bg-white/[0.05]" };
  };

  return (
    <section className="min-h-[calc(100vh-68px)] bg-zinc-950 px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Crown size={14} className="text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Membership Bengkel Harun</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t("membership.title")}
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">{t("membership.subtitle")}</p>

          {user?.membershipStatus === "active" && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
              <Crown size={16} /> Kamu sudah menjadi Premium Member! 👑
            </div>
          )}
          {user?.membershipStatus === "pending" && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              ⏳ Permintaan membership kamu sedang menunggu approval admin.
            </div>
          )}
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={cn("text-sm font-medium", billing === "monthly" ? "text-white" : "text-zinc-500")}>Bulanan</span>
          <button
            onClick={() => setBilling(billing === "monthly" ? "annual" : "monthly")}
            className={cn("relative w-12 h-6 rounded-full transition-colors duration-200", billing === "annual" ? "bg-amber-500" : "bg-zinc-700")}
          >
            <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200", billing === "annual" && "translate-x-6")} />
          </button>
          <span className={cn("text-sm font-medium", billing === "annual" ? "text-white" : "text-zinc-500")}>
            Tahunan
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">Hemat 25%</span>
          </span>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TIERS.map((tier) => {
            const price = tier.free ? 0 : billing === "monthly" ? tier.monthly : tier.annual;
            const btn = getMembershipButton(tier);
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className={cn(
                  "relative flex flex-col p-6 rounded-2xl border transition-all duration-300",
                  `bg-gradient-to-br ${tier.gradient}`,
                  tier.border,
                  tier.popular && "ring-1 ring-amber-500/30 scale-[1.02]"
                )}
                style={tier.glow ? { boxShadow: tier.glow } : undefined}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-black">
                      <Star size={9} fill="currentColor" /> Paling Populer
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${tier.color}20`, border: `1px solid ${tier.color}30` }}>
                    <Icon size={18} style={{ color: tier.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{tier.name}</h3>
                    <p className="text-xs text-zinc-500">{tier.tagline}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {tier.free ? (
                    <p className="text-3xl font-black text-white">Gratis</p>
                  ) : (
                    <>
                      <p className="text-3xl font-black text-white">{formatRp(price)}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{billing === "monthly" ? "/ bulan" : "/ tahun"}</p>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check size={13} className="mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                      {f}
                    </li>
                  ))}
                  {"limited" in tier && tier.limited?.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 line-through">
                      <span className="w-3 h-3 mt-0.5 flex-shrink-0 text-zinc-700">✗</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleSelectTier(tier)}
                  disabled={btn.disabled}
                  className={cn("w-full py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2", btn.cls)}
                >
                  {btn.text}
                  {!btn.disabled && !tier.free && <ArrowRight size={14} />}
                </button>

                {tier.id === "premium" && (
                  <p className="text-center text-xs text-amber-400/60 mt-3">👑 Mendapat ikon Crown di profil</p>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ / Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🛡️", title: "Aman & Terjamin", desc: "Membership dikelola langsung oleh admin bengkel" },
            { icon: "⚡", title: "Aktivasi Cepat", desc: "Diaktifkan dalam 1×24 jam setelah pembayaran diverifikasi" },
            { icon: "🔄", title: "Batalkan Kapan Saja", desc: "Tidak ada kontrak jangka panjang yang mengikat" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/40 border border-white/[0.05]">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModal && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setPaymentModal(false); setSelectedPayment(""); }} />
          <div className="relative w-full max-w-md bg-zinc-900 border border-white/[0.08] rounded-2xl p-6 shadow-2xl animate-zoom-in-95">
            <h3 className="text-lg font-bold text-white mb-1">Beli {selectedTier.name}</h3>
            <p className="text-sm text-zinc-400 mb-5">
              {formatRp(billing === "monthly" ? selectedTier.monthly : selectedTier.annual)} / {billing === "monthly" ? "bulan" : "tahun"} · via:
            </p>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {PAYMENT_METHODS.map((m) => (
                <button key={m.id} onClick={() => setSelectedPayment(m.label)}
                  className={cn("flex items-center gap-2 p-2.5 rounded-xl border text-sm transition-all",
                    selectedPayment === m.label
                      ? "border-amber-500/50 bg-amber-500/10 text-white"
                      : "border-white/[0.06] bg-zinc-800/60 text-zinc-400 hover:border-white/[0.12]")}>
                  <span>{m.emoji}</span>
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 mb-5">
              <p className="text-xs text-amber-400/80">⚠️ <strong>Simulasi Pembayaran</strong> — Membership akan aktif setelah admin menyetujui.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setPaymentModal(false); setSelectedPayment(""); }} className="flex-1 py-3 rounded-xl text-sm text-zinc-400 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors">Batal</button>
              <button onClick={handleSubmitPayment} disabled={!selectedPayment || loading} className="flex-1 py-3 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-orange-500 disabled:opacity-40 transition-all">
                {loading ? "Mengirim..." : "Kirim Permintaan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal open={authModal} onClose={() => setAuthModal(false)} defaultMode="login" />
    </section>
  );
}
