import { useEffect, useRef, useState } from "react";
import { ArrowRight, Star, Shield, Clock, Zap, ChevronDown, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
  { value: "2.400+", label: "Kendaraan Ditangani", suffix: "" },
  { value: "98", label: "Kepuasan Pelanggan", suffix: "%" },
  { value: "12", label: "Tahun Pengalaman", suffix: "+" },
  { value: "4.9", label: "Rating Google", suffix: "★" },
];

const TRUST_PILLS = [
  { icon: Shield, text: "Garansi 30 Hari" },
  { icon: Zap,    text: "Servis Express 2 Jam" },
  { icon: Clock,  text: "Buka 07.00–21.00" },
];

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const [ready, setReady] = useState(false);

  // Animated particle mesh
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    const PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 55;

    const resize = () => {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const spawn = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.4 + 0.3,
          o: Math.random() * 0.4 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(245,158,11,${0.04 * (1 - dist / 160)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Dots
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,158,11,${p.o})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    spawn();
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  // Staggered entrance
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scrollToServices = () => {
    const el = document.querySelector("#services");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#090909]"
      aria-label="Hero - Bengkel Harun"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[20%] left-[10%] w-[700px] h-[700px] rounded-full bg-amber-500/[0.04] blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-[5%] w-[500px] h-[500px] rounded-full bg-orange-600/[0.03] blur-[100px]" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-amber-400/[0.025] blur-[140px]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient" style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(9,9,9,0.7) 100%)"
        }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Trust indicator */}
          <div
            className={cn(
              "inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.18] mb-8 transition-all duration-700",
              ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
          >
            <span className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill="currentColor" />
              ))}
            </span>
            <span className="text-[12px] font-medium text-amber-300/90 tracking-wide">
              Dipercaya 2.400+ pelanggan di Pekalongan
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>

          {/* Main headline */}
          <h1
            className={cn(
              "font-display text-[clamp(2.6rem,7vw,5.5rem)] font-black leading-[1.06] tracking-[-0.03em] transition-all duration-700 delay-100",
              ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
          >
            <span className="block text-white">Servis Mobil</span>
            <span className="block text-white">Terpercaya di</span>
            <span className="block relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 animate-gradient-shift"
                style={{ backgroundSize: "200% 200%" }}>
                Pekalongan
              </span>
              {/* Underline decoration */}
              <span
                className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full opacity-60"
                style={{ background: "linear-gradient(90deg, transparent, #f59e0b 30%, #f97316 70%, transparent)" }}
              />
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              "mt-8 text-[clamp(0.95rem,2.5vw,1.2rem)] text-zinc-400 leading-relaxed max-w-2xl transition-all duration-700 delay-200",
              ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
          >
            Bengkel profesional dengan teknisi bersertifikat, peralatan modern, dan layanan transparan.
            Kendaraan Anda selesai tepat waktu — <span className="text-amber-400/90 font-medium">dijamin</span>.
          </p>

          {/* Trust pills */}
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-2 mt-6 transition-all duration-700 delay-300",
              ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
          >
            {TRUST_PILLS.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-zinc-400 text-[12.5px] font-medium"
              >
                <Icon size={12} className="text-amber-500 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div
            className={cn(
              "flex flex-col sm:flex-row items-center gap-3 mt-10 transition-all duration-700 delay-400",
              ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
          >
            <button
              onClick={scrollToContact}
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[14.5px] font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_8px_24px_rgba(245,158,11,0.35)] hover:shadow-[0_12px_36px_rgba(245,158,11,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 overflow-hidden"
              aria-label="Booking servis sekarang"
            >
              {/* Shimmer */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
              Booking Servis Sekarang
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button
              onClick={scrollToServices}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14.5px] font-semibold text-zinc-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:text-white hover:border-white/[0.14] transition-all duration-200"
            >
              Lihat Layanan
            </button>
          </div>

          {/* Stats row */}
          <div
            className={cn(
              "grid grid-cols-2 md:grid-cols-4 gap-px mt-16 w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.07] transition-all duration-700 delay-500",
              ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
          >
            {STATS.map(({ value, label, suffix }, i) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center py-5 px-4 bg-[#0d0d0f] hover:bg-[#111114] transition-colors duration-200"
              >
                <span className="font-display font-black text-[clamp(1.4rem,3vw,2rem)] tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  {value}{suffix}
                </span>
                <span className="text-[11.5px] text-zinc-500 mt-1.5 font-medium text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 hover:opacity-70 transition-opacity cursor-pointer" onClick={scrollToServices}>
        <span className="text-[11px] text-zinc-500 tracking-widest uppercase font-medium">Scroll</span>
        <ChevronDown size={16} className="text-zinc-500 animate-bounce" />
      </div>
    </section>
  );
}