import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Crown, Check, X, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { getPendingMemberships, approveMembership, rejectMembership, getAllUsers, getApprovedMembers } from "@/lib/auth";
import { getBookings, type Booking } from "@/lib/bookings";
import { useI18n } from "@/lib/i18n-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const [tab, setTab] = useState<"overview" | "users" | "memberships" | "bookings">("overview");
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [approvedMembers, setApprovedMembers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
    window.addEventListener("bh-membership-updated", refreshData);
    window.addEventListener("bh-auth-changed", refreshData);
    window.addEventListener("bookings:update", refreshData);
    return () => {
      window.removeEventListener("bh-membership-updated", refreshData);
      window.removeEventListener("bh-auth-changed", refreshData);
      window.removeEventListener("bookings:update", refreshData);
    };
  }, []);

  const refreshData = () => {
    setPendingMembers(getPendingMemberships());
    setAllUsers(getAllUsers());
    setApprovedMembers(getApprovedMembers());
    setBookings(getBookings());
  };

  const handleApprove = async (userId: string) => {
    setApproving(userId);
    try {
      await approveMembership(userId);
      toast.success("Membership disetujui");
      refreshData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to approve");
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (userId: string) => {
    setApproving(userId);
    try {
      await rejectMembership(userId);
      toast.success("Membership ditolak");
      refreshData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reject");
    } finally {
      setApproving(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">🛡️ Admin Dashboard</h1>
            <p className="text-sm text-zinc-400 mt-1">Welcome, {user?.fullName}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Users, label: "Total Users", value: allUsers.length },
            { icon: Crown, label: "Premium Members", value: approvedMembers.length },
            { icon: Calendar, label: "Total Bookings", value: bookings.length },
            { icon: Users, label: "Pending Approval", value: pendingMembers.length, color: "amber" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-6 border backdrop-blur-xl ${
                stat.color === "amber"
                  ? "bg-amber-500/5 border-amber-500/20"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`size-6 ${stat.color === "amber" ? "text-amber-400" : "text-blue-400"}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl w-fit border border-white/10">
          {(["overview", "users", "memberships", "bookings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Memberships */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Crown size={20} className="text-amber-400" />
                  Pending Memberships ({pendingMembers.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pendingMembers.length === 0 ? (
                    <p className="text-sm text-zinc-400">No pending requests</p>
                  ) : (
                    pendingMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5">
                        <div>
                          <p className="font-medium text-white">{member.fullName}</p>
                          <p className="text-xs text-zinc-400">{member.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(member.id)}
                            disabled={approving === member.id}
                            className="p-2 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 rounded-lg text-green-400"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(member.id)}
                            disabled={approving === member.id}
                            className="p-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-lg text-red-400"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Recent Bookings */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-400" />
                  Recent Bookings (Last 5)
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bookings.slice(0, 5).length === 0 ? (
                    <p className="text-sm text-zinc-400">No bookings yet</p>
                  ) : (
                    bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="bg-white/5 p-4 rounded-lg border border-white/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white">{booking.serviceName}</p>
                            <p className="text-xs text-zinc-400">{booking.customerName}</p>
                            <p className="text-xs text-zinc-500 mt-1">{booking.date} {booking.time}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            booking.status === "Dikonfirmasi" ? "bg-green-500/20 text-green-400" :
                            booking.status === "Selesai" ? "bg-blue-500/20 text-blue-400" :
                            booking.status === "Dibatalkan" ? "bg-red-500/20 text-red-400" :
                            "bg-amber-500/20 text-amber-400"
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-bold text-white mb-6">All Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-zinc-400">Name</th>
                    <th className="text-left py-3 px-4 text-zinc-400">Email</th>
                    <th className="text-left py-3 px-4 text-zinc-400">WhatsApp</th>
                    <th className="text-left py-3 px-4 text-zinc-400">Membership</th>
                    <th className="text-left py-3 px-4 text-zinc-400">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 px-4 text-white font-medium">{u.fullName}</td>
                      <td className="py-3 px-4 text-zinc-400">{u.email}</td>
                      <td className="py-3 px-4 text-zinc-400">{u.whatsapp}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          u.membershipTier === "approved" ? "bg-amber-500/20 text-amber-400" :
                          u.membershipTier === "pending" ? "bg-blue-500/20 text-blue-400" :
                          "bg-zinc-500/20 text-zinc-400"
                        }`}>
                          {u.membershipTier.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">{new Date(u.createdAt).toLocaleDateString('id')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {tab === "memberships" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-bold text-white mb-6">Pending Membership Requests</h3>
            <div className="space-y-4">
              {pendingMembers.length === 0 ? (
                <p className="text-zinc-400">No pending requests</p>
              ) : (
                pendingMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition">
                    <div className="flex-1">
                      <p className="font-medium text-white flex items-center gap-2">
                        {member.fullName}
                        {member.isAdmin && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">ADMIN</span>}
                      </p>
                      <p className="text-sm text-zinc-400">{member.email}</p>
                      <p className="text-xs text-zinc-500 mt-1">{member.whatsapp} • Requested: {new Date(member.membershipRequestedAt).toLocaleDateString('id')}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(member.id)}
                        disabled={approving === member.id}
                        className="px-4 py-2 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 rounded-lg text-green-400 font-medium disabled:opacity-50"
                      >
                        {approving === member.id ? "..." : <Check size={16} />}
                      </button>
                      <button
                        onClick={() => handleReject(member.id)}
                        disabled={approving === member.id}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-lg text-red-400 font-medium disabled:opacity-50"
                      >
                        {approving === member.id ? "..." : <X size={16} />}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {tab === "bookings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-bold text-white mb-6">All Bookings</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {bookings.length === 0 ? (
                <p className="text-zinc-400">No bookings yet</p>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-white">{booking.serviceName}</p>
                        <p className="text-sm text-zinc-400">{booking.customerName} • {booking.phone}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        booking.status === "Dikonfirmasi" ? "bg-green-500/20 text-green-400" :
                        booking.status === "Selesai" ? "bg-blue-500/20 text-blue-400" :
                        booking.status === "Dibatalkan" ? "bg-red-500/20 text-red-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{booking.carModel} ({booking.plate}) • {booking.date} {booking.time}</p>
                    {booking.notes && <p className="text-xs text-zinc-600 mt-2">Notes: {booking.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
