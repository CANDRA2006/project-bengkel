import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { ArrowRight, Calendar, ChevronRight, Sparkles, Wrench, ShieldCheck, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data/services";
import { products, formatIDR } from "@/lib/data/products";
import { waBooking } from "@/lib/whatsapp";

const CinematicCar = lazy(() => import("@/components/three/CinematicCar").then((m) => ({ default: m.CinematicCar })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bengkel Harun — Bengkel Mobil Profesional & Terpercaya" },
      { name: "description", content: "Servis, perawatan, sparepart & modifikasi mobil dengan teknisi berpengalaman di Pekalongan." },
      { property: "og:title", content: "Bengkel Harun" },
      { property: "og:description", content: "Bengkel mobil premium dengan teknisi berpengalaman." },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "500+", label: "Mobil Ditangani" },
  { value: "2+", label: "Tahun Pengalaman" },
  { value: "98%", label: "Kepuasan Pelanggan" },
  { value: "24/7", label: "Emergency Service" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

function HomePage() {
  const featured = products.slice(0, 6);

  return (
    <>
      {/* HERO SECTION - ENHANCED */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/60 to-background" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 lg:pt-40 pb-28 lg:pb-40">
          <motion.div
            initial="initial"
            animate="whileInView"
            variants={{ whileInView: { transition: { staggerChildren: 0.12 } } }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium mb-8 animate-fade-in"
            >
              <Sparkles className="size-3.5 text-accent animate-pulse" />
              <span className="text-muted-foreground">Bengkel mobil terpercaya di Pekalongan</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[1.1] tracking-tight mb-8"
            >
              Bengkel Mobil{" "}
              <span className="text-gradient-brand">Profesional</span>
              <br />
              dan Terpercaya
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Melayani servis, perawatan, sparepart, dan modifikasi mobil dengan teknisi
              berpengalaman dan peralatan modern. Kepercayaan Anda adalah prioritas kami.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow hover:opacity-90 px-8 h-13 text-base font-semibold hover-lift">
                <a href={waBooking("Service Berkala")}>
                  <Calendar className="mr-2 size-5" /> Booking Service
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-13 px-8 text-base font-semibold glass border-border hover:bg-secondary hover-lift">
                <Link to="/katalog">
                  Lihat Katalog <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats - ENHANCED VISUAL HIERARCHY */}
            <motion.div
              variants={fadeUp}
              className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 lg:p-8 text-center group hover:border-brand/40 transition-all hover-lift"
                >
                  <div className="text-4xl lg:text-5xl font-display font-bold text-gradient-brand mb-2">{s.value}</div>
                  <div className="text-xs lg:text-sm text-muted-foreground font-medium">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3D CINEMATIC CAR SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-y border-border/40">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp} className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand mb-4 font-semibold">Cinematic Garage</p>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight mb-6">
                Setiap mobil layak <span className="text-gradient-brand">tampil prima</span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Dari detailing presisi hingga modifikasi performa — kami rawat mobil Anda dengan standar showroom.
              Putar, hover, dan nikmati pencahayaan sinematik dari studio kami.
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow px-8 h-12 font-semibold hover-lift">
                <Link to="/booking"><Calendar className="mr-2 size-5" /> Booking Sekarang</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass px-8 h-12 font-semibold hover-lift">
                <Link to="/layanan">Lihat Layanan</Link>
              </Button>
            </div>
          </motion.div>
          <div className="relative h-[420px] lg:h-[500px] rounded-3xl overflow-hidden card-premium hover-lift">
            <Suspense fallback={
              <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="size-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  Memuat studio 3D...
                </div>
              </div>
            }>
              <CinematicCar />
            </Suspense>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none">
              <span>· Live 3D Render</span>
              <span>360° Auto-Rotate</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP - PREMIUM CARDS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
          {[
            { icon: Wrench, title: "Teknisi Bersertifikat", desc: "Pengalaman menangani semua merk mobil dengan standar internasional." },
            { icon: ShieldCheck, title: "Garansi Servis", desc: "Garansi pengerjaan & spare part original dengan kepastian penuh." },
            { icon: Zap, title: "Emergency 24 Jam", desc: "Bantuan darurat untuk member premium kapan saja Anda butuh." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="card-premium rounded-2xl p-8 flex gap-5 hover:border-brand/40 transition-all hover-lift group"
            >
              <div className="grid place-items-center size-14 rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground flex-shrink-0 group-hover:scale-110 transition-transform">
                <f.icon className="size-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION - BENTO GRID STYLE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div {...fadeUp} className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.25em] text-brand mb-4 font-semibold">Layanan Kami</p>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight">
              Layanan <span className="text-gradient-brand">Premium</span>
              <br />
              untuk mobil Anda
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden lg:inline-flex px-6 h-12 font-semibold hover-lift">
            <Link to="/layanan">Semua layanan <ChevronRight className="ml-2" /></Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.slice(0, 3).map((s, i) => (
            <motion.div
              key={s.id}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl card-premium hover-lift cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={s.image}
                  alt={s.name}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent pointer-events-none" />
              </div>
              <div className="p-6 lg:p-8 -mt-14 lg:-mt-16 relative">
                <div className="grid place-items-center size-14 rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <s.icon className="size-6" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold font-display mb-3">{s.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{s.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <span className="text-base font-semibold text-brand font-display">{s.price}</span>
                  <Button asChild size="sm" variant="ghost" className="hover:text-brand font-semibold">
                    <a href={waBooking(s.name)}>Booking <ArrowRight className="ml-1.5 size-4" /></a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATALOG PREVIEW - ENHANCED GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div {...fadeUp} className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.25em] text-brand mb-4 font-semibold">Katalog Pilihan</p>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight">
              Sparepart & <span className="text-gradient-brand">Aksesori</span>
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden lg:inline-flex px-6 h-12 font-semibold hover-lift">
            <Link to="/katalog">Semua produk <ChevronRight className="ml-2" /></Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              {...fadeUp}
              transition={{ delay: i * 0.06 }}
              className="group card-premium rounded-2xl overflow-hidden hover:border-brand/40 transition-all hover-lift"
            >
              <div className="aspect-square overflow-hidden bg-muted relative">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">{p.category}</p>
                <h3 className="font-semibold text-sm line-clamp-2 mb-3 min-h-[2.5rem] group-hover:text-brand transition-colors">{p.name}</h3>
                <p className="text-sm font-bold text-brand font-display">{formatIDR(p.price)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS - ENHANCED */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-brand mb-4 font-semibold">Testimoni</p>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight">
            Dipercaya <span className="text-gradient-brand">ratusan</span>
            <br />
            pelanggan setia
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Budi Santoso", rating: 10, text: "Servis cepat, hasil memuaskan. Mobil terasa seperti baru lagi. Sangat rekomen!" },
            { name: "Siti Maharani", rating: 9, text: "Teknisi ramah dan profesional. Harga transparan, tidak ada biaya tersembunyi." },
            { name: "Rizky Pratama", rating: 10, text: "Home service-nya jadi penyelamat. Tetap detail walau di rumah, top!" },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="card-premium rounded-2xl p-8 hover-lift"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <Star key={idx} className={`size-4 ${idx < t.rating ? "fill-accent text-accent" : "text-muted/30"}`} />
                ))}
              </div>
              <p className="text-base leading-relaxed mb-6 text-muted-foreground">"{t.text}"</p>
              <div className="pt-6 border-t border-border/40 flex items-center gap-3">
                <div className="grid place-items-center size-10 rounded-lg bg-gradient-to-br from-brand to-accent text-brand-foreground font-bold text-sm flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">Pelanggan Setia</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION - FINAL PUSH */}
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
              Siap melayani mobil Anda hari ini
            </h2>
            <p className="mt-4 text-white/90 max-w-xl mx-auto text-lg leading-relaxed mb-10">
              Booking sekarang via WhatsApp, antrian lebih cepat dan terjamin.
            </p>
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 h-14 px-8 text-base font-semibold hover-lift shadow-lg">
              <a href={waBooking("Konsultasi")}>Hubungi via WhatsApp <ArrowRight className="ml-2 size-5" /></a>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
