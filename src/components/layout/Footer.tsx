import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, Instagram, Facebook, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WA_NUMBER, waLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/50 bg-surface/40">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2 space-y-4">
            <Logo showText />
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Solusi perawatan dan perbaikan mobil terpercaya di Pekalongan. Teknisi berpengalaman,
              sparepart berkualitas, dengan layanan home service & emergency 24 jam untuk member premium.
            </p>
            <div className="flex gap-3 pt-2">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid place-items-center size-9 rounded-full glass hover:bg-brand hover:text-brand-foreground transition-colors"
                  aria-label="Social"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { to: "/", label: "Beranda" },
                { to: "/katalog", label: "Katalog" },
                { to: "/layanan", label: "Layanan" },
                { to: "/tentang", label: "Tentang" },
                { to: "/kontak", label: "Kontak" },
                { to: "/profile", label: "Akun" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><MapPin className="size-4 shrink-0 mt-0.5 text-brand" /><span>Duwet Barat, Duwet, Kec. Bojong, Kab. Pekalongan, Jawa Tengah 51156</span></li>
              <li className="flex gap-2"><Phone className="size-4 shrink-0 text-brand" /><a href={waLink("Halo Bengkel Harun")} className="hover:text-foreground">+{WA_NUMBER}</a></li>
              <li className="flex gap-2"><Mail className="size-4 shrink-0 text-brand" /><a href="mailto:halo@bengkelharun.id" className="hover:text-foreground">halo@bengkelharun.id</a></li>
              <li className="flex gap-2"><Clock className="size-4 shrink-0 text-brand" /><span>Senin–Sabtu: 08.00–17.00<br />Minggu: 09.00–14.00</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Bengkel Harun. Semua hak dilindungi.</p>
          <p>Dibuat dengan presisi untuk pecinta otomotif.</p>
        </div>
      </div>
    </footer>
  );
}
