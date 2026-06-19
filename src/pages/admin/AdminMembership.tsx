import { useEffect, useState } from "react";
import { readMembershipRequests, approveMembership, rejectMembership, type MembershipRequest } from "@/lib/auth";
import { AdminLayout } from "./AdminLayout";
import { Crown, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

function SkeletonCard() {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/[0.05] animate-pulse space-y-3">
      <div className="flex justify-between"><div className="h-4 bg-zinc-800 rounded w-40" /><div className="h-5 bg-zinc-800 rounded w-20" /></div>
      <div className="h-3 bg-zinc-800 rounded w-56" />
      <div className="h-3 bg-zinc-800 rounded w-32" />
      <div className="flex gap-2 mt-2"><div className="h-8 bg-zinc-800 rounded-lg w-24" /><div className="h-8 bg-zinc-800 rounded-lg w-24" /></div>
    </div>
  );
}

export function AdminMembership() {
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  const reload = () => {
    setRequests(readMembershipRequests().sort((a, b) => b.createdAt - a.createdAt));
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

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      approveMembership(id, adminNote[id]);
      toast.success("Membership disetujui! User sekarang Premium 👑");
    } catch (e: any) { toast.error(e.message); }
    finally { setProcessing(null); }
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    try {
      rejectMembership(id, adminNote[id] || "Ditolak oleh admin");
      toast.error("Membership ditolak");
    } catch (e: any) { toast.error(e.message); }
    finally { setProcessing(null); }
  };

  const filtered = filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus);

  const STATUS_CONFIG = {
    pending:  { label: "Menunggu",  icon: Clock,         color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
    approved: { label: "Disetujui", icon: CheckCircle2,  color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    rejected: { label: "Ditolak",   icon: XCircle,       color: "text-red-400 bg-red-500/10 border-red-500/20" },
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <AdminLayout title="Kelola Membership" subtitle="Approve atau tolak permintaan membership">
      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Crown size={16} className="text-amber-400" />
          <p className="text-sm text-amber-300">
            <span className="font-bold">{pendingCount} permintaan</span> membership menunggu persetujuan
          </p>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(["all", "pending", "approved", "rejected"] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              filterStatus === s ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-zinc-900 text-zinc-400 border border-white/[0.06] hover:text-zinc-200")}>
            {s === "all" ? "Semua" : STATUS_CONFIG[s].label}
            {s === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 px-1 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 text-sm rounded-2xl bg-zinc-900/40 border border-white/[0.05]">
          Tidak ada permintaan membership
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const cfg = STATUS_CONFIG[req.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={req.id} className={cn("p-5 rounded-2xl border transition-all",
                req.status === "pending" ? "bg-zinc-900/80 border-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.04)]" : "bg-zinc-900/50 border-white/[0.06]")}>
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{req.userName}</p>
                      <span className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border", cfg.color)}>
                        <StatusIcon size={10} /> {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">{req.userEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-zinc-500">{req.id}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{formatDate(req.createdAt)}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60">
                    <Crown size={12} className="text-amber-400" />
                    <span className="text-xs text-zinc-300">Paket: <span className="text-amber-400 font-semibold capitalize">{req.plan}</span></span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60">
                    <span className="text-xs text-zinc-300">Harga: <span className="text-amber-400 font-semibold">{formatRp(req.price)}</span></span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60">
                    <span className="text-xs text-zinc-300">Bayar via: <span className="text-zinc-200 font-medium">{req.paymentMethod}</span></span>
                  </div>
                </div>

                {/* Admin note */}
                {req.status === "pending" && (
                  <div className="mb-4">
                    <label className="block text-xs text-zinc-500 mb-1">Catatan Admin (opsional)</label>
                    <input
                      type="text"
                      placeholder="Catatan untuk user..."
                      value={adminNote[req.id] || ""}
                      onChange={(e) => setAdminNote((p) => ({ ...p, [req.id]: e.target.value }))}
                      className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                )}

                {/* Admin note display */}
                {req.adminNote && req.status !== "pending" && (
                  <div className="mb-3 px-3 py-2 rounded-lg bg-zinc-800/50 text-xs text-zinc-400">
                    <span className="text-zinc-500">Catatan Admin: </span>{req.adminNote}
                  </div>
                )}

                {/* Actions */}
                {req.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(req.id)}
                      disabled={processing === req.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 size={13} /> {processing === req.id ? "Memproses..." : "Setujui"}
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={processing === req.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      <XCircle size={13} /> Tolak
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
