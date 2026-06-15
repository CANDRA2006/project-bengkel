import { useState } from "react";
import { Wrench, MapPin, Phone, Clock, Mail, ArrowRight, Instagram, Facebook, Youtube, Twitter } from "lucide-react";

const QUICK_LINKS = [
  { label: "Beranda",     href: "#home" },
  { label: "Layanan",     href: "#services" },
  { label: "Katalog",     href: "#catalog" },
  { label: "Membership",  href: "#membership" },
  { label: "Booking",     href: "#contact" },
];

const SERVICES = [
  "Tune Up Mesin",
  "Ganti Oli",
  "Servis Rem",
  "Servis AC",
  "Kelistrikan",
  "Servis Umum",
];

const SOCIALS = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook,  href: "#", label: "Facebook" },
  { icon: Youtube,   href: "#", label: "YouTube" },
  { icon: Twitter,   href: "#", label: "Twitter/X" },
];

const BADGES = [
  { badge: "Trophy", text: "Bengkel Terbaik Pekalongan 2024" },
  { badge: "CheckCircle", text: "Teknisi Bersertifikat Resmi" },
  { badge: "Lock", text: "Garansi Servis 30 Hari" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // simulate
    setSubscribed(true);
    setLoading(false);
  };

  return (
    <footer className="relative bg-[#070709] border-t border-white/[0.06] overflow-hidden" role="contentinfo">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-500/[0.025] blur-[80px] pointer-events-none" aria-hidden="true" />

      {/* Newsletter banner */}
      <div className="border-b border-white/[0.05]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-6">
            <div className="max-w-sm">
              <h3 className="font-display text-[17px] font-bold text-white mb-1">
                Promo & Info Servis Gratis
              </h3>
              <p className="text-[13px] text-zinc-500">
                Dapatkan reminder servis berkala dan promo eksklusif member langsung di inbox Anda.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2.5 text-green-400 text-sm font-medium">
                <span className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center text-xs">✓</span>
                Terima kasih! Anda sudah terdaftar.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto" noValidate>
                <div className="relative flex-1 md:w-64">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="email@anda.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email untuk newsletter"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/08 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-[#0a0a0a] text-[13px] font-bold hover:from-amber-300 hover:to-orange-400 transition-all disabled:opacity-60 shadow-[0_4px_12px_rgba(245,158,11,0.25)] flex-shrink-0"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                  {loading ? "" : "Daftar"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_4px_12px_rgba(245,158,11,0.3)]">
                <Wrench size={17} className="text-[#0a0a0a]" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-white font-display leading-none">Bengkel Harun</p>
                <p className="text-[10px] text-zinc-600 font-medium tracking-wider uppercase mt-0.5">Pekalongan</p>
              </div>
            </div>

            <p className="text-[13.5px] text-zinc-500 leading-relaxed mb-5">
              Bengkel mobil profesional di Pekalongan dengan pengalaman 2+ tahun. Teknisi bersertifikat, peralatan modern, harga transparan.
            </p>

            {/* Contact info compact */}
            <div className="space-y-2.5 mb-6">
              {[
                { icon: MapPin, text: "Jl. Raya Klego No. 45, Pekalongan" },
                { icon: Phone,  text: "0812-3456-7890 (WhatsApp)" },
                { icon: Clock,  text: "Buka 07.00 – 21.00 setiap hari" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2 text-[12.5px] text-zinc-600">
                  <Icon size={12} className="mt-0.5 flex-shrink-0 text-amber-500/60" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-zinc-600 hover:text-zinc-200 hover:bg-white/[0.08] hover:border-white/15 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[11.5px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Navigasi</p>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                    className="text-[13.5px] text-zinc-500 hover:text-zinc-100 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-amber-500 transition-colors" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-[11.5px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Layanan</p>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    onClick={(e) => { e.preventDefault(); scrollTo("#services"); }}
                    className="text-[13.5px] text-zinc-500 hover:text-zinc-100 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-amber-500 transition-colors" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust + badges */}
          <div>
            <p className="text-[11.5px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Keunggulan</p>
            <div className="space-y-3">
              {BADGES.map(({ badge, text }) => (
                <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-sm leading-none flex-shrink-0 text-amber-400" aria-hidden="true">•</span>
                  <p className="text-[12.5px] text-zinc-400 leading-snug">{text}</p>
                </div>
              ))}
            </div>

            {/* Google rating */}
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/[0.05] border border-amber-500/[0.12] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg" aria-hidden="true">⭐</span>
              </div>
              <div>
                <p className="text-[15px] font-bold text-amber-400 font-display leading-none">4.9 / 5.0</p>
                <p className="text-[11.5px] text-zinc-600 mt-0.5">312 ulasan Google Maps</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-zinc-700">
            <p>© {new Date().getFullYear()} Bengkel Harun Pekalongan. Hak cipta dilindungi.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-zinc-400 transition-colors">Kebijakan Privasi</a>
              <span aria-hidden="true">·</span>
              <a href="#" className="hover:text-zinc-400 transition-colors">Syarat & Ketentuan</a>
              <span aria-hidden="true">·</span>
              <a href="#" className="hover:text-zinc-400 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}