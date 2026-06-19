import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Users, ShoppingBag, Crown, TrendingUp, Clock, CheckCircle2, AlertCircle, LayoutDashboard } from "lucide-react";
import { getAllUsers, readOrders, readMembershipRequests } from "@/lib/auth";
import { Link } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";

function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0, totalOrders: 0, pendingOrders: 0,
    completedOrders: 0, revenue: 0, pendingMembership: 0,
  });

  const [recentOrders, setRecentOrders] = useState<ReturnType<typeof readOrders>>([]);

  useEffect(() => {
    const users = getAllUsers();
    const orders = readOrders();
    const membershipReqs = readMembershipRequests();

    setStats({
      totalUsers: users.filter((u) => u.role !== "admin").length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      completedOrders: orders.filter((o) => o.status === "completed").length,
      revenue: orders.filter((o) => !["cancelled", "pending"].includes(o.status)).reduce((s, o) => s + o.total, 0),
      pendingMembership: membershipReqs.filter((r) => r.status === "pending").length,
    });
    setRecentOrders(orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5));
  }, []);

  const STAT_CARDS = [
    { label: "Total User", value: stats.totalUsers, icon: Users, color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-400", border: "border-blue-500/20" },
    { label: "Total Pesanan", value: stats.totalOrders, icon: ShoppingBag, color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-400", border: "border-amber-500/20" },
    { label: "Pending Bayar", value: stats.pendingOrders, icon: Clock, color: "from-yellow-500/20 to-yellow-600/10", iconColor: "text-yellow-400", border: "border-yellow-500/20" },
    { label: "Pesanan Selesai", value: stats.completedOrders, icon: CheckCircle2, color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "Total Pendapatan", value: formatRp(stats.revenue), icon: TrendingUp, color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-400", border: "border-purple-500/20" },
    { label: "Membership Pending", value: stats.pendingMembership, icon: Crown, color: "from-amber-500/20 to-orange-500/10", iconColor: "text-amber-400", border: "border-amber-500/20", alert: stats.pendingMembership > 0 },
  ];

  const STATUS_COLOR: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-500/10",
    paid: "text-blue-400 bg-blue-500/10",
    processing: "text-purple-400 bg-purple-500/10",
    completed: "text-emerald-400 bg-emerald-500/10",
    cancelled: "text-red-400 bg-red-500/10",
  };
  const STATUS_LABEL: Record<string, string> = {
    pending: "Pending", paid: "Dibayar", processing: "Diproses", completed: "Selesai", cancelled: "Batal",
  };

  return (
    <AdminLayout title="Dashboard" subtitle="Ringkasan aktivitas bengkel">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className={`relative p-5 rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} overflow-hidden`}>
            {card.alert && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            )}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center`}>
                <card.icon size={18} className={card.iconColor} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{card.value}</p>
            <p className="text-sm text-zinc-400 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {[
          { to: "/admin/users", label: "Kelola User", icon: Users, desc: "Lihat & kelola semua user" },
          { to: "/admin/orders", label: "Kelola Pesanan", icon: ShoppingBag, desc: "Update status pesanan" },
          { to: "/admin/membership", label: "Approval Membership", icon: Crown, desc: "Approve/reject membership", alert: stats.pendingMembership > 0 },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="relative flex items-center gap-3 p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] hover:border-amber-500/20 hover:bg-amber-500/[0.03] transition-all group">
            {item.alert && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <item.icon size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="text-xs text-zinc-500">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
          <h3 className="text-sm font-bold text-white">Pesanan Terbaru</h3>
          <Link to="/admin/orders" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Lihat Semua →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">Belum ada pesanan</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-sm font-mono text-zinc-300">{order.id}</p>
                  <p className="text-xs text-zinc-500">{order.userName} · {new Date(order.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-amber-400">{formatRp(order.total)}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status]}`}>{STATUS_LABEL[order.status]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
