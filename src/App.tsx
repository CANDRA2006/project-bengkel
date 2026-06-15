import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "./components/layout/Hero";
import { Services } from "@/components/layout/Services";
import { Catalog } from "@/components/layout/Catalog";
import { Contact } from "@/components/layout/Contact";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Toaster position="top-right" theme="dark" />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Catalog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
