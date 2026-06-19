import { useState, useRef, useCallback } from "react";
import { Search, ShoppingCart, Heart, Star, SlidersHorizontal, X, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { products, categories, formatIDR, type Product, type ProductCategory } from "@/lib/data/products";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Harga: Terendah" },
  { value: "price-desc", label: "Harga: Tertinggi" },
  { value: "name-asc", label: "Nama: A-Z" },
];

const CATEGORY_ALL = "Semua";

function ProductCard({ product }: { product: Product }) {
  const { user, addToCart, cart } = useAuth();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const inCart = cart.some((i) => i.productId === product.id);
  const cartItem = cart.find((i) => i.productId === product.id);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const handleAddToCart = () => {
    if (!user) { setAuthModal(true); return; }
    addToCart({ productId: product.id, name: product.name, price: product.price, qty: 1, image: product.image, category: product.category });
    setJustAdded(true);
    toast.success(`${product.name} ditambahkan ke keranjang`, { description: "Cek keranjang untuk checkout" });
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-2xl bg-zinc-900/80 border border-white/[0.06] overflow-hidden hover:border-amber-500/20 transition-all duration-300"
        style={{ transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transition: "transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s" }}
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-zinc-800">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />

          {/* Wishlist */}
          <button
            onClick={() => setWishlist((v) => !v)}
            className={cn("absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm",
              wishlist ? "bg-red-500 text-white" : "bg-black/40 text-white/60 hover:bg-black/60 hover:text-white")}
          >
            <Heart size={14} fill={wishlist ? "currentColor" : "none"} />
          </button>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/80 text-black backdrop-blur-sm">{product.category}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white group-hover:text-amber-300/90 transition-colors leading-snug mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-zinc-500 line-clamp-2 mb-3 leading-relaxed">{product.description}</p>

          {/* Rating mock */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < 4 ? "text-amber-400 fill-amber-400" : "text-zinc-600"} />
            ))}
            <span className="text-[10px] text-zinc-500 ml-1">4.{Math.floor(Math.random() * 3 + 7)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-amber-400">{formatIDR(product.price)}</p>
              {inCart && <p className="text-[10px] text-zinc-500 mt-0.5">×{cartItem?.qty} di keranjang</p>}
            </div>
            <button
              onClick={handleAddToCart}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200",
                justAdded
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 hover:shadow-[0_4px_12px_rgba(245,158,11,0.2)]"
              )}
            >
              {justAdded ? <><Check size={12} /> Ditambah</> : <><ShoppingCart size={12} /> Tambah</>}
            </button>
          </div>
        </div>
      </div>

      <AuthModal open={authModal} onClose={() => setAuthModal(false)} defaultMode="login" />
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.05] overflow-hidden animate-pulse">
      <div className="h-44 bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-zinc-800 rounded w-1/3" />
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-zinc-800 rounded w-24" />
          <div className="h-8 w-24 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CatalogFull() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | typeof CATEGORY_ALL>(CATEGORY_ALL);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading] = useState(false);

  const allCats = [CATEGORY_ALL, ...categories];

  const filtered = products
    .filter((p) => activeCategory === CATEGORY_ALL || p.category === activeCategory)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <section className="min-h-[calc(100vh-68px)] bg-zinc-950 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">Katalog Produk</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Sparepart & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Aksesori</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
            Temukan produk berkualitas OEM dan aftermarket premium untuk kendaraan Anda
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/40 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-zinc-900 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/40 cursor-pointer min-w-[160px]"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {allCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                activeCategory === cat
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_4px_12px_rgba(245,158,11,0.12)]"
                  : "bg-zinc-900/60 text-zinc-400 border border-white/[0.06] hover:text-zinc-200 hover:border-white/[0.12]"
              )}
            >
              {cat}
              {cat !== CATEGORY_ALL && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({products.filter((p) => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-zinc-500">
            Menampilkan <span className="text-zinc-300 font-medium">{filtered.length}</span> produk
            {activeCategory !== CATEGORY_ALL && <> di <span className="text-amber-400">{activeCategory}</span></>}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center mb-4">
              <Search size={24} className="text-zinc-600" />
            </div>
            <p className="text-zinc-400 font-medium mb-2">Produk tidak ditemukan</p>
            <p className="text-zinc-600 text-sm">Coba kata kunci atau kategori lain</p>
            <button onClick={() => { setSearch(""); setActiveCategory(CATEGORY_ALL); }} className="mt-4 text-amber-400 hover:text-amber-300 text-sm transition-colors">Reset filter</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
