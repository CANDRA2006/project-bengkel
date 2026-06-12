import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, User as UserIcon, LogOut, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/katalog", label: "Katalog" },
  { to: "/layanan", label: "Layanan" },
  { to: "/booking", label: "Booking" },
  { to: "/tentang", label: "Tentang" },
  { to: "/kontak", label: "Kontak" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled ? "glass-strong border-b border-border/40" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo showText />
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => {
              const active = pathname === l.to;
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors rounded-md",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {l.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-brand rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex">
              <Search className="size-4" />
            </Button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full glass px-3 py-1.5 text-sm hover:border-brand/40 transition-colors"
                >
                  <div className="grid place-items-center size-7 rounded-full bg-gradient-to-br from-brand to-accent text-brand-foreground font-semibold text-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[120px] truncate">{user.fullName.split(" ")[0]}</span>
                  <ChevronDown className="size-3 opacity-60" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-56 glass-strong rounded-xl p-2 shadow-elevated"
                    >
                      <div className="px-3 py-2 border-b border-border/40 mb-1">
                        <p className="text-sm font-semibold truncate">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      {[
                        { to: "/profile", label: "Profil Saya" },
                        { to: "/profile?tab=history", label: "Riwayat Booking" },
                        { to: "/kontak", label: "FAQ" },
                      ].map((i) => (
                        <Link key={i.to} to={i.to} className="block rounded-md px-3 py-2 text-sm hover:bg-secondary transition-colors">
                          {i.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-brand hover:bg-brand/10 transition-colors"
                      >
                        <LogOut className="size-3.5" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow hover:opacity-90">
                  <Link to="/auth/register">Register</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm glass-strong border-l border-border p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <Logo showText />
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close">
                  <X className="size-5" />
                </Button>
              </div>
              <ul className="space-y-1">
                {navLinks.map((l, i) => (
                  <motion.li
                    key={l.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      to={l.to}
                      className="block rounded-lg px-4 py-3 text-lg font-medium hover:bg-secondary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              {!user && (
                <div className="mt-auto space-y-2 pt-6">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/auth/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-brand to-accent text-brand-foreground">
                    <Link to="/auth/register">Register</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
