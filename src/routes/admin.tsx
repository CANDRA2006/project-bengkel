import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/layout/AdminDashboard";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Bengkel Harun" },
      { name: "description", content: "Admin panel untuk mengelola booking, user, dan membership." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Loading...</div>;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" />;
  }

  return <AdminDashboard />;
}
