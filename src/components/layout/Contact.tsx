import { useState, useRef, useEffect } from "react";
import {
  Calendar, Clock, Car, Wrench, Phone, User, MessageSquare,
  CheckCircle, MapPin, ChevronRight, Loader2, Send, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

const STEPS = ["Layanan", "Jadwal", "Konfirmasi"] as const;

const SERVICES_OPTIONS = [
  { value: "tune-up",  label: "Tune Up Mesin",   icon: "Wrench" },
  { value: "oli",      label: "Ganti Oli",        icon: "Droplets" },
  { value: "rem",      label: "Servis Rem",       icon: "Circle" },
  { value: "ac",       label: "Servis AC",        icon: "Wind" },
  { value: "listrik",  label: "Kelistrikan",      icon: "Zap" },
  { value: "umum",     label: "Servis Umum",      icon: "Settings" },
  { value: "lainnya",  label: "Lainnya…",         icon: "MessageSquare" },
];

const TIME_SLOTS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "13:00", "13:30", "14:00",
  "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

const BOOKED = ["09:00", "13:30"]; // simulate booked slots

const schema = z.object({
  name:        z.string().min(2, "Nama minimal 2 karakter"),
  phone:       z.string().min(9, "Nomor tidak valid").max(15),
  carType:     z.string().min(2, "Isi tipe kendaraan"),
  carPlate:    z.string().min(4, "Pelat minimal 4 karakter").max(10),
  service:     z.string().min(1, "Pilih layanan"),
  date:        z.string().min(1, "Pilih tanggal"),
  time:        z.string().min(1, "Pilih waktu"),
  notes:       z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const INFO_BLOCKS = [
  {
    icon: MapPin,
    title: "Lokasi Bengkel",
    lines: ["Jl. Raya Klego No. 45", "Pekalongan, Jawa Tengah 51111"],
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    lines: ["Senin – Sabtu: 07.00 – 21.00", "Minggu & Libur: 08.00 – 17.00"],
  },
  {
    icon: Phone,
    title: "Hubungi Kami",
    lines: ["WhatsApp: 0812-3456-7890", "Telepon: (0285) 412-3456"],
  },
];

export function Contact() {
  const { user } = useAuth();
  const sectionRef  = useRef<HTMLDivElement>(null);
  const [visible, setVisible]   = useState(false);
  const [step, setStep]         = useState(0);
  const [done, setDone]         = useState(false);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:  user?.fullName ?? "",
      phone: user?.phone ?? "",
      service: "",
      date: "",
      time: "",
    },
  });

  const service  = watch("service");
  const date     = watch("date");
  const name     = watch("name");
  const phone    = watch("phone");
  const carType  = watch("carType");
  const carPlate = watch("carPlate");

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/bookings", data),
    onSuccess: () => setDone(true),
  });

  const goNext = async () => {
    const fields: (keyof FormData)[][] = [
      ["service", "name", "phone", "carType", "carPlate"],
      ["date", "time"],
    ];
    const ok = await trigger(fields[step]);
    if (ok) setStep((s) => s + 1);
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate({ ...data, time: selectedTime });
  };

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#080809] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-amber-500/[0.025] blur-[100px]" />
      </div>

      <div ref={sectionRef} className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className={cn(
          "text-center max-w-2xl mx-auto mb-14 transition-all duration-700",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.15] text-amber-400 text-[11.5px] font-semibold tracking-widest uppercase mb-5">
            <Calendar size={11} />
            Booking Servis
          </div>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] font-black text-white leading-tight tracking-tight mb-4">
            Jadwalkan Servis{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Sekarang
            </span>
          </h2>
          <p className="text-[15.5px] text-zinc-500">
            Proses mudah dalam 3 langkah — konfirmasi langsung via WhatsApp.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* Form card */}
          <div className={cn(
            "rounded-2xl border border-white/[0.08] bg-[#0d0d0f] overflow-hidden transition-all duration-700 delay-150",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>

            {done ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center text-center py-20 px-8">
                <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mb-6 animate-zoom-in">
                  <CheckCircle size={36} className="text-green-400" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">Booking Berhasil!</h3>
                <p className="text-zinc-500 text-sm max-w-sm mb-6">
                  Terima kasih, <span className="text-zinc-300 font-medium">{name}</span>! Kami akan segera menghubungi Anda di{" "}
                  <span className="text-amber-400">{phone}</span> untuk konfirmasi jadwal.
                </p>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-400 mb-8">
                  <p><span className="text-zinc-500">Layanan:</span> {SERVICES_OPTIONS.find(s => s.value === service)?.label}</p>
                  <p><span className="text-zinc-500">Tanggal:</span> {date} pukul {selectedTime}</p>
                  <p><span className="text-zinc-500">Kendaraan:</span> {carType} ({carPlate})</p>
                </div>
                <button
                  onClick={() => { setDone(false); setStep(0); setSelectedTime(""); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-amber-400 border border-amber-500/25 hover:bg-amber-500/08 transition-all"
                >
                  Booking Servis Lain
                </button>
              </div>
            ) : (
              <>
                {/* Step indicator */}
                <div className="flex items-center px-6 pt-6 pb-5 border-b border-white/[0.06]">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center flex-1 last:flex-initial">
                      <div className={cn(
                        "flex items-center gap-2 transition-all duration-300",
                        i < step ? "opacity-100" : i === step ? "opacity-100" : "opacity-40"
                      )}>
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all duration-300",
                          i < step
                            ? "bg-green-500/20 border border-green-500/30 text-green-400"
                            : i === step
                            ? "bg-amber-500 text-[#0a0a0a]"
                            : "bg-zinc-800 border border-white/[0.08] text-zinc-500"
                        )}>
                          {i < step ? "✓" : i + 1}
                        </div>
                        <span className={cn(
                          "text-[12.5px] font-medium hidden sm:block",
                          i === step ? "text-white" : "text-zinc-600"
                        )}>
                          {s}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn(
                          "flex-1 mx-3 h-px transition-all duration-500",
                          i < step ? "bg-green-500/30" : "bg-white/[0.06]"
                        )} />
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="p-6 space-y-5">

                    {/* STEP 0: Service + personal */}
                    {step === 0 && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                            Pilih Layanan *
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {SERVICES_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setValue("service", opt.value, { shouldValidate: true })}
                                className={cn(
                                  "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-[12px] font-medium border transition-all duration-200",
                                  service === opt.value
                                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                                    : "border-white/[0.07] bg-white/[0.02] text-zinc-400 hover:border-white/15 hover:text-zinc-200"
                                )}
                              >
                                <span className="text-xl leading-none" aria-hidden="true">{opt.icon}</span>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          {errors.service && (
                            <p className="text-xs text-red-400 mt-1.5">{errors.service.message}</p>
                          )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                              Nama Lengkap *
                            </label>
                            <div className="relative">
                              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                              <input
                                {...register("name")}
                                placeholder="John Doe"
                                className={cn(
                                  "w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-all",
                                  errors.name
                                    ? "border-red-500/40 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                                    : "border-white/[0.08] focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10"
                                )}
                              />
                            </div>
                            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                              No. WhatsApp *
                            </label>
                            <div className="relative">
                              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                              <input
                                {...register("phone")}
                                type="tel"
                                placeholder="0812-xxxx-xxxx"
                                className={cn(
                                  "w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-all",
                                  errors.phone
                                    ? "border-red-500/40 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                                    : "border-white/[0.08] focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10"
                                )}
                              />
                            </div>
                            {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                              Tipe Kendaraan *
                            </label>
                            <div className="relative">
                              <Car size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                              <input
                                {...register("carType")}
                                placeholder="cth. Toyota Avanza 2019"
                                className={cn(
                                  "w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-all",
                                  errors.carType
                                    ? "border-red-500/40 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                                    : "border-white/[0.08] focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10"
                                )}
                              />
                            </div>
                            {errors.carType && <p className="text-xs text-red-400 mt-1">{errors.carType.message}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                              Pelat Nomor *
                            </label>
                            <input
                              {...register("carPlate")}
                              placeholder="cth. G 1234 AB"
                              className={cn(
                                "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-all uppercase",
                                errors.carPlate
                                  ? "border-red-500/40 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                                  : "border-white/[0.08] focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10"
                              )}
                            />
                            {errors.carPlate && <p className="text-xs text-red-400 mt-1">{errors.carPlate.message}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                            Catatan Tambahan
                          </label>
                          <div className="relative">
                            <MessageSquare size={14} className="absolute left-3 top-3 text-zinc-600 pointer-events-none" />
                            <textarea
                              {...register("notes")}
                              rows={2}
                              placeholder="Keluhan atau permintaan khusus…"
                              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10 transition-all resize-none"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* STEP 1: Date + Time */}
                    {step === 1 && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                            Tanggal Servis *
                          </label>
                          <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                            <input
                              {...register("date")}
                              type="date"
                              min={today}
                              className={cn(
                                "w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-zinc-100 focus:outline-none transition-all cursor-pointer",
                                errors.date
                                  ? "border-red-500/40"
                                  : "border-white/[0.08] focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10"
                              )}
                            />
                          </div>
                          {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date.message}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                            Jam Kedatangan *
                          </label>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {TIME_SLOTS.map((t) => {
                              const booked = BOOKED.includes(t);
                              const selected = selectedTime === t;
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  disabled={booked}
                                  onClick={() => { setSelectedTime(t); setValue("time", t, { shouldValidate: true }); }}
                                  className={cn(
                                    "py-2 rounded-xl text-[12.5px] font-medium border transition-all duration-150",
                                    booked
                                      ? "bg-zinc-900 border-white/[0.04] text-zinc-700 cursor-not-allowed line-through"
                                      : selected
                                      ? "bg-amber-500 border-amber-500 text-[#0a0a0a] font-bold shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
                                      : "bg-white/[0.03] border-white/[0.07] text-zinc-300 hover:border-amber-500/30 hover:text-white hover:bg-white/[0.06]"
                                  )}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                          {!selectedTime && errors.time && (
                            <p className="text-xs text-red-400 mt-2">{errors.time.message}</p>
                          )}
                          <p className="text-[11.5px] text-zinc-700 mt-2.5">
                            <span className="inline-block w-2 h-2 rounded-sm bg-zinc-800 border border-white/[0.04] mr-1.5 align-middle" />
                            Slot tercoret sudah dipesan
                          </p>
                        </div>
                      </>
                    )}

                    {/* STEP 2: Confirm */}
                    {step === 2 && (
                      <div className="space-y-4">
                        <p className="text-sm text-zinc-400 mb-4">Periksa kembali detail booking Anda:</p>

                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden divide-y divide-white/[0.05]">
                          {[
                            { label: "Nama", value: name },
                            { label: "WhatsApp", value: phone },
                            { label: "Kendaraan", value: `${carType} — ${carPlate?.toUpperCase()}` },
                            { label: "Layanan", value: SERVICES_OPTIONS.find(s => s.value === service)?.label },
                            { label: "Tanggal", value: date },
                            { label: "Waktu", value: selectedTime },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between px-4 py-3">
                              <span className="text-[12.5px] text-zinc-600">{label}</span>
                              <span className="text-[12.5px] text-zinc-200 font-medium text-right max-w-[55%]">{value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/15">
                          <span className="text-amber-500 text-lg leading-none flex-shrink-0">ℹ️</span>
                          <p className="text-[12.5px] text-amber-300/80 leading-relaxed">
                            Konfirmasi booking akan dikirim via WhatsApp ke nomor yang Anda daftarkan dalam 15 menit.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between px-6 pb-6 gap-3">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s - 1)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 bg-white/[0.04] border border-white/[0.07] transition-all"
                      >
                        <ArrowLeft size={14} /> Kembali
                      </button>
                    ) : <div />}

                    {step < 2 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13.5px] font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:-translate-y-px transition-all duration-200"
                      >
                        Lanjut <ChevronRight size={15} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13.5px] font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:-translate-y-px transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {mutation.isPending ? (
                          <><Loader2 size={14} className="animate-spin" /> Memproses…</>
                        ) : (
                          <><Send size={14} /> Konfirmasi Booking</>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Sidebar info */}
          <div className={cn(
            "space-y-4 transition-all duration-700 delay-300",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            {INFO_BLOCKS.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="rounded-2xl p-5 border border-white/[0.07] bg-[#0d0d0f] flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{title}</p>
                  {lines.map((l) => (
                    <p key={l} className="text-[13px] text-zinc-500">{l}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Trust badge */}
            <div className="rounded-2xl p-5 border border-amber-500/15 bg-amber-500/[0.04]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[12px] font-semibold text-green-400">Buka Hari Ini</span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">Slot Masih Tersedia</p>
              <p className="text-[12.5px] text-zinc-500 leading-relaxed">
                Masih ada 8 slot tersedia untuk hari ini. Booking sekarang sebelum penuh.
              </p>
            </div>

            {/* WhatsApp direct */}
            <a
              href="https://wa.me/6281234567890?text=Halo%20Bengkel%20Harun%2C%20saya%20ingin%20booking%20servis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold hover:bg-green-500/15 hover:border-green-500/30 transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat Langsung via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}