import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder, updateOrderStatus } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Loader2, CreditCard, Smartphone, Building2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PaymentMethod = {
  id: string;
  name: string;
  type: "ewallet" | "banking";
  logo: string;
  number: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "dana", name: "DANA", type: "ewallet", logo: "💙", number: "0812-3456-7890" },
  { id: "ovo", name: "OVO", type: "ewallet", logo: "💜", number: "0812-3456-7890" },
  { id: "gopay", name: "GoPay", type: "ewallet", logo: "💚", number: "0812-3456-7890" },
  { id: "shopeepay", name: "ShopeePay", type: "ewallet", logo: "🧡", number: "0812-3456-7890" },
  { id: "bca", name: "BCA Mobile", type: "banking", logo: "🏦", number: "1234-5678-9012" },
  { id: "bri", name: "BRImo", type: "banking", logo: "🏦", number: "0056-0100-1234-5678" },
  { id: "bni", name: "BNI Mobile", type: "banking", logo: "🏦", number: "0000-1234-5678-9012" },
  { id: "mandiri", name: "Livin' Mandiri", type: "banking", logo: "🏦", number: "1380-1234-5678-9012" },
];

function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

type Step = "method" | "confirm" | "processing" | "success";

export function CheckoutPage() {
  const { t } = useTranslation();
  const { user, cart, cartTotal, clearCart } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("method");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [notes, setNotes] = useState("");
  const [orderId, setOrderId] = useState("");

  const ewallets = PAYMENT_METHODS.filter((m) => m.type === "ewallet");
  const banks = PAYMENT_METHODS.filter((m) => m.type === "banking");

  const handleConfirmPayment = async () => {
    if (!user || !selectedMethod || cart.length === 0) return;
    setStep("processing");

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));

    const order = createOrder({
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      items: cart,
      paymentMethod: selectedMethod.name,
      notes,
    });

    updateOrderStatus(order.id, "paid");
    setOrderId(order.id);
    clearCart();
    setStep("success");
    toast.success("Pembayaran berhasil!");
  };

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-zinc-950 text-white antialiased">
        <Navbar />
        <main className="pt-[68px] min-h-[calc(100vh-68px)] flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">Keranjang kosong</p>
            <button onClick={() => navigate("/catalog")} className="px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold">Lihat Katalog</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <main className="pt-[68px] min-h-[calc(100vh-68px)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Success State */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-6 animate-zoom-in-95">
                <CheckCircle2 size={44} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{t("payment.paymentSuccess")}</h2>
              <p className="text-zinc-400 mb-2">ID Pesanan: <span className="text-amber-400 font-mono font-semibold">{orderId}</span></p>
              <p className="text-zinc-500 text-sm mb-8">Pesanan Anda sedang diproses. Cek status di halaman pesanan.</p>
              <div className="flex gap-3 flex-wrap justify-center">
                <button onClick={() => navigate("/orders")} className="px-6 py-3 rounded-xl font-semibold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 text-sm">Lihat Pesanan</button>
                <button onClick={() => navigate("/catalog")} className="px-6 py-3 rounded-xl font-semibold text-zinc-300 bg-zinc-800 border border-zinc-700 text-sm">Lanjut Belanja</button>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-6">
                <Loader2 size={36} className="text-amber-400 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{t("payment.processing")}</h2>
              <p className="text-zinc-400 text-sm">Mohon tunggu, jangan tutup halaman ini</p>
            </div>
          )}

          {/* Method Selection */}
          {step === "method" && (
            <div>
              <button onClick={() => navigate("/cart")} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors">
                <ArrowLeft size={14} /> Kembali ke Keranjang
              </button>
              <h1 className="text-2xl font-bold text-white mb-8">{t("payment.title")}</h1>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  {/* E-Wallet */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2"><Smartphone size={14} /> {t("payment.ewallet")}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {ewallets.map((m) => (
                        <button key={m.id} onClick={() => setSelectedMethod(m)}
                          className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                            selectedMethod?.id === m.id
                              ? "border-amber-500/50 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                              : "border-white/[0.06] bg-zinc-900/60 hover:border-white/[0.12] hover:bg-zinc-900"
                          )}>
                          <span className="text-2xl">{m.logo}</span>
                          <span className="text-sm font-semibold text-white">{m.name}</span>
                          {selectedMethod?.id === m.id && <span className="ml-auto w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center"><CheckCircle2 size={11} className="text-black" /></span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Banking */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2"><Building2 size={14} /> {t("payment.banking")}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {banks.map((m) => (
                        <button key={m.id} onClick={() => setSelectedMethod(m)}
                          className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                            selectedMethod?.id === m.id
                              ? "border-amber-500/50 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                              : "border-white/[0.06] bg-zinc-900/60 hover:border-white/[0.12] hover:bg-zinc-900"
                          )}>
                          <span className="text-xl">{m.logo}</span>
                          <span className="text-sm font-semibold text-white">{m.name}</span>
                          {selectedMethod?.id === m.id && <span className="ml-auto w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center"><CheckCircle2 size={11} className="text-black" /></span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Catatan (opsional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                      className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 resize-none"
                      placeholder="Catatan untuk pesanan..." />
                  </div>

                  <button onClick={() => selectedMethod && setStep("confirm")} disabled={!selectedMethod}
                    className="w-full py-3.5 rounded-xl font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm shadow-[0_4px_16px_rgba(245,158,11,0.3)]">
                    Lanjut ke Konfirmasi
                  </button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-2">
                  <div className="sticky top-24 p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.06]">
                    <h3 className="text-sm font-bold text-white mb-4">{t("payment.orderSummary")}</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-300 truncate">{item.name}</p>
                            <p className="text-xs text-zinc-500">×{item.qty}</p>
                          </div>
                          <span className="text-xs text-zinc-300 flex-shrink-0">{formatRp(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/[0.06] mt-4 pt-4 flex justify-between items-center">
                      <span className="text-sm font-bold text-white">{t("cart.total")}</span>
                      <span className="text-amber-400 font-bold">{formatRp(cartTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Step */}
          {step === "confirm" && selectedMethod && (
            <div>
              <button onClick={() => setStep("method")} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors">
                <ArrowLeft size={14} /> Ganti Metode
              </button>
              <h1 className="text-2xl font-bold text-white mb-8">{t("payment.confirmPay")}</h1>
              <div className="max-w-lg mx-auto">
                {/* QR / Transfer info mockup */}
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.06] mb-6 text-center">
                  <div className="text-4xl mb-3">{selectedMethod.logo}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{selectedMethod.name}</h3>
                  {selectedMethod.type === "ewallet" ? (
                    <>
                      <p className="text-sm text-zinc-400 mb-4">{t("payment.scanQr")}</p>
                      {/* QR Code mockup */}
                      <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center mb-4">
                        <div className="w-32 h-32 grid grid-cols-8 gap-0.5 opacity-80">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? "bg-zinc-900" : "bg-white"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-zinc-500">{t("payment.transferTo")}: <span className="text-white font-mono">{selectedMethod.number}</span></p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-zinc-400 mb-2">{t("payment.transferTo")}:</p>
                      <p className="text-xl font-mono font-bold text-amber-400 mb-1">{selectedMethod.number}</p>
                      <p className="text-sm text-zinc-500">a.n. Bengkel Harun</p>
                    </>
                  )}
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-400">Total Transfer</span>
                      <span className="text-lg font-bold text-amber-400">{formatRp(cartTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6">
                  <p className="text-xs text-amber-400/80">⚠️ <strong>Simulasi Payment</strong> — Ini adalah prototype. Tidak ada transaksi nyata yang terjadi.</p>
                </div>

                <button onClick={handleConfirmPayment} className="w-full py-4 rounded-xl font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 text-sm shadow-[0_6px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_8px_28px_rgba(245,158,11,0.45)] hover:-translate-y-0.5 transition-all">
                  {t("payment.confirmPay")} — {formatRp(cartTotal)}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
