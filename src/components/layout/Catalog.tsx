import { useEffect, useRef, useState, useCallback } from "react";
import { Search, SlidersHorizontal, Star, ShoppingCart, Heart, X, Fuel, Gauge, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import oliShell from "@/assets/katalog/oli-shell.webp";
import filterUdara from "@/assets/katalog/filter-udara.jpg";
import busi from "@/assets/katalog/busi.jpg";
import kampasRem from "@/assets/katalog/kampas-rem-depan.jpg";
import aki from "@/assets/katalog/aki-gs.jpeg";
import dashcam from "@/assets/katalog/dashcam.webp";
import perEibach from "@/assets/katalog/per-eibach.jpg";
import shockBreaker from "@/assets/katalog/shock-breaker.jpg";

/* ─── Types ─────────────────────────────────────────────────────── */
interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  badgeColor?: "amber" | "green" | "red" | "blue";
  tags: string[];
  specs?: { label: string; value: string }[];
}

/* ─── Mock data ──────────────────────────────────────────────────── */
const PRODUCTS: Product[] = [
  { id:1, name:"Oli Mesin Castrol EDGE 5W-30", category:"Oli", brand:"Castrol", price:285000, originalPrice:320000, rating:4.9, reviews:312, image:oliShell, badge:"Best Seller", badgeColor:"amber", tags:["oli","mesin","castrol"], specs:[{label:"Viskositas",value:"5W-30"},{label:"Volume",value:"4 Liter"},{label:"Tipe",value:"Full Synthetic"}] },
  { id:2, name:"Filter Udara Racing K&N", category:"Filter", brand:"K&N", price:420000, rating:4.8, reviews:156, image:filterUdara, badge:"Premium", badgeColor:"blue", tags:["filter","udara","performance"], specs:[{label:"Tipe",value:"Oiled Cotton"},{label:"Fitting",value:"Universal"},{label:"Garansi",value:"1.000.000 km"}] },
  { id:3, name:"Busi NGK Iridium IX", category:"Busi", brand:"NGK", price:95000, originalPrice:115000, rating:4.7, reviews:489, image:busi, badge:"Hemat 17%", badgeColor:"green", tags:["busi","iridium","ngk"], specs:[{label:"Tipe",value:"Iridium"},{label:"Heat Range",value:"6"},{label:"Gap",value:"1.1mm"}] },
  { id:4, name:"Kampas Rem Ate Ceramic", category:"Rem", brand:"ATE", price:185000, rating:4.8, reviews:203, image:kampasRem, badge:"OEM Quality", badgeColor:"blue", tags:["rem","kampas","ceramic"], specs:[{label:"Material",value:"Ceramic"},{label:"Posisi",value:"Depan"},{label:"Ketebalan",value:"15mm"}] },
  { id:5, name:"Aki Yuasa YTX14", category:"Aki", brand:"Yuasa", price:850000, originalPrice:950000, rating:4.9, reviews:87, image:aki, badge:"Top Pick", badgeColor:"amber", tags:["aki","battery","yuasa"], specs:[{label:"Kapasitas",value:"14 Ah"},{label:"CCA",value:"200A"},{label:"Garansi",value:"1 Tahun"}] },
  { id:6, name:"Freon AC R134a 250g", category:"AC", brand:"DuPont", price:65000, rating:4.6, reviews:274, image:dashcam, tags:["freon","ac","r134a"], specs:[{label:"Tipe",value:"R134a"},{label:"Berat",value:"250 gram"},{label:"GWP",value:"1430"}] },
  { id:7, name:"Timing Belt Gates Ultra", category:"Engine", brand:"Gates", price:280000, rating:4.7, reviews:132, image:perEibach, badge:"OEM Spec", badgeColor:"blue", tags:["timing","belt","gates"], specs:[{label:"Material",value:"HNBR Rubber"},{label:"Teeth",value:"124T"},{label:"Width",value:"25.4mm"}] },
  { id:8, name:"Shockbreaker Bilstein B4", category:"Suspensi", brand:"Bilstein", price:1250000, originalPrice:1450000, rating:4.9, reviews:64, image:shockBreaker, badge:"Premium", badgeColor:"amber", tags:["shockbreaker","suspensi","bilstein"], specs:[{label:"Tipe",value:"Monotube"},{label:"Tekanan",value:"N2 Gas"},{label:"Garansi",value:"2 Tahun"}] },
];

const CATEGORIES = ["Semua", "Oli", "Filter", "Busi", "Rem", "Aki", "AC", "Engine", "Suspensi"];

const BADGE_COLORS = {
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  green: "bg-green-500/12 text-green-400 border-green-500/20",
  red:   "bg-red-500/12 text-red-400 border-red-500/20",
  blue:  "bg-blue-500/12 text-blue-400 border-blue-500/20",
};

/* ─── Skeleton ───────────────────────────────────────────────────── */
function ProductSkeleton() {
  return (
    <div className="rounded-2xl bg-[#0f0f11] border border-white/[0.06] overflow-hidden animate-pulse">
      <div className="h-[160px] bg-zinc-900/80" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-zinc-800 rounded-full w-1/3" />
        <div className="h-4 bg-zinc-800 rounded-full w-3/4" />
        <div className="h-3 bg-zinc-800 rounded-full w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-zinc-800 rounded-full w-24" />
          <div className="h-8 w-8 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── 3D Tilt card ───────────────────────────────────────────────── */
function ProductCard({ product, onAddToCart, inWishlist, onWishlist }: {
  product: Product;
  onAddToCart: (p: Product) => void;
  inWishlist: boolean;
  onWishlist: (id: number) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 });
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * 10;
    const ry = ((x / rect.width) - 0.5) * -10;
    const gx = (x / rect.width) * 100;
    const gy = (y / rect.height) * 100;
    setTilt({ x: rx, y: ry, gx, gy });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, gx: 50, gy: 50 });
  }, []);

  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [product, onAddToCart]);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-2xl bg-[#0f0f11] border border-white/[0.07] overflow-hidden cursor-pointer group transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${visible ? "" : "translateY(32px)"}`,
        transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.6s, border-color 0.25s, box-shadow 0.25s",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Specular highlight on 3D tilt */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
        }}
      />

      {/* Image area */}
      <div className="relative h-[152px] flex items-center justify-center bg-gradient-to-b from-zinc-900/60 to-zinc-900/20 border-b border-white/[0.05] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Wishlist */}
        <button
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200",
            inWishlist
              ? "bg-red-500/20 border border-red-500/30 text-red-400"
              : "bg-black/40 border border-white/10 text-zinc-500 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100"
          )}
          onClick={(e) => { e.stopPropagation(); onWishlist(product.id); }}
          aria-label={inWishlist ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        >
          <Heart size={13} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* Badge */}
        {product.badge && (
          <div className={cn(
            "absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold border",
            BADGE_COLORS[product.badgeColor ?? "amber"]
          )}>
            {product.badge}
          </div>
        )}

        {/* Discount pill */}
        {discount > 0 && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/25">
            -{discount}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10.5px] text-zinc-600 font-semibold uppercase tracking-wider mb-1">{product.brand} · {product.category}</p>
        <h3 className="text-[14px] font-semibold text-zinc-100 leading-snug mb-2 line-clamp-2">{product.name}</h3>

        {/* Specs (show 2) */}
        {product.specs && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.specs.slice(0, 2).map((s) => (
              <span key={s.label} className="text-[10.5px] text-zinc-600 bg-zinc-900 border border-white/[0.06] px-2 py-0.5 rounded-md">
                {s.label}: <span className="text-zinc-400">{s.value}</span>
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.floor(product.rating) ? "text-amber-400" : "text-zinc-700"}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-[11.5px] text-zinc-400 font-medium">{product.rating}</span>
          <span className="text-[11px] text-zinc-700">({product.reviews.toLocaleString("id")})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[15px] font-bold text-white font-display">
              Rp {product.price.toLocaleString("id")}
            </div>
            {product.originalPrice && (
              <div className="text-[11px] text-zinc-600 line-through">
                Rp {product.originalPrice.toLocaleString("id")}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 flex-shrink-0",
              added
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-[#0a0a0a] hover:border-amber-500 hover:shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
            )}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <ShoppingCart size={12} />
            {added ? "✓ Ditambahkan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Catalog ───────────────────────────────────────────────── */
export function Catalog() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("Semua");
  const [sortBy, setSortBy]     = useState("popular");
  const [loading, setLoading]   = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [toast, setToast]       = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeaderVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = PRODUCTS
    .filter((p) =>
      (category === "Semua" || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.brand.toLowerCase().includes(search.toLowerCase()) ||
       p.tags.some((t) => t.includes(search.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating")     return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const addToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
    setToast(`${product.name} ditambahkan ke keranjang`);
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <section id="catalog" className="py-24 md:py-32 bg-[#080809] relative overflow-hidden">
      {/* BG decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-amber-500/[0.02] blur-[120px]" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div
          ref={headerRef}
          className={cn(
            "text-center max-w-2xl mx-auto mb-12 transition-all duration-700",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.15] text-amber-400 text-[11.5px] font-semibold tracking-widest uppercase mb-5">
            <ShoppingCart size={11} />
            Katalog Produk
          </div>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] font-black text-white leading-tight tracking-tight mb-4">
            Sparepart &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Aksesori Mobil
            </span>
          </h2>
          <p className="text-[15.5px] text-zinc-500">
            Produk original dan berkualitas tinggi dengan harga terbaik — garansi resmi.
          </p>
        </div>

        {/* Controls */}
        <div className={cn(
          "flex flex-col md:flex-row gap-3 mb-8 transition-all duration-700 delay-200",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}>
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
            <input
              type="search"
              placeholder="Cari produk, brand, kategori…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111113] border border-white/[0.08] text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl bg-[#111113] border border-white/[0.08] text-sm text-zinc-300 focus:outline-none focus:border-amber-500/40 appearance-none cursor-pointer transition-all hover:border-white/15"
              style={{ backgroundImage: "none" }}
            >
              <option value="popular">Terpopuler</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Category filter */}
        <div className={cn(
          "flex flex-wrap gap-2 mb-8 transition-all duration-700 delay-300",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200",
                category === cat
                  ? "bg-amber-500 text-[#0a0a0a] font-bold shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
                  : "bg-[#111113] border border-white/[0.07] text-zinc-400 hover:text-zinc-200 hover:border-white/15"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results info */}
        {!loading && (
          <p className="text-xs text-zinc-600 mb-5 transition-all">
            Menampilkan <span className="text-zinc-400 font-medium">{filtered.length}</span> produk
            {search && <> untuk "<span className="text-zinc-400">{search}</span>"</>}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : filtered.length > 0
            ? filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={addToCart}
                  inWishlist={wishlist.includes(p.id)}
                  onWishlist={toggleWishlist}
                />
              ))
            : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center mb-4">
                  <Search size={24} className="text-zinc-700" />
                </div>
                <p className="text-zinc-400 font-medium mb-1">Produk tidak ditemukan</p>
                <p className="text-sm text-zinc-600">Coba kata kunci lain atau pilih kategori berbeda</p>
                <button
                  onClick={() => { setSearch(""); setCategory("Semua"); }}
                  className="mt-4 px-4 py-2 rounded-xl text-sm text-amber-400 border border-amber-500/20 hover:bg-amber-500/08 transition-all"
                >
                  Reset Filter
                </button>
              </div>
            )
          }
        </div>

        {/* Cart summary floating */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#141416]/95 backdrop-blur-xl border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-slide-up">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
              <ShoppingCart size={14} className="text-[#0a0a0a]" />
            </div>
            <span className="text-sm font-medium text-zinc-300">
              <span className="text-white font-bold">{cartItems.length}</span> item dalam keranjang
            </span>
            <button
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-[#0a0a0a] text-[12px] font-bold hover:bg-amber-400 transition-colors"
              onClick={() => {
                const el = document.querySelector("#contact");
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
              }}
            >
              Checkout
            </button>
            <button
              onClick={() => setCartItems([])}
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
              aria-label="Kosongkan keranjang"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed bottom-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#18181b] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-sm text-zinc-300 animate-slide-up max-w-[280px]"
        >
          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 text-[10px]">✓</span>
          </div>
          <span className="line-clamp-2">{toast}</span>
        </div>
      )}
    </section>
  );
}