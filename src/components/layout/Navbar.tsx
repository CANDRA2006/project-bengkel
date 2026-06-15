import { useState, useEffect, useCallback } from "react";
import { Menu, X, Wrench, Crown, LogOut, User, ChevronDown, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Scroll tracking
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docH = document.documentElement.scrollHeight - window.innerHeight;
          setScrolled(scrollY > 24);
          setScrollProgress(docH > 0 ? (scrollY / docH) * 100 : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0.3] }
    );

    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const openLogin = useCallback(() => {
    setAuthMode("login");
    setAuthModal(true);
    setMobileOpen(false);
  }, []);

  const openRegister = useCallback(() => {
    setAuthMode("register");
    setAuthModal(true);
    setMobileOpen(false);
  }, []);

  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 72;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-[#090909]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        )}
        style={{ willChange: "background" }}
      >
        {/* Scroll progress bar */}
        <div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-100 pointer-events-none z-10"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
              className="flex items-center gap-3 group flex-shrink-0"
              aria-label="Bengkel Harun - Kembali ke beranda"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_4px_12px_rgba(245,158,11,0.35)] group-hover:shadow-[0_6px_20px_rgba(245,158,11,0.5)] transition-all duration-300 group-hover:scale-105">
                  <Wrench size={17} className="text-[#0a0a0a]" strokeWidth={2.5} />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#090909] animate-pulse" aria-hidden="true" />
              </div>
              <div className="leading-none">
                <span className="block text-[15px] font-bold tracking-tight text-white font-display">
                  Bengkel <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Harun</span>
                </span>
                <span className="block text-[10px] tracking-[0.15em] text-zinc-500 font-medium mt-0.5 uppercase">Pekalongan</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Navigasi utama">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                  className={cn(
                    "relative px-4 py-2 text-[13.5px] font-medium rounded-xl transition-all duration-200",
                    activeSection === l.href.slice(1)
                      ? "text-white"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                  )}
                >
                  {l.label}
                  {activeSection === l.href.slice(1) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                  )}
                </a>
              ))}
            </nav>

            {/* Right: Auth */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className={cn(
                      "flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200",
                      profileOpen
                        ? "bg-white/[0.08] border border-white/[0.1]"
                        : "hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06]"
                    )}
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[11px] font-bold text-[#0a0a0a] font-display flex-shrink-0">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] font-semibold text-zinc-100 max-w-[90px] truncate leading-none">
                        {user.fullName.split(" ")[0]}
                      </p>
                      {user.membershipTier === "premium" && (
                        <p className="text-[10px] text-amber-400 leading-none mt-0.5 flex items-center gap-0.5">
                          <Crown size={8} className="inline" /> Premium
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      size={13}
                      className={cn("text-zinc-500 transition-transform duration-200", profileOpen && "rotate-180")}
                    />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#141416] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-20 overflow-hidden animate-slide-down">
                        {/* Profile header */}
                        <div className="px-4 py-3.5 bg-gradient-to-b from-amber-500/[0.07] to-transparent">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-base font-bold text-[#0a0a0a] font-display">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                            </div>
                          </div>
                          {user.membershipTier === "premium" ? (
                            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 text-[11px] font-semibold">
                              <Crown size={10} /> Member Premium Aktif
                            </div>
                          ) : (
                            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px]">
                              Basic Member
                            </div>
                          )}
                        </div>

                        <div className="p-1.5">
                          {user.membershipTier !== "premium" && (
                            <button
                              onClick={() => { setProfileOpen(false); scrollTo("#membership"); }}
                              className="w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors hover:bg-amber-500/[0.08] flex items-center gap-2.5 text-amber-400 font-medium"
                            >
                              <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                                <Zap size={13} className="text-amber-400" />
                              </div>
                              Upgrade ke Premium
                            </button>
                          )}
                          <button
                            onClick={() => { logout(); setProfileOpen(false); }}
                            className="w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors hover:bg-red-500/[0.08] flex items-center gap-2.5 text-zinc-400 hover:text-red-400"
                          >
                            <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
                              <LogOut size={13} />
                            </div>
                            Keluar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="px-4 py-2 text-[13.5px] font-medium text-zinc-300 rounded-xl hover:bg-white/[0.05] hover:text-white transition-all duration-200"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={openRegister}
                    className="px-4 py-2 text-[13.5px] font-semibold text-[#0a0a0a] rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all duration-200 shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] hover:-translate-y-px"
                  >
                    Daftar Gratis
                  </button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileOpen}
            >
              <span className={cn("absolute transition-all duration-200", mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90")}>
                <X size={20} />
              </span>
              <span className={cn("absolute transition-all duration-200", mobileOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0")}>
                <Menu size={20} />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-out",
            mobileOpen ? "max-h-[460px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-[#0d0d0f]/98 backdrop-blur-2xl border-t border-white/[0.05] px-4 py-3 space-y-0.5">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  activeSection === l.href.slice(1)
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span>{l.label}</span>
                {activeSection === l.href.slice(1) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </a>
            ))}

            <div className="pt-2 border-t border-white/[0.05] space-y-2 mt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03]">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-[#0a0a0a]">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user.fullName}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
                  >
                    <LogOut size={15} /> Keluar
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium text-zinc-200 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-all"
                  >
                    Masuk ke Akun
                  </button>
                  <button
                    onClick={openRegister}
                    className="w-full px-4 py-3 rounded-xl text-sm font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
                  >
                    Daftar Gratis
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        open={authModal}
        onClose={() => setAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  );
}