import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Phone, Copy, Navigation, AlertTriangle, MessageCircle, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WA_NUMBER, waLink, WA_EMERGENCY } from "@/lib/whatsapp";
import { toast } from "sonner";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak & Lokasi — Bengkel Harun" },
      { name: "description", content: "Hubungi Bengkel Harun via WhatsApp, email, atau kunjungi bengkel di Duwet Barat, Bojong, Pekalongan." },
      { property: "og:title", content: "Kontak — Bengkel Harun" },
      { property: "og:description", content: "Hubungi kami atau kunjungi bengkel di Pekalongan." },
    ],
  }),
  component: KontakPage,
});

const ADDRESS = "2JF3+CQP, Duwet Barat, Duwet, Kec. Bojong, Kabupaten Pekalongan, Jawa Tengah 51156";
const COORDS = "-6.976155507303177,109.6043646358384";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${COORDS}`;
const ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${COORDS}`;

function KontakPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand mb-2">Kontak</p>
        <h1 className="text-4xl lg:text-6xl font-display font-bold">
          Mari <span className="text-gradient-brand">terhubung</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Pilih saluran yang paling nyaman — kami siap merespon dalam menit.
        </p>
      </motion.div>

      {/* Quick contact cards */}
      <div className="mt-10 grid md:grid-cols-3 gap-4">
        {[
          { icon: MessageCircle, title: "Customer Service", desc: "Tanya jawab umum, info produk & layanan.", href: waLink("Halo Bengkel Harun, saya ingin bertanya."), label: "Chat WhatsApp", color: "from-brand to-accent" },
          { icon: Phone, title: "Booking Layanan", desc: "Atur jadwal servis sesuai kebutuhan Anda.", href: waLink("Halo Bengkel Harun, saya ingin booking layanan."), label: "Booking Sekarang", color: "from-accent to-brand" },
          { icon: AlertTriangle, title: "Bantuan Darurat", desc: "Mobil mogok, ban pecah, atau kendala mesin di jalan.", href: WA_EMERGENCY, label: "Hubungi Darurat", color: "from-brand to-brand" },
        ].map((c, i) => (
          <motion.a
            key={c.title}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="card-premium rounded-2xl p-6 hover:border-brand/40 transition-all group block"
          >
            <div className={`grid place-items-center size-12 rounded-xl bg-gradient-to-br ${c.color} text-brand-foreground mb-4`}>
              <c.icon className="size-5" />
            </div>
            <h3 className="font-semibold text-lg">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
            <p className="mt-4 text-sm font-medium text-brand group-hover:underline">{c.label} →</p>
          </motion.a>
        ))}
      </div>

      {/* Location */}
      <div className="mt-16 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-display font-bold">Lokasi Kami</h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Datang langsung ke bengkel — kami sambut Anda dengan kopi & konsultasi gratis.
            </p>
          </div>
          <div className="card-premium rounded-2xl p-6 space-y-4">
            <div className="flex gap-3">
              <MapPin className="size-5 text-brand shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{ADDRESS}</p>
            </div>
            <div className="flex gap-3">
              <Phone className="size-5 text-brand shrink-0 mt-0.5" />
              <a href={waLink("Halo")} className="text-sm hover:text-brand">+{WA_NUMBER}</a>
            </div>
            <div className="flex gap-3">
              <Mail className="size-5 text-brand shrink-0 mt-0.5" />
              <a href="mailto:halo@bengkelharun.id" className="text-sm hover:text-brand">halo@bengkelharun.id</a>
            </div>
            <div className="flex gap-3">
              <Clock className="size-5 text-brand shrink-0 mt-0.5" />
              <p className="text-sm">Sen–Sab: 08.00–17.00<br />Minggu: 09.00–14.00</p>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button asChild size="sm" variant="outline" className="text-xs">
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"><MapPin /> Buka Maps</a>
              </Button>
              <Button asChild size="sm" variant="outline" className="text-xs">
                <a href={ROUTE_URL} target="_blank" rel="noopener noreferrer"><Navigation /> Rute</a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(ADDRESS);
                  toast.success("Alamat disalin");
                }}
              >
                <Copy /> Salin
              </Button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-3 rounded-3xl overflow-hidden card-premium min-h-[400px]"
        >
          <iframe
            title="Lokasi Bengkel Harun"
            src={`https://www.google.com/maps?q=${COORDS}&z=17&output=embed`}
            className="size-full min-h-[400px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>

      {/* Emergency CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 relative overflow-hidden rounded-3xl p-8 lg:p-12 bg-gradient-to-r from-brand to-accent text-brand-foreground"
      >
        <div className="absolute inset-0 noise"><div className="noise-overlay" /></div>
        <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider mb-2">
              <AlertTriangle className="size-4" /> Layanan Darurat 24 Jam
            </div>
            <h2 className="text-2xl lg:text-4xl font-display font-bold">Mobil mogok di jalan?</h2>
            <p className="mt-2 max-w-xl">
              Ban pecah, kendaraan tidak bisa dinyalakan, atau kendala mesin? Kami siap bergerak.
            </p>
          </div>
          <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
            <a href={WA_EMERGENCY} target="_blank" rel="noopener noreferrer">
              Hubungi Bantuan Darurat
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
