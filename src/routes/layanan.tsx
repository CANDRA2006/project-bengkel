import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data/services";
import { waBooking } from "@/lib/whatsapp";

export const Route = createFileRoute("/layanan")({
  head: () => ({
    meta: [
      { title: "Layanan Servis Mobil — Bengkel Harun" },
      { name: "description", content: "Service berkala, tune up, ganti oli, perbaikan mesin, dan home service. Booking via WhatsApp." },
      { property: "og:title", content: "Layanan — Bengkel Harun" },
      { property: "og:description", content: "Pilihan layanan servis mobil profesional." },
    ],
  }),
  component: LayananPage,
});

function LayananPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand mb-2">Layanan Kami</p>
        <h1 className="text-4xl lg:text-6xl font-display font-bold">
          Servis <span className="text-gradient-brand">Profesional</span> untuk semua mobil
        </h1>
        <p className="mt-4 text-muted-foreground">
          Teknisi bersertifikat, peralatan modern, dan garansi pengerjaan. Booking langsung via WhatsApp.
        </p>
      </motion.div>

      <div className="mt-12 space-y-6">
        {services.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.08 }}
            className="card-premium rounded-3xl overflow-hidden grid lg:grid-cols-5"
          >
            <div className="lg:col-span-2 aspect-[16/10] lg:aspect-auto overflow-hidden">
              <img src={s.image} alt={s.name} className="size-full object-cover" loading="lazy" />
            </div>
            <div className="lg:col-span-3 p-6 lg:p-10 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid place-items-center size-10 rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground">
                  <s.icon className="size-5" />
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                  <Clock className="size-3" /> {s.duration}
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold">{s.name}</h2>
              <p className="mt-2 text-muted-foreground">{s.description}</p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="size-4 text-brand mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
                <span className="text-lg font-bold text-brand">{s.price}</span>
                <Button asChild className="bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow">
                  <a href={waBooking(s.name)} target="_blank" rel="noopener noreferrer">
                    Booking via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
