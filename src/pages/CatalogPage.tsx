import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CatalogFull } from "@/components/catalog/CatalogFull";
import { FloatingWA } from "@/components/layout/FloatingWA";

export function CatalogPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <main className="pt-[68px]">
        <CatalogFull />
      </main>
      <Footer />
      <FloatingWA />
    </div>
  );
}
