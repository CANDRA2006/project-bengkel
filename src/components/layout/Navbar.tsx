import { useState, useEffect } from "react";
import { Menu, X, Wrench, Crown, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#home", label: "Beranda" },
  { href: "#services", label: "Layanan" },
  { href: "#catalog", label: "Katalog" },
  { href: "#membership", label: "Membership" },
  { href: "#contact", label: "Kontak" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const openLogin = () => { setAuthMode("login"); setAuthModal(true); };
  const openRegister = () => { setAuthMode("register"); setAuthModal(true); };

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-xl"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("#home"); }} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
                <Wrench size={16} className="text-black" />
              </div>
              <div className="leading-tight">
                <span className="text-white font-bold text-base tracking-tight">Bengkel</span>
                <span className="text-amber-500 font-bold text-base"> Harun</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                  className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-all duration-200"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Auth area */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                      <User size={13} className="text-amber-400" />
                    </div>
                    <span className="text-white font-medium max-w-[100px] truncate">{user.fullName.split(" ")[0]}</span>
                    {user.membershipTier === "premium" && <Crown size={12} className="text-amber-400" />}
                    <ChevronDown size={13} className={cn("text-zinc-400 transition-transform", profileOpen && "rotate-180")} />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-zinc-800">
                          <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                          <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                          <div className="mt-1.5">
                            {user.membershipTier === "premium" ? (
                              <Badge variant="premium"><Crown size={10} /> Member Premium</Badge>
                            ) : (
                              <Badge variant="default">Basic</Badge>
                            )}
                          </div>
                        </div>
                        {user.membershipTier !== "premium" && (
                          <button
                            onClick={() => { setProfileOpen(false); scrollTo("#membership"); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-amber-400 hover:bg-zinc-800 transition-colors flex items-center gap-2"
                          >
                            <Crown size={14} /> Upgrade Premium
                          </button>
                        )}
                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors flex items-center gap-2"
                        >
                          <LogOut size={14} /> Keluar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={openLogin}>Masuk</Button>
                  <Button size="sm" onClick={openRegister}>Daftar</Button>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-zinc-950/98 border-t border-zinc-800 backdrop-blur-md">
            <nav className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                  className="block px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 rounded-lg bg-zinc-800/60">
                      <p className="text-sm font-medium text-white">{user.fullName}</p>
                      <p className="text-xs text-zinc-400">{user.email}</p>
                    </div>
                    <Button variant="secondary" size="sm" className="w-full" onClick={() => { logout(); setOpen(false); }}>
                      <LogOut size={14} /> Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" size="sm" className="w-full" onClick={() => { openLogin(); setOpen(false); }}>
                      Masuk
                    </Button>
                    <Button size="sm" className="w-full" onClick={() => { openRegister(); setOpen(false); }}>
                      Daftar
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <AuthModal
        open={authModal}
        onClose={() => setAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  );
}
