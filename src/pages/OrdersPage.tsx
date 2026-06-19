import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders, type Order } from "@/lib/auth";
import { Package, Clock, CheckCircle2, XCircle, Loader2, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
function formatDate(ts: number) { return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }

const STATUS_CONFIG = {
  pending:    { label: "Menunggu Bayar", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  paid:       { label: "Dibayar",        color: "text-blue-400 bg-blue-500/10 border-blue-500/20",       icon: CheckCircle2 },
  processing: { label: "Diproses",       color: "text-purple-400 bg-purple-500/10 border-purple-500/20", icon: Loader2 },
  completed:  { label: "Selesai",        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  cancelled:  { label: "Dibatalkan",     color: "text-red-400 bg-red-500/10 border-red-500/20",          icon: XCircle },
};

function SkeletonRow() {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/[0.05] animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-zinc-800 rounded w-36" />
        <div className="h-4 bg-zinc-800 rounded w-20" />
      </div>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-xl bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-zinc-800 rounded w-48" />
          <div className="h-3 bg-zinc-800 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function OrdersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Order["status"] | "all">("all");

  useEffect(() => {
    if (!user) return;
    const t2 = setTimeout(() => {
      setOrders(getUserOrders(user.id).sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    }, 400);
    return () => clearTimeout(t2);
  }, [user]);

  // Listen for auth changes (order status updates)
  useEffect(() => {
    const handler = () => {
      if (!user) return;
      setOrders(getUserOrders(user.id).sort((a, b) => b.createdAt - a.createdAt));
    };
    window.addEventListener("bh-auth-changed", handler);
    return () => window.removeEventListener("bh-auth-changed", handler);
  }, [user]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const FILTERS: { key: Order["status"] | "all"; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "pending", label: "Menunggu Bayar" },
    { key: "paid", label: "Dibayar" },
    { key: "processing", label: "Diproses" },
    { key: "completed", label: "Selesai" },
    { key: "cancelled", label: "Dibatalkan" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <main className="pt-[68px] min-h-[calc(100vh-68px)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">{t("orders.title")}</h1>
            <span className="text-sm text-zinc-500">{orders.length} pesanan</span>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {FILTERS.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={cn("flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  filter === f.key ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-zinc-900 text-zinc-400 border border-white/[0.06] hover:text-zinc-200")}>
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-zinc-600" />
              </div>
              <p className="text-zinc-400 font-medium mb-2">{t("orders.empty")}</p>
              <p className="text-zinc-600 text-sm mb-8">Mulai belanja produk dari katalog kami</p>
              <Link to="/catalog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 text-sm">
                Lihat Katalog
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status];
                const StatusIcon = cfg.icon;
                return (
                  <div key={order.id} className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.06] hover:border-white/[0.1] transition-all">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-zinc-500" />
                        <span className="font-mono text-sm text-zinc-300">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500">{formatDate(order.createdAt)}</span>
                        <span className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border", cfg.color)}>
                          <StatusIcon size={11} /> {cfg.label}
                        </span>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.productId} className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          {item.qty > 1 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[8px] font-bold text-black flex items-center justify-center">×{item.qty}</span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-medium">+{order.items.length - 4}</div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-white/[0.05]">
                      <div>
                        <p className="text-xs text-zinc-500">{order.items.length} produk · via {order.paymentMethod}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-amber-400 font-bold">{formatRp(order.total)}</span>
                      </div>
                    </div>

                    {/* Item details */}
                    <div className="mt-3 pt-3 border-t border-white/[0.04] space-y-1.5">
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex justify-between text-xs">
                          <span className="text-zinc-500 truncate mr-4">{item.name} × {item.qty}</span>
                          <span className="text-zinc-400 flex-shrink-0">{formatRp(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
