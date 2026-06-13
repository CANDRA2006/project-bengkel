import { useState, useRef, useCallback } from "react";
import { ShoppingCart, Eye } from "lucide-react";
import { products, categories, formatIDR, type ProductCategory } from "@/lib/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { waOrder } from "@/lib/whatsapp";
import { useAuth } from "@/hooks/useAuth";
function use3DRotate() {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const current = useRef({ rx: 0, ry: 0 });
  const target = useRef({ rx: 0, ry: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    target.current = {
      rx: ((e.clientY - cy) / (rect.height / 2)) * -12,
      ry: ((e.clientX - cx) / (rect.width / 2)) * 12,
    };
    if (!raf.current) {
      const animate = () => {
        current.current.rx += (target.current.rx - current.current.rx) * 0.1;
        current.current.ry += (target.current.ry - current.current.ry) * 0.1;
        if (ref.current) {
          ref.current.style.transform = `perspective(800px) rotateX(${current.current.rx}deg) rotateY(${current.current.ry}deg) scale3d(1.02,1.02,1.02)`;
        }
        const diff = Math.abs(current.current.rx - target.current.rx) + Math.abs(current.current.ry - target.current.ry);
        if (diff > 0.05) {
          raf.current = requestAnimationFrame(animate);
        } else {
          raf.current = null;
        }
      };
      raf.current = requestAnimationFrame(animate);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    target.current = { rx: 0, ry: 0 };
    const animate = () => {
      current.current.rx += (0 - current.current.rx) * 0.12;
      current.current.ry += (0 - current.current.ry) * 0.12;
      if (ref.current) {
        ref.current.style.transform = `perspective(800px) rotateX(${current.current.rx}deg) rotateY(${current.current.ry}deg)`;
      }
      const diff = Math.abs(current.current.rx) + Math.abs(current.current.ry);
      if (diff > 0.05) {
        raf.current = requestAnimationFrame(animate);
      } else {
        if (ref.current) ref.current.style.transform = "";
        raf.current = null;
      }
    };
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(animate);
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}

function ProductCard({ p, isPremium, onPreview }: {
  p: typeof products[0];
  isPremium: boolean;
  onPreview: (p: typeof products[0]) => void;
}) {
  const { ref, handleMouseMove, handleMouseLeave } = use3DRotate();
  const price = isPremium ? Math.floor(p.price * 0.9) : p.price;

  return (
    <div
      className="group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "800px" }}
    >
      <div
        ref={ref}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-100 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-48 bg-zinc-800">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
            <button
              onClick={() => onPreview(p)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label="Preview"
            >
              <Eye size={16} />
            </button>
            <a
              href={waOrder(p.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-amber-500/80 backdrop-blur-sm flex items-center justify-center text-black hover:bg-amber-500 transition-colors"
              aria-label="Order"
            >
              <ShoppingCart size={16} />
            </a>
          </div>
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="text-[10px] backdrop-blur-sm bg-black/60 border-zinc-700">
              {p.category}
            </Badge>
          </div>
          {isPremium && (
            <div className="absolute top-3 right-3">
              <Badge variant="amber" className="text-[10px]">-10%</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">{p.name}</h3>
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{p.description}</p>
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-base font-bold text-amber-400">{formatIDR(price)}</p>
              {isPremium && (
                <p className="text-xs text-zinc-600 line-through">{formatIDR(p.price)}</p>
              )}
            </div>
            <a
              href={waOrder(p.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              Pesan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ product, open, onClose, isPremium }: {
  product: typeof products[0] | null;
  open: boolean;
  onClose: () => void;
  isPremium: boolean;
}) {
  if (!product) return null;
  const price = isPremium ? Math.floor(product.price * 0.9) : product.price;
  return (
    <Modal open={open} onClose={onClose} title={product.name} size="md">
      <div className="space-y-5">
        <div className="rounded-xl overflow-hidden h-56 bg-zinc-800">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-2">
          <Badge variant="default">{product.category}</Badge>
          <p className="text-sm text-zinc-300 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <div>
            <p className="text-xl font-black text-amber-400">{formatIDR(price)}</p>
            {isPremium && (
              <p className="text-xs text-zinc-500 line-through">{formatIDR(product.price)}</p>
            )}
          </div>
          <a href={waOrder(product.name)} target="_blank" rel="noopener noreferrer">
            <Button size="md" className="gap-2">
              <ShoppingCart size={15} /> Order via WA
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
}

export function Catalog() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "Semua">("Semua");
  const [preview, setPreview] = useState<typeof products[0] | null>(null);
  const isPremium = user?.membershipTier === "premium";

  const filtered =
    activeCategory === "Semua"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="catalog" className="py-20 lg:py-28 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="amber" className="mb-4">Katalog</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Produk <span className="text-amber-500">Pilihan</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Spare part, aksesori, dan bahan modifikasi berkualitas dengan harga kompetitif. Hover kartu untuk efek 3D.
          </p>
          {isPremium && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
              Harga sudah dipotong diskon 10% member
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(["Semua", ...categories] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              isPremium={isPremium}
              onPreview={setPreview}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            Tidak ada produk di kategori ini.
          </div>
        )}
      </div>

      <PreviewModal
        product={preview}
        open={!!preview}
        onClose={() => setPreview(null)}
        isPremium={isPremium}
      />
    </section>
  );
}
