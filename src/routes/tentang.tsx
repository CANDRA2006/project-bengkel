import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Users, Wrench } from "lucide-react";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — Bengkel Harun" },
      { name: "description", content: "Bengkel Harun: bengkel mobil terpercaya di Pekalongan dengan teknisi berpengalaman dan layanan menyeluruh." },
      { property: "og:title", content: "Tentang Bengkel Harun" },
      { property: "og:description", content: "Cerita di balik bengkel mobil terpercaya di Pekalongan." },
    ],
  }),
  component: TentangPage,
});

function TentangPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand mb-2">Tentang Kami</p>
        <h1 className="text-4xl lg:text-6xl font-display font-bold">
          Bengkel <span className="text-gradient-brand">Harun</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Berdiri dari kecintaan terhadap dunia otomotif, Bengkel Harun hadir di Pekalongan
          sebagai bengkel mobil terpercaya yang mengutamakan kualitas, transparansi, dan
          pelayanan ramah. Kami melayani perawatan, perbaikan, sparepart, hingga modifikasi
          untuk semua merk mobil.
        </p>
      </motion.div>

      <div className="mt-16 grid md:grid-cols-3 gap-5">
        {[
          { icon: Award, title: "Kualitas Terjamin", desc: "Sparepart original & teknisi bersertifikat." },
          { icon: Users, title: "Ramah & Transparan", desc: "Harga jelas, konsultasi tanpa biaya." },
          { icon: Wrench, title: "Layanan Menyeluruh", desc: "Dari servis ringan hingga modifikasi besar." },
        ].map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card-premium rounded-2xl p-6"
          >
            <div className="grid place-items-center size-12 rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground mb-4">
              <v.icon className="size-5" />
            </div>
            <h3 className="font-semibold text-lg">{v.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{v.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="aspect-[4/3] rounded-3xl overflow-hidden card-premium"
        >
          <img
            src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1400&q=80"
            alt="Bengkel Harun"
            className="size-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-display font-bold">Komitmen Kami</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Kami percaya bahwa setiap mobil pantas mendapatkan perawatan terbaik. Itulah mengapa
            kami terus berinvestasi pada peralatan modern, pelatihan teknisi, dan layanan
            tambahan seperti home service & emergency service untuk member premium.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { v: "500+", l: "Mobil" },
              { v: "98%", l: "Puas" },
              { v: "24/7", l: "Emergency" },
            ].map((s) => (
              <div key={s.l} className="text-center glass rounded-xl p-4">
                <div className="text-2xl font-display font-bold text-gradient-brand">{s.v}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
