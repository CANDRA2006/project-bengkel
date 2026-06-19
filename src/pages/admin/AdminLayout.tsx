import { Navbar } from "@/components/layout/Navbar";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingBag, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/orders", label: "Pesanan", icon: ShoppingBag },
  { to: "/admin/membership", label: "Membership", icon: Crown },
];

export function AdminLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <main className="pt-[68px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Admin header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <LayoutDashboard size={15} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{title}</h1>
              {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-52 flex-shrink-0 gap-1">
              {ADMIN_LINKS.map((link) => {
                const active = link.exact
                  ? location.pathname === link.to
                  : location.pathname.startsWith(link.to) && link.to !== "/admin";
                const exactActive = link.to === "/admin" && location.pathname === "/admin";
                const isActive = link.exact ? exactActive : active;

                return (
                  <Link key={link.to} to={link.to}
                    className={cn("flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]")}>
                    <link.icon size={15} />
                    {link.label}
                  </Link>
                );
              })}
            </aside>

            {/* Mobile Tabs */}
            <div className="lg:hidden w-full mb-4">
              <div className="flex gap-1 overflow-x-auto pb-1">
                {ADMIN_LINKS.map((link) => {
                  const isActive = link.exact
                    ? location.pathname === link.to
                    : location.pathname.startsWith(link.to) && link.to !== "/admin" || (link.to === "/admin" && location.pathname === "/admin");
                  return (
                    <Link key={link.to} to={link.to}
                      className={cn("flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                        isActive ? "bg-amber-500/15 text-amber-400" : "bg-zinc-900 text-zinc-400")}>
                      <link.icon size={13} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
