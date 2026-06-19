import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Crown, User, Mail, Phone, Shield, Calendar, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { getUserOrders } from "@/lib/auth";

function formatDate(ts?: number | string) {
  if (!ts) return "-";
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  const orders = getUserOrders(user.id);
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalSpent = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  const STATS = [
    { label: "Total Pesanan", value: orders.length },
    { label: "Selesai", value: completedOrders },
    { label: "Total Belanja", value: "Rp " + totalSpent.toLocaleString("id-ID") },
  ];

  const membershipBadge = user.membershipStatus === "active"
    ? { text: "Premium Member 👑", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" }
    : user.membershipStatus === "pending"
    ? { text: "⏳ Menunggu Approval", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" }
    : { text: "Basic Member", color: "text-zinc-400 bg-zinc-800 border-zinc-700" };

  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <main className="pt-[68px] min-h-[calc(100vh-68px)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-white mb-8">Profil Saya</h1>

          {/* Profile Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/[0.07] mb-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl font-black text-[#0a0a0a] flex-shrink-0 shadow-[0_8px_24px_rgba(245,158,11,0.3)]">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-white">
                    {user.fullName}
                    {user.membershipStatus === "active" && <span className="ml-1">👑</span>}
                  </h2>
                </div>
                <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${membershipBadge.color}`}>{membershipBadge.text}</span>
                {user.membershipExpiry && user.membershipStatus === "active" && (
                  <p className="text-xs text-zinc-500 mt-1">Berlaku hingga: {formatDate(user.membershipExpiry)}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/[0.06]">
              {STATS.map((s) => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-white/[0.02]">
                  <p className="text-base font-bold text-amber-400">{s.value}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: User,     label: "Nama Lengkap", value: user.fullName },
              { icon: Mail,     label: "Email",         value: user.email },
              { icon: Phone,    label: "WhatsApp",      value: user.whatsapp || "-" },
              { icon: Calendar, label: "Bergabung",     value: formatDate(user.createdAt) },
              { icon: Shield,   label: "Role",          value: user.role === "admin" ? "Administrator" : "Customer" },
              { icon: Crown,    label: "Membership",    value: user.membershipStatus === "active" ? "Premium Aktif" : user.membershipStatus === "pending" ? "Menunggu Approval" : "Basic" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/60 border border-white/[0.05]">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={15} className="text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500">{item.label}</p>
                  <p className="text-sm text-white font-medium truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/orders" className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] hover:border-amber-500/20 hover:bg-amber-500/[0.03] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Package size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Pesanan Saya</p>
                <p className="text-xs text-zinc-500">{orders.length} pesanan total</p>
              </div>
            </Link>
            {user.membershipStatus !== "active" && user.role !== "admin" && (
              <Link to="/membership" className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 hover:border-amber-500/30 hover:bg-amber-500/[0.08] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <Crown size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-400">Upgrade Premium</p>
                  <p className="text-xs text-zinc-500">Diskon 15% + priority</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
