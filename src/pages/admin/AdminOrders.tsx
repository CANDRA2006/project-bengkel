import { useEffect, useState } from "react";
import { readOrders, updateOrderStatus, type Order, type OrderStatus } from "@/lib/auth";
import { AdminLayout } from "./AdminLayout";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
function formatDate(ts: number) { return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending:    { label: "Pending",   color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  paid:       { label: "Dibayar",   color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  processing: { label: "Diproses",  color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  completed:  { label: "Selesai",   color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  cancelled:  { label: "Dibatalkan",color: "text-red-400 bg-red-500/10 border-red-500/20" },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "paid",
  paid: "processing",
  processing: "completed",
};

function SkeletonRow() {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/[0.05] animate-pulse">
      <div className="flex justify-between mb-3"><div className="h-4 bg-zinc-800 rounded w-40" /><div className="h-4 bg-zinc-800 rounded w-20" /></div>
      <div className="h-3 bg-zinc-800 rounded w-56 mb-2" />
      <div className="flex gap-2"><div className="w-10 h-10 bg-zinc-800 rounded-lg" /><div className="w-10 h-10 bg-zinc-800 rounded-lg" /></div>
    </div>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  const reload = () => {
    setOrders(readOrders().sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    const t = setTimeout(() => { reload(); setLoading(false); }, 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const h = () => reload();
    window.addEventListener("bh-auth-changed", h);
    return () => window.removeEventListener("bh-auth-changed", h);
  }, []);

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    try {
      updateOrderStatus(orderId, status);
      toast.success(`Status pesanan diubah ke "${STATUS_CONFIG[status].label}"`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.userName.toLowerCase().includes(search.toLowerCase()) || o.userEmail.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const ALL_STATUSES: OrderStatus[] = ["pending", "paid", "processing", "completed", "cancelled"];

  return (
    <AdminLayout title="Kelola Pesanan" subtitle="Kelola dan update status semua pesanan">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text" placeholder="Cari ID / nama / email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/40 w-64"
          />
        </div>
        <select
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-zinc-900 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/40 cursor-pointer"
        >
          <option value="all">Semua Status</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 text-sm rounded-2xl bg-zinc-900/40 border border-white/[0.05]">
          Tidak ada pesanan ditemukan
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const nextStatus = NEXT_STATUS[order.status];
            return (
              <div key={order.id} className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.06] hover:border-white/[0.1] transition-all">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-mono text-sm text-zinc-300">{order.id}</p>
                    <p className="text-xs text-zinc-500">{order.userName} · {order.userEmail}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-zinc-500">{formatDate(order.createdAt)}</span>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", cfg.color)}>{cfg.label}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex-shrink-0 flex items-center gap-2 px-2 py-1.5 rounded-lg bg-zinc-800/60">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-700 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-300 whitespace-nowrap max-w-[100px] truncate">{item.name}</p>
                        <p className="text-xs text-zinc-500">×{item.qty} · {formatRp(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-white/[0.05]">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-amber-400">{formatRp(order.total)}</span>
                    {order.paymentMethod && <span className="text-xs text-zinc-500">via {order.paymentMethod}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {nextStatus && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, nextStatus)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 transition-colors"
                      >
                        → {STATUS_CONFIG[nextStatus].label}
                      </button>
                    )}
                    {order.status !== "cancelled" && order.status !== "completed" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "cancelled")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                      >
                        Batalkan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-xs text-zinc-600 text-right">{filtered.length} dari {orders.length} pesanan</div>
    </AdminLayout>
  );
}
