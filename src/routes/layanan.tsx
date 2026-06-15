import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Clock, ArrowRight } from "lucide-react";
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

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
};

function LayananPage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 lg:pt-40 pb-20 lg:pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.25em] text-brand mb-4 font-semibold">Layanan Kami</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[1.1] mb-8">
                Servis <span className="text-gradient-brand">Profesional</span> untuk semua mobil
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Teknisi bersertifikat, peralatan modern, dan garansi pengerjaan. Booking langsung via WhatsApp untuk pelayanan terbaik.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES LIST - PREMIUM LAYOUT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="space-y-8 lg:space-y-10">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.08 }}
              className="group card-premium rounded-2xl lg:rounded-3xl overflow-hidden grid lg:grid-cols-5 hover-lift"
            >
              {/* Image */}
              <div className="lg:col-span-2 aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted relative">
                <img 
                  src={s.image} 
                  alt={s.name} 
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Content */}
              <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="grid place-items-center size-12 lg:size-14 rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground flex-shrink-0 group-hover:scale-110 transition-transform">
                      <s.icon className="size-6 lg:size-7" />
                    </div>
                    <span className="text-xs lg:text-sm uppercase tracking-wider text-muted-foreground font-semibold inline-flex items-center gap-2">
                      <Clock className="size-4" /> {s.duration}
                    </span>
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-display font-bold mb-4">{s.name}</h2>
                  <p className="text-base lg:text-lg text-muted-foreground mb-6 leading-relaxed">{s.description}</p>

                  {/* Features Grid */}
                  <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm lg:text-base">
                        <Check className="size-5 lg:size-6 text-brand mt-0.5 flex-shrink-0" /> 
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="pt-6 lg:pt-8 border-t border-border/40 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground mb-1">Harga mulai dari</p>
                    <span className="text-2xl lg:text-3xl font-bold text-brand font-display">{s.price}</span>
                  </div>
                  <Button asChild className="bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow font-semibold px-8 h-12 lg:h-13 hover-lift">
                    <a href={waBooking(s.name)} target="_blank" rel="noopener noreferrer">
                      Booking Sekarang <ArrowRight className="ml-2 size-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl p-12 lg:p-20 text-center"
          style={{ background: "var(--gradient-brand)" }}
        >
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=80")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white leading-tight mb-6">
              Pilih layanan yang Anda butuhkan
            </h2>
            <p className="text-white/90 max-w-xl mx-auto text-lg mb-10 leading-relaxed">
              Hubungi kami melalui WhatsApp untuk konsultasi gratis dan booking yang mudah.
            </p>
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 h-14 px-8 text-base font-semibold hover-lift shadow-lg">
              <a href={waBooking("Konsultasi Layanan")}>
                Chat via WhatsApp <ArrowRight className="ml-2 size-5" />
              </a>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
