import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export function CartPage() {
  const { t } = useTranslation();
  const { cart, removeFromCart, updateQty, cartTotal } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <main className="pt-[68px] min-h-[calc(100vh-68px)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-white mb-8">{t("cart.title")}</h1>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-zinc-600" />
              </div>
              <p className="text-zinc-400 text-lg font-medium mb-2">{t("cart.empty")}</p>
              <p className="text-zinc-600 text-sm mb-8">Tambahkan produk dari katalog kami</p>
              <Link to="/catalog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 text-sm">
                {t("cart.continueShop")} <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-3">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] hover:border-white/[0.1] transition-all">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-amber-400 font-medium mb-0.5">{item.category}</p>
                      <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                      <p className="text-amber-400 font-bold mt-1">{formatRp(item.price)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-2">
                      <button onClick={() => removeFromCart(item.productId)} className="text-zinc-600 hover:text-red-400 transition-colors">
                        <Trash2 size={15} />
                      </button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.productId, item.qty - 1)} className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                        <button onClick={() => updateQty(item.productId, item.qty + 1)} className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.06]">
                  <h2 className="text-base font-bold text-white mb-4">{t("cart.subtotal")}</h2>
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-zinc-400 truncate mr-2">{item.name} ×{item.qty}</span>
                        <span className="text-zinc-300 flex-shrink-0">{formatRp(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/[0.06] pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">{t("cart.total")}</span>
                      <span className="text-amber-400 font-bold text-lg">{formatRp(cartTotal)}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate("/checkout")} className="w-full py-3.5 rounded-xl font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all shadow-[0_4px_16px_rgba(245,158,11,0.3)] text-sm flex items-center justify-center gap-2">
                    {t("cart.checkout")} <ArrowRight size={16} />
                  </button>
                  <Link to="/catalog" className="block text-center text-sm text-zinc-500 hover:text-zinc-300 mt-3 transition-colors">{t("cart.continueShop")}</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
