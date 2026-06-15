import { useEffect, useRef, useState } from "react";
import {
  Wrench, Settings, Zap, Droplets, Wind, Shield, Star,
  ArrowRight, ChevronRight, Clock, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    id: "tune-up",
    icon: Settings,
    title: "Tune Up Mesin",
    tagline: "Performa Optimal",
    description: "Perawatan menyeluruh mesin kendaraan meliputi busi, filter udara, filter bahan bakar, dan penyetelan karburator.",
    price: "Mulai Rp 185.000",
    duration: "2–3 jam",
    features: ["Ganti busi", "Filter udara & BBM", "Setel idle mesin", "Test drive"],
    popular: true,
    gradient: "from-amber-500/20 to-orange-500/10",
    accent: "#f59e0b",
  },
  {
    id: "oil",
    icon: Droplets,
    title: "Ganti Oli",
    tagline: "Pelumasan Prima",
    description: "Penggantian oli mesin, oli transmisi, dan oli gardan dengan produk berkualitas OEM & aftermarket premium.",
    price: "Mulai Rp 95.000",
    duration: "30–45 menit",
    features: ["Oli mesin premium", "Filter oli baru", "Cek level cairan", "Laporan kondisi"],
    popular: false,
    gradient: "from-blue-500/15 to-cyan-500/10",
    accent: "#3b82f6",
  },
  {
    id: "brakes",
    icon: Shield,
    title: "Servis Rem",
    tagline: "Keamanan Berkendara",
    description: "Pemeriksaan dan penggantian kampas rem, cakram, dan kaliper untuk keamanan berkendara yang maksimal.",
    price: "Mulai Rp 220.000",
    duration: "1–2 jam",
    features: ["Inspeksi rem lengkap", "Ganti kampas rem", "Bleed minyak rem", "Test performa"],
    popular: false,
    gradient: "from-red-500/15 to-rose-500/10",
    accent: "#ef4444",
  },
  {
    id: "ac",
    icon: Wind,
    title: "Servis AC",
    tagline: "Sejuk Sepanjang Perjalanan",
    description: "Freon, kompressor, kondensor, dan perawatan sistem AC lengkap untuk kenyamanan berkendara.",
    price: "Mulai Rp 150.000",
    duration: "1–3 jam",
    features: ["Cuci evaporator", "Isi freon R134a", "Cek kompresor", "Sterilisasi kabin"],
    popular: false,
    gradient: "from-cyan-500/15 to-teal-500/10",
    accent: "#06b6d4",
  },
  {
    id: "electric",
    icon: Zap,
    title: "Kelistrikan",
    tagline: "Sistem Elektrik Andal",
    description: "Diagnosa dan perbaikan sistem kelistrikan, aki, alternator, starter, dan sensor ECU kendaraan modern.",
    price: "Mulai Rp 75.000",
    duration: "1–4 jam",
    features: ["Scan OBD-II", "Cek aki & alternator", "Perbaikan wiring", "Reset ECU"],
    popular: false,
    gradient: "from-yellow-500/15 to-amber-500/10",
    accent: "#eab308",
  },
  {
    id: "general",
    icon: Wrench,
    title: "Servis Umum",
    tagline: "Perawatan Lengkap",
    description: "Pemeriksaan berkala menyeluruh meliputi 50+ titik inspeksi kendaraan Anda dari kepala hingga kaki.",
    price: "Mulai Rp 350.000",
    duration: "3–5 jam",
    features: ["50+ titik inspeksi", "Laporan digital", "Garansi 30 hari", "Pick-up & antar"],
    popular: false,
    gradient: "from-purple-500/15 to-violet-500/10",
    accent: "#a855f7",
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Icon = service.icon;

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-[#0f0f11] overflow-hidden cursor-pointer transition-all duration-500",
        hovered ? "border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.5)]" : "border-white/[0.07]",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top gradient accent */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          service.gradient
        )}
      />

      {/* Popular badge */}
      {service.popular && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-[10.5px] font-bold text-[#0a0a0a] shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
            <Star size={8} fill="currentColor" /> TERPOPULER
          </div>
        </div>
      )}

      {/* Glow border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${service.accent}22`,
        }}
      />

      <div className="relative z-10 flex flex-col flex-1 p-6">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `${service.accent}18`,
            border: `1px solid ${service.accent}25`,
          }}
        >
          <Icon size={20} style={{ color: service.accent }} strokeWidth={1.8} />
        </div>

        {/* Header */}
        <div className="mb-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-widest mb-1" style={{ color: service.accent }}>
            {service.tagline}
          </p>
          <h3 className="text-[17px] font-bold text-white font-display leading-tight">{service.title}</h3>
        </div>

        {/* Description */}
        <p className="text-[13.5px] text-zinc-500 leading-relaxed mb-5 flex-1">{service.description}</p>

        {/* Features */}
        <ul className="space-y-1.5 mb-5">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-[12.5px] text-zinc-400">
              <CheckCircle2 size={12} className="flex-shrink-0" style={{ color: service.accent }} />
              {f}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex items-end justify-between pt-4 border-t border-white/[0.06]">
          <div>
            <p className="text-[12px] text-zinc-600 mb-0.5">Harga estimasi</p>
            <p className="text-[14px] font-bold text-white font-display">{service.price}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11.5px] text-zinc-600">
            <Clock size={11} />
            {service.duration}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 px-6 pb-5">
        <button
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200",
            "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
            "text-[#0a0a0a]"
          )}
          style={{ background: service.accent }}
          onClick={() => {
            const el = document.querySelector("#contact");
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
          }}
        >
          Booking Layanan Ini
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeaderVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="py-24 md:py-32 bg-[#090909] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-amber-500/[0.025] blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-[350px] h-[350px] rounded-full bg-orange-500/[0.02] blur-[80px]" />
      </div>

      <div ref={sectionRef} className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className={cn(
          "text-center max-w-2xl mx-auto mb-16 transition-all duration-700",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.15] text-amber-400 text-[11.5px] font-semibold tracking-widest uppercase mb-5">
            <Wrench size={11} />
            Layanan Kami
          </div>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] font-black text-white leading-tight tracking-tight mb-4">
            Solusi Lengkap untuk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Kendaraan Anda
            </span>
          </h2>
          <p className="text-[15.5px] text-zinc-500 leading-relaxed">
            Dari perawatan rutin hingga perbaikan kompleks — kami tangani semuanya dengan standar bengkel profesional.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={cn(
          "mt-12 text-center transition-all duration-700 delay-500",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-zinc-500 text-sm mb-4">
            Tidak ada yang cocok? Konsultasikan kebutuhan spesifik kendaraan Anda
          </p>
          <button
            onClick={() => {
              const el = document.querySelector("#contact");
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-amber-400 border border-amber-500/25 hover:bg-amber-500/08 hover:border-amber-500/40 transition-all duration-200"
          >
            Konsultasi Gratis <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}