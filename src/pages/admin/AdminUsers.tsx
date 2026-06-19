import { useEffect, useState } from "react";
import { getAllUsers, type User } from "@/lib/auth";
import { AdminLayout } from "./AdminLayout";
import { Crown, Shield, Search, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-zinc-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-zinc-800 rounded w-36" />
        <div className="h-3 bg-zinc-800 rounded w-48" />
      </div>
      <div className="h-5 bg-zinc-800 rounded w-16" />
      <div className="h-5 bg-zinc-800 rounded w-16" />
    </div>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setUsers(getAllUsers().sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const filtered = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const MEMBERSHIP_BADGE: Record<string, { label: string; cls: string }> = {
    active:   { label: "Premium 👑", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    pending:  { label: "⏳ Pending",  cls: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    rejected: { label: "✗ Ditolak",  cls: "text-red-400 bg-red-500/10 border-red-500/20" },
    none:     { label: "Basic",       cls: "text-zinc-500 bg-zinc-800 border-zinc-700" },
    expired:  { label: "Expired",     cls: "text-zinc-500 bg-zinc-800 border-zinc-700" },
  };

  return (
    <AdminLayout title="Kelola User" subtitle="Daftar semua pengguna terdaftar">
      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-zinc-900 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/40"
        />
      </div>

      <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-white/[0.05]">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Membership</span>
        </div>

        {loading ? (
          <div className="divide-y divide-white/[0.04]">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">Tidak ada user ditemukan</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((u) => {
              const badge = MEMBERSHIP_BADGE[u.membershipStatus] || MEMBERSHIP_BADGE.none;
              return (
                <div key={u.id} className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_1fr_1fr] gap-2 sm:gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-[#0a0a0a] flex-shrink-0">
                      {u.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {u.fullName}
                        {u.membershipStatus === "active" && " 👑"}
                      </p>
                      <p className="text-xs text-zinc-500">{formatDate(u.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 truncate sm:block">{u.email}</p>
                  <span className={cn("self-start sm:self-center inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border",
                    u.role === "admin" ? "text-purple-400 bg-purple-500/10 border-purple-500/20" : "text-zinc-400 bg-zinc-800 border-zinc-700")}>
                    {u.role === "admin" ? <><Shield size={9} /> Admin</> : <><UserCheck size={9} /> Customer</>}
                  </span>
                  <span className={cn("self-start sm:self-center text-xs font-semibold px-2 py-0.5 rounded-full border", badge.cls)}>
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.05] text-xs text-zinc-500">
          {filtered.length} dari {users.length} user
        </div>
      </div>
    </AdminLayout>
  );
}
