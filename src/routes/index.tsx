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
      {/* HERO */}
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

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32 pb-24">
          <motion.div
            initial="initial"
            animate="whileInView"
            variants={{ whileInView: { transition: { staggerChildren: 0.12 } } }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium mb-6"
            >
              <Sparkles className="size-3 text-accent" />
              <span className="text-muted-foreground">Bengkel mobil terpercaya di Pekalongan</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight"
            >
              Bengkel Mobil{" "}
              <span className="text-gradient-brand">Profesional</span>
              <br />
              dan Terpercaya
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Melayani servis, perawatan, sparepart, dan modifikasi mobil dengan teknisi
              berpengalaman dan peralatan modern.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow hover:opacity-90 px-7 h-12 text-base">
                <a href={waBooking("Service Berkala")}>
                  <Calendar className="mr-1" /> Booking Service
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-7 text-base glass border-border hover:bg-secondary">
                <Link to="/katalog">
                  Lihat Katalog <ArrowRight />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-5 text-center"
                >
                  <div className="text-3xl lg:text-4xl font-display font-bold text-gradient-brand">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3D CINEMATIC CAR */}
      <section className="relative py-20 overflow-hidden border-y border-border/40">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
          <motion.div {...fadeUp}>
            <p className="text-xs uppercase tracking-[0.25em] text-brand mb-3">Cinematic Garage</p>
            <h2 className="text-3xl lg:text-5xl font-display font-bold leading-tight">
              Setiap mobil layak <span className="text-gradient-brand">tampil prima</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Dari detailing presisi hingga modifikasi performa — kami rawat mobil Anda dengan standar showroom.
              Putar, hover, dan nikmati pencahayaan sinematik dari studio kami.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow">
                <Link to="/booking"><Calendar className="mr-1" /> Booking Sekarang</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass">
                <Link to="/layanan">Lihat Layanan</Link>
              </Button>
            </div>
          </motion.div>
          <div className="relative h-[420px] lg:h-[500px] rounded-3xl overflow-hidden card-premium">
            <Suspense fallback={
              <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
                Memuat studio 3D...
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

      {/* FEATURES STRIP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Wrench, title: "Teknisi Bersertifikat", desc: "Pengalaman menangani semua merk mobil." },
            { icon: ShieldCheck, title: "Garansi Servis", desc: "Garansi pengerjaan & spare part original." },
            { icon: Zap, title: "Emergency 24 Jam", desc: "Bantuan darurat untuk member premium." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="card-premium rounded-2xl p-6 flex gap-4 hover:border-brand/40 transition-colors"
            >
              <div className="grid place-items-center size-12 rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground">
                <f.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div {...fadeUp} className="flex items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand mb-2">Layanan Kami</p>
            <h2 className="text-3xl lg:text-5xl font-display font-bold">
              Layanan <span className="text-gradient-brand">Premium</span> untuk mobil Anda
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/layanan">Semua layanan <ChevronRight /></Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.slice(0, 3).map((s, i) => (
            <motion.div
              key={s.id}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl card-premium"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent pointer-events-none" />
              </div>
              <div className="p-6 -mt-12 relative">
                <div className="grid place-items-center size-12 rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground mb-3 shadow-lg">
                  <s.icon className="size-5" />
                </div>
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{s.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand">{s.price}</span>
                  <Button asChild size="sm" variant="ghost" className="hover:text-brand">
                    <a href={waBooking(s.name)}>Booking <ArrowRight /></a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATALOG PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div {...fadeUp} className="flex items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand mb-2">Katalog Pilihan</p>
            <h2 className="text-3xl lg:text-5xl font-display font-bold">
              Sparepart & <span className="text-gradient-brand">Aksesori</span>
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/katalog">Semua produk <ChevronRight /></Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              {...fadeUp}
              transition={{ delay: i * 0.05 }}
              className="group card-premium rounded-2xl overflow-hidden hover:border-brand/40 transition-all"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img src={p.image} alt={p.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-wider text-accent">{p.category}</p>
                <h3 className="font-medium text-sm mt-1 line-clamp-2 min-h-[2.5rem]">{p.name}</h3>
                <p className="text-sm font-semibold text-brand mt-2">{formatIDR(p.price)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-brand mb-2">Testimoni</p>
          <h2 className="text-3xl lg:text-5xl font-display font-bold">
            Dipercaya <span className="text-gradient-brand">ratusan</span> pelanggan
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "Budi Santoso", rating: 10, text: "Servis cepat, hasil memuaskan. Mobil terasa seperti baru lagi. Sangat rekomen!" },
            { name: "Siti Maharani", rating: 9, text: "Teknisi ramah dan profesional. Harga transparan, tidak ada biaya tersembunyi." },
            { name: "Rizky Pratama", rating: 10, text: "Home service-nya jadi penyelamat. Tetap detail walau di rumah, top!" },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="card-premium rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <Star key={idx} className={`size-3.5 ${idx < t.rating ? "fill-accent text-accent" : "text-muted/30"}`} />
                ))}
              </div>
              <p className="text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-3">
                <div className="grid place-items-center size-9 rounded-full bg-gradient-to-br from-brand to-accent text-brand-foreground font-semibold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">Pelanggan</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl p-10 lg:p-16 text-center"
          style={{ background: "var(--gradient-brand)" }}
        >
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=80")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
          <div className="relative">
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-white">Siap melayani mobil Anda hari ini</h2>
            <p className="mt-3 text-white/90 max-w-xl mx-auto">Booking sekarang via WhatsApp, antrian lebih cepat dan terjamin.</p>
            <Button asChild size="lg" className="mt-6 bg-background text-foreground hover:bg-background/90 h-12 px-7 text-base">
              <a href={waBooking("Konsultasi")}>Hubungi via WhatsApp <ArrowRight /></a>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
