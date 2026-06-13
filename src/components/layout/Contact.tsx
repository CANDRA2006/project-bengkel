import { useState } from "react";
import { Phone, MapPin, Clock, MessageCircle, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldGroup, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { saveBooking, formatBookingForWA } from "@/lib/bookings";
import { services } from "@/lib/data/services";
import { WA_NUMBER, waLink } from "@/lib/whatsapp";
import { useAuth } from "@/hooks/useAuth";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00",
];

export function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    serviceName: "",
    customerName: user?.fullName || "",
    phone: user?.whatsapp || "",
    carModel: "",
    plate: "",
    date: "",
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.serviceName) errs.serviceName = "Pilih layanan";
    if (!form.customerName.trim()) errs.customerName = "Nama wajib diisi";
    if (!form.phone.trim()) errs.phone = "Nomor WA wajib diisi";
    if (!form.carModel.trim()) errs.carModel = "Model mobil wajib diisi";
    if (!form.plate.trim()) errs.plate = "Plat nomor wajib diisi";
    if (!form.date) errs.date = "Pilih tanggal";
    if (!form.time) errs.time = "Pilih waktu";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      const booking = saveBooking(form);
      const msg = formatBookingForWA(booking);
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
      setDone(true);
      setLoading(false);
    }, 600);
  };

  // Min date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge variant="amber" className="mb-4">Kontak</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Booking & <span className="text-amber-500">Hubungi Kami</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Isi form booking di bawah atau hubungi kami langsung via WhatsApp.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Booking form */}
          <div className="lg:col-span-3">
            {done ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 rounded-2xl bg-zinc-900 border border-zinc-800">
                <CheckCircle size={56} className="text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Booking Terkirim!</h3>
                <p className="text-zinc-400 mb-6">
                  Kami akan menghubungi Anda via WhatsApp untuk konfirmasi jadwal.
                </p>
                <Button variant="secondary" onClick={() => { setDone(false); setForm({ serviceName: "", customerName: user?.fullName || "", phone: user?.whatsapp || "", carModel: "", plate: "", date: "", time: "", notes: "" }); }}>
                  Booking Lagi
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-lg font-bold text-white mb-1">Form Booking</h3>

                <FieldGroup>
                  <Label required>Pilih Layanan</Label>
                  <select
                    value={form.serviceName}
                    onChange={(e) => set("serviceName", e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  >
                    <option value="">-- Pilih layanan --</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  {errors.serviceName && <span className="text-xs text-red-400">{errors.serviceName}</span>}
                </FieldGroup>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FieldGroup>
                    <Label required>Nama Lengkap</Label>
                    <Input placeholder="Nama Anda" value={form.customerName} onChange={(e) => set("customerName", e.target.value)} error={errors.customerName} />
                  </FieldGroup>
                  <FieldGroup>
                    <Label required>Nomor WhatsApp</Label>
                    <Input type="tel" placeholder="08xx..." value={form.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} />
                  </FieldGroup>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FieldGroup>
                    <Label required>Model Mobil</Label>
                    <Input placeholder="Toyota Avanza, dll." value={form.carModel} onChange={(e) => set("carModel", e.target.value)} error={errors.carModel} />
                  </FieldGroup>
                  <FieldGroup>
                    <Label required>Plat Nomor</Label>
                    <Input placeholder="G 1234 AB" value={form.plate} onChange={(e) => set("plate", e.target.value.toUpperCase())} error={errors.plate} />
                  </FieldGroup>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FieldGroup>
                    <Label required>Tanggal</Label>
                    <Input type="date" min={minDateStr} value={form.date} onChange={(e) => set("date", e.target.value)} error={errors.date} />
                  </FieldGroup>
                  <FieldGroup>
                    <Label required>Jam</Label>
                    <select
                      value={form.time}
                      onChange={(e) => set("time", e.target.value)}
                      className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    >
                      <option value="">-- Pilih waktu --</option>
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t} WIB</option>)}
                    </select>
                    {errors.time && <span className="text-xs text-red-400">{errors.time}</span>}
                  </FieldGroup>
                </div>

                <FieldGroup>
                  <Label>Catatan (opsional)</Label>
                  <Textarea placeholder="Keluhan atau informasi tambahan..." rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                </FieldGroup>

                <Button type="submit" size="lg" className="w-full gap-2" loading={loading}>
                  <Send size={16} /> Kirim Booking via WhatsApp
                </Button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-5">
            {[
              {
                icon: <Phone size={18} className="text-amber-400" />,
                title: "WhatsApp",
                value: "+62 823-2966-1815",
                sub: "Respon cepat jam kerja",
                href: waLink("Halo Bengkel Harun!"),
              },
              {
                icon: <MapPin size={18} className="text-amber-400" />,
                title: "Lokasi",
                value: "Pekalongan, Jawa Tengah",
                sub: "Kunjungi bengkel kami",
                href: "https://maps.google.com",
              },
              {
                icon: <Clock size={18} className="text-amber-400" />,
                title: "Jam Operasional",
                value: "08.00 – 17.00 WIB",
                sub: "Senin – Sabtu",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-200 ${item.href ? "hover:border-amber-500/40 hover:bg-zinc-900/80 cursor-pointer" : "cursor-default"}`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium mb-1">{item.title}</p>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.sub}</p>
                </div>
              </a>
            ))}

            {/* WA CTA */}
            <a
              href={waLink("Halo Bengkel Harun, saya ingin tanya-tanya dulu.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="w-full gap-2 mt-2">
                <MessageCircle size={16} />
                Chat WhatsApp Sekarang
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
