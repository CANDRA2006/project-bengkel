import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MembershipFull } from "@/components/membership/MembershipFull";
import { FloatingWA } from "@/components/layout/FloatingWA";

export function MembershipPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <main className="pt-[68px]">
        <MembershipFull />
      </main>
      <Footer />
      <FloatingWA />
    </div>
  );
}
