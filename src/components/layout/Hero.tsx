import { ArrowRight, Phone, Star, Wrench, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/whatsapp";
import logoBengkel from "../../assets/logo/logo-bengkel.png";

export function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-zinc-950 pt-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,191,36,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="space-y-8">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium">
              <Star size={14} className="fill-amber-400" />
              <span>Bengkel Terpercaya di Pekalongan</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                Spesialis
                <span className="block text-amber-500"> Servis & Modifikasi</span>
                Kendaraan
              </h1>
              <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
                Bengkel Harun hadir dengan teknisi berpengalaman, peralatan modern, dan komitmen terbaik untuk kendaraan Anda. Servis cepat, hasil terpercaya.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "500+", label: "Pelanggan" },
                { value: "2 Thn", label: "Pengalaman" },
                { value: "100%", label: "Garansi" },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <p className="text-2xl font-black text-amber-400">{s.value}</p>
                  <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => scrollTo("#services")} className="gap-2">
                Lihat Layanan <ArrowRight size={16} />
              </Button>
              <a
                href={waLink("Halo Bengkel Harun, saya ingin booking servis.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <Phone size={16} /> Hubungi WA
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Shield size={13} className="text-amber-500" />
                <span>Garansi 30 hari</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wrench size={13} className="text-amber-500" />
                <span>Spare part asli</span>
              </div>
            </div>
          </div>

          {/* Car image — Toyota GT86 / GR86 real photo */}
          <div className="relative flex items-center justify-center">
            {/* Glow behind car */}
            <div className="absolute w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-3xl" />

            <div className="relative w-full max-w-xl">
              {/* Floating card top-left */}
              <div className="absolute -top-4 -left-4 z-10 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-xs font-bold">OK</span>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Status</p>
                    <p className="text-sm font-semibold text-white">Siap Servis</p>
                  </div>
                </div>
              </div>

              {/* Logo Bengkel */}
              <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50">
                <img
                  src={logoBengkel}
                  alt="Logo Bengkel Harun"
                  className="w-full h-[320px] sm:h-[380px] object-contain bg-zinc-900 p-6"
                  loading="eager"
                />
                <div className="bg-zinc-900 px-4 py-3 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 font-medium">
                    Bengkel Harun
                  </p>
                </div>
              </div>

              {/* Floating card bottom-right */}
              <div className="absolute -bottom-4 -right-4 z-10 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-white">4.9</p>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">Rating pelanggan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
