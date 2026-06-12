import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMemo, useState, type MouseEvent } from "react";
import { Search, ShoppingCart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products, formatIDR, type Product } from "@/lib/data/products";
import { waOrder } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/katalog")({
  head: () => ({
    meta: [
      { title: "Katalog Sparepart & Aksesoris — Bengkel Harun" },
      { name: "description", content: "Sparepart, aksesoris, dan bahan modifikasi mobil dengan harga pasaran. Pesan langsung via WhatsApp." },
      { property: "og:title", content: "Katalog — Bengkel Harun" },
      { property: "og:description", content: "Sparepart, aksesoris, dan bahan modifikasi mobil berkualitas." },
    ],
  }),
  component: KatalogPage,
});

type Filter = "Semua" | "Aksesoris" | "Spare Part";

const FILTERS: Filter[] = ["Semua", "Aksesoris", "Spare Part"];

function matchFilter(p: Product, f: Filter) {
  if (f === "Semua") return true;
  if (f === "Aksesoris") return p.category === "Aksesori";
  // Spare Part includes Suku Cadang + Bahan Modifikasi
  return p.category === "Suku Cadang" || p.category === "Bahan Modifikasi";
}

function KatalogPage() {
  const [filter, setFilter] = useState<Filter>("Semua");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const okQ = q.trim() === "" || p.name.toLowerCase().includes(q.toLowerCase());
        return matchFilter(p, filter) && okQ;
      }),
    [filter, q],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand mb-2">Katalog Produk Interaktif</p>
        <h1 className="text-4xl lg:text-6xl font-display font-bold">
          Sparepart & <span className="text-gradient-brand">Aksesoris</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Pilihan lengkap dengan harga pasaran terkini. Hover untuk merasakan animasi cinematic, klik untuk pesan via WhatsApp.
        </p>
      </motion.div>

      {/* Toolbar */}
      <div className="mt-10 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((c) => {
            const count = c === "Semua" ? products.length : products.filter((p) => matchFilter(p, c)).length;
            return (
              <motion.button
                key={c}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(c)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all inline-flex items-center gap-2",
                  filter === c
                    ? "bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow"
                    : "glass hover:border-brand/40",
                )}
              >
                <Tag className="size-3.5" /> {c}
                <span className="text-[10px] opacity-70">({count})</span>
              </motion.button>
            );
          })}
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 glass border-border"
          />
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="mt-10 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          Tidak ada produk yang cocok dengan pencarian Anda.
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  // Mouse-follow glow + 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 150, damping: 15 });
  const glowX = useTransform(mouseX, (v) => `${v * 100}%`);
  const glowY = useTransform(mouseY, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(circle 200px at ${glowX} ${glowY}, hsl(var(--brand)/0.35), transparent 70%)`;

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }
  function onLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.5), type: "spring", stiffness: 100 }}
      whileHover={{ y: -6 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className="group relative card-premium rounded-2xl overflow-hidden hover:border-brand/50 transition-colors flex flex-col"
    >
      {/* Cursor-follow glow overlay */}
      <motion.div
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      />

      <div className="aspect-square overflow-hidden bg-secondary relative">
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover"
          whileHover={{ scale: 1.15, rotate: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Top badge */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-2 right-2 glass-strong rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider z-20"
        >
          {product.category}
        </motion.div>
        {/* Scanline shimmer on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
      </div>

      <div className="p-4 flex-1 flex flex-col relative z-20" style={{ transform: "translateZ(20px)" }}>
        <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Harga</p>
            <p className="text-base font-bold text-gradient-brand">{formatIDR(product.price)}</p>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="mt-3 bg-[#25D366] text-white hover:bg-[#1faa54] w-full group/btn"
        >
          <a href={waOrder(product.name)} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="size-3.5 mr-1 transition-transform group-hover/btn:scale-110" />
            Pesan via WhatsApp
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
