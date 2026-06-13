import { Wrench, Phone, MapPin, Clock } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

const LINKS = [
  { label: "Beranda", href: "#home" },
  { label: "Layanan", href: "#services" },
  { label: "Katalog", href: "#catalog" },
  { label: "Membership", href: "#membership" },
  { label: "Kontak", href: "#contact" },
];

export function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <Wrench size={16} className="text-black" />
              </div>
              <span className="text-white font-bold text-base">Bengkel<span className="text-amber-500"> Harun</span></span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Bengkel terpercaya di Pekalongan. Spesialis servis, modifikasi, dan aksesori kendaraan dengan teknisi berpengalaman.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Menu</h4>
            <ul className="space-y-2.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                    className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-zinc-400">
                <Phone size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <a href={waLink("Halo!")} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  +62 823-2966-1815
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-400">
                <MapPin size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <span>Pekalongan, Jawa Tengah</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-400">
                <Clock size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <span>08.00 – 17.00 WIB (Senin–Sabtu)</span>
              </li>
            </ul>
          </div>

          {/* Tagline */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Layanan Unggulan</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              {["Ganti Oli & Filter", "Servis AC", "Tune Up Mesin", "Modifikasi Custom", "Balancing & Spooring", "Pasang Aksesori"].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} Bengkel Harun. Hak Cipta Dilindungi.</p>
          <p>Dibuat dengan sepenuh hati untuk pelanggan setia kami.</p>
        </div>
      </div>
    </footer>
  );
}
