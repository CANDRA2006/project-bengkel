import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/layout/Hero";
import { Services } from "@/components/layout/Services";
import { Catalog } from "@/components/layout/Catalog";
import { Contact } from "@/components/layout/Contact";
import { Footer } from "@/components/layout/Footer";
import { FloatingWA } from "@/components/layout/FloatingWA";
import { SplashScreen } from "@/components/SplashScreen";
import { useState } from "react";

export function HomePage() {
  const [splash, setSplash] = useState(() => {
    const seen = sessionStorage.getItem("bh_splash_seen");
    return !seen;
  });

  const handleSplashDone = () => {
    sessionStorage.setItem("bh_splash_seen", "1");
    setSplash(false);
  };

  return (
    <>
      {splash && <SplashScreen onDone={handleSplashDone} />}
      <div className="min-h-screen bg-zinc-950 text-white antialiased">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Catalog />
          <Contact />
        </main>
        <Footer />
        <FloatingWA />
      </div>
    </>
  );
}
