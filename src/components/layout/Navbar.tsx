import { useState, useEffect, useCallback } from "react";
import { Menu, X, Wrench, Crown, LogOut, User, ChevronDown, Zap, ShoppingCart, LayoutDashboard, Package, Sun, Moon, Globe, ClipboardList } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export function Navbar() {
  const { user, logout, cartCount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const NAV_LINKS = [
    { href: "/", label: t("nav.home"), section: "home" },
    { href: "/#services", label: t("nav.services"), section: "services" },
    { href: "/catalog", label: t("nav.catalog"), section: "catalog" },
    { href: "/membership", label: t("nav.membership"), section: "membership" },
    { href: "/#contact", label: t("nav.contact"), section: "contact" },
  ];

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

  useEffect(() => {
    if (!isHome) return;
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
    ["home", "services", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const openLogin = useCallback(() => { setAuthMode("login"); setAuthModal(true); setMobileOpen(false); }, []);
  const openRegister = useCallback(() => { setAuthMode("register"); setAuthModal(true); setMobileOpen(false); }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const section = href.slice(2);
      if (isHome) {
        const el = document.getElementById(section);
        if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 72; window.scrollTo({ top, behavior: "smooth" }); }
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(section);
          if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 72; window.scrollTo({ top, behavior: "smooth" }); }
        }, 300);
      }
    }
  };

  const isActive = (link: { href: string; section: string }) => {
    if (link.href === "/catalog") return location.pathname === "/catalog";
    if (link.href === "/membership") return location.pathname === "/membership";
    if (link.href === "/" && isHome && link.section === "home") return activeSection === "home";
    if (link.href.startsWith("/#") && isHome) return activeSection === link.section;
    return false;
  };

  const toggleLang = () => {
    const newLang = i18n.language === "id" ? "en" : "id";
    i18n.changeLanguage(newLang);
    localStorage.setItem("bh_lang", newLang);
  };

  const isDark = theme === "dark";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled || !isHome
            ? "bg-zinc-950/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        )}
      >
        <div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-100 pointer-events-none z-10" style={{ width: `${scrollProgress}%` }} />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_4px_12px_rgba(245,158,11,0.35)] group-hover:shadow-[0_6px_20px_rgba(245,158,11,0.5)] transition-all duration-300 group-hover:scale-105">
                  <Wrench size={17} className="text-[#0a0a0a]" strokeWidth={2.5} />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-zinc-950 animate-pulse" />
              </div>
              <div className="leading-none">
                <span className="block text-[15px] font-bold tracking-tight text-white">
                  Bengkel <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Harun</span>
                </span>
                <span className="block text-[10px] tracking-[0.15em] text-zinc-500 font-medium mt-0.5 uppercase">Pekalongan</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map((l) => (
                l.href.startsWith("/#") ? (
                  <button key={l.href} onClick={() => handleNavClick(l.href)}
                    className={cn("relative px-4 py-2 text-[13.5px] font-medium rounded-xl transition-all duration-200", isActive(l) ? "text-white" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]")}>
                    {l.label}
                    {isActive(l) && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />}
                  </button>
                ) : (
                  <Link key={l.href} to={l.href}
                    className={cn("relative px-4 py-2 text-[13.5px] font-medium rounded-xl transition-all duration-200", isActive(l) ? "text-white" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]")}>
                    {l.label}
                    {isActive(l) && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />}
                  </Link>
                )
              ))}
            </nav>

            {/* Right Controls */}
            <div className="hidden md:flex items-center gap-2">
              {/* Lang Toggle */}
              <button onClick={toggleLang} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all">
                <Globe size={13} />
                {i18n.language === "id" ? "EN" : "ID"}
              </button>

              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all">
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {user ? (
                <>
                  {/* Cart */}
                  <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all">
                    <ShoppingCart size={17} />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-[9px] font-bold text-[#0a0a0a] flex items-center justify-center">{cartCount > 9 ? "9+" : cartCount}</span>
                    )}
                  </Link>

                  {/* Profile */}
                  <div className="relative">
                    <button onClick={() => setProfileOpen(v => !v)}
                      className={cn("flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200",
                        profileOpen ? "bg-white/[0.08] border border-white/[0.1]" : "hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06]")}>
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[11px] font-bold text-[#0a0a0a] flex-shrink-0">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-[13px] font-semibold text-zinc-100 max-w-[80px] truncate leading-none">
                          {user.fullName.split(" ")[0]}
                          {user.membershipStatus === "active" && <span className="ml-1">👑</span>}
                        </p>
                        <p className="text-[10px] text-zinc-500 leading-none mt-0.5">{user.role === "admin" ? "Admin" : user.membershipStatus === "active" ? "Premium" : "Basic"}</p>
                      </div>
                      <ChevronDown size={13} className={cn("text-zinc-500 transition-transform duration-200", profileOpen && "rotate-180")} />
                    </button>

                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-zinc-900 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-20 overflow-hidden animate-slide-down">
                          <div className="px-4 py-3.5 bg-gradient-to-b from-amber-500/[0.07] to-transparent">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-base font-bold text-[#0a0a0a]">
                                {user.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                  {user.fullName}
                                  {user.membershipStatus === "active" && <span className="ml-1">👑</span>}
                                </p>
                                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              {user.membershipStatus === "active" ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full"><Crown size={9}/> Premium Aktif</span>
                              ) : user.membershipStatus === "pending" ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">⏳ Menunggu Approval</span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">{user.role === "admin" ? "Administrator" : "Basic Member"}</span>
                              )}
                            </div>
                          </div>
                          <div className="p-1.5 space-y-0.5">
                            {user.role === "admin" && (
                              <Link to="/admin" onClick={() => setProfileOpen(false)} className="w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors hover:bg-amber-500/[0.08] flex items-center gap-2.5 text-amber-400 font-medium">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center"><LayoutDashboard size={13} className="text-amber-400" /></div>
                                Dashboard Admin
                              </Link>
                            )}
                            <Link to="/profile" onClick={() => setProfileOpen(false)} className="w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors hover:bg-white/[0.05] flex items-center gap-2.5 text-zinc-300">
                              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center"><User size={13}/></div>
                              {t("nav.profile")}
                            </Link>
                            <Link to="/orders" onClick={() => setProfileOpen(false)} className="w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors hover:bg-white/[0.05] flex items-center gap-2.5 text-zinc-300">
                              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center"><ClipboardList size={13}/></div>
                              {t("nav.orders")}
                            </Link>
                            {user.membershipStatus !== "active" && user.role !== "admin" && (
                              <Link to="/membership" onClick={() => setProfileOpen(false)} className="w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors hover:bg-amber-500/[0.08] flex items-center gap-2.5 text-amber-400 font-medium">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center"><Zap size={13} className="text-amber-400"/></div>
                                Upgrade ke Premium
                              </Link>
                            )}
                            <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors hover:bg-red-500/[0.08] flex items-center gap-2.5 text-zinc-400 hover:text-red-400">
                              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center"><LogOut size={13}/></div>
                              {t("nav.logout")}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={openLogin} className="px-4 py-2 text-[13.5px] font-medium text-zinc-300 rounded-xl hover:bg-white/[0.05] hover:text-white transition-all duration-200">{t("nav.login")}</button>
                  <button onClick={openRegister} className="px-4 py-2 text-[13.5px] font-semibold text-[#0a0a0a] rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all duration-200 shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:-translate-y-px">{t("nav.register")}</button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center gap-2">
              {user && (
                <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400">
                  <ShoppingCart size={17} />
                  {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-[9px] font-bold text-[#0a0a0a] flex items-center justify-center">{cartCount > 9 ? "9+" : cartCount}</span>}
                </Link>
              )}
              <button className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all" onClick={() => setMobileOpen(v => !v)}>
                <span className={cn("absolute transition-all duration-200", mobileOpen ? "opacity-100" : "opacity-0 rotate-90")}><X size={20} /></span>
                <span className={cn("absolute transition-all duration-200", mobileOpen ? "opacity-0 -rotate-90" : "opacity-100")}><Menu size={20} /></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn("md:hidden overflow-hidden transition-all duration-300", mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0")}>
          <div className="bg-zinc-950/98 backdrop-blur-2xl border-t border-white/[0.05] px-4 py-3 space-y-0.5">
            {NAV_LINKS.map((l) => (
              l.href.startsWith("/#") ? (
                <button key={l.href} onClick={() => handleNavClick(l.href)}
                  className={cn("w-full text-left flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive(l) ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" : "text-zinc-300 hover:text-white hover:bg-white/[0.04]")}>
                  {l.label}
                  {isActive(l) && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                </button>
              ) : (
                <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)}
                  className={cn("flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive(l) ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" : "text-zinc-300 hover:text-white hover:bg-white/[0.04]")}>
                  {l.label}
                  {isActive(l) && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                </Link>
              )
            ))}
            <div className="flex items-center gap-2 px-4 pt-2">
              <button onClick={toggleLang} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white bg-white/[0.04] border border-white/[0.06]">
                <Globe size={14} /> {i18n.language === "id" ? "English" : "Indonesia"}
              </button>
              <button onClick={toggleTheme} className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm text-zinc-400 hover:text-white bg-white/[0.04] border border-white/[0.06]">
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
            <div className="pt-2 border-t border-white/[0.05] space-y-2 mt-2">
              {user ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03]">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-[#0a0a0a]">{user.fullName.charAt(0)}</div>
                    <div><p className="text-sm font-semibold text-white">{user.fullName} {user.membershipStatus === "active" && "👑"}</p><p className="text-xs text-zinc-500">{user.email}</p></div>
                  </div>
                  {user.role === "admin" && <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-amber-400 hover:bg-amber-500/[0.06]"><LayoutDashboard size={14}/> Dashboard Admin</Link>}
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-zinc-300 hover:bg-white/[0.04]"><ClipboardList size={14}/> {t("nav.orders")}</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"><LogOut size={14}/> {t("nav.logout")}</button>
                </div>
              ) : (
                <>
                  <button onClick={openLogin} className="w-full px-4 py-3 rounded-xl text-sm font-medium text-zinc-200 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07]">{t("nav.login")}</button>
                  <button onClick={openRegister} className="w-full px-4 py-3 rounded-xl text-sm font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500">{t("nav.register")}</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal open={authModal} onClose={() => setAuthModal(false)} defaultMode={authMode} />
    </>
  );
}
