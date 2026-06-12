import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CheckCircle2, Clock, Car, Phone, User, Trash2, MessageCircle, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/lib/data/services";
import {
  deleteBooking,
  formatBookingForWA,
  getBookings,
  saveBooking,
  type Booking,
} from "@/lib/bookings";
import { waLink } from "@/lib/whatsapp";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Booking & Riwayat Servis — Bengkel Harun" },
      { name: "description", content: "Buat booking servis baru dan lihat riwayat booking Anda di Bengkel Harun." },
      { property: "og:title", content: "Booking — Bengkel Harun" },
      { property: "og:description", content: "Booking servis dan lihat riwayat di Bengkel Harun." },
    ],
  }),
  component: BookingPage,
});

const today = () => new Date().toISOString().split("T")[0];

function BookingPage() {
  const [tab, setTab] = useState<"new" | "history">("new");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const refresh = () => setBookings(getBookings());
    refresh();
    window.addEventListener("bookings:update", refresh);
    return () => window.removeEventListener("bookings:update", refresh);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand mb-2">Booking & Riwayat</p>
        <h1 className="text-4xl lg:text-5xl font-display font-bold">
          Pesan & Pantau <span className="text-gradient-brand">Servis Anda</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Buat booking baru atau lihat riwayat permintaan servis sebelumnya.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="mt-8 inline-flex glass rounded-full p-1">
        {(
          [
            { id: "new", label: "Buat Booking", icon: Calendar },
            { id: "history", label: `Riwayat (${bookings.length})`, icon: FileText },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all inline-flex items-center gap-2",
              tab === t.id
                ? "bg-gradient-to-r from-brand to-accent text-brand-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {tab === "new" ? (
            <motion.div key="new" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <BookingForm />
            </motion.div>
          ) : (
            <motion.div key="hist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <BookingHistory bookings={bookings} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BookingForm() {
  const [form, setForm] = useState({
    serviceName: services[0].name,
    customerName: "",
    phone: "",
    carModel: "",
    plate: "",
    date: today(),
    time: "09:00",
    notes: "",
  });
  const [submitted, setSubmitted] = useState<Booking | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.carModel) {
      toast.error("Lengkapi nama, nomor HP, dan model mobil.");
      return;
    }
    const b = saveBooking(form);
    setSubmitted(b);
    toast.success(`Booking ${b.id} tersimpan! Lanjutkan via WhatsApp.`);
  }

  if (submitted) {
    return (
      <div className="card-premium rounded-3xl p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle2 className="size-16 text-green-500 mx-auto" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-display font-bold">Booking Tersimpan</h2>
        <p className="mt-2 text-muted-foreground">
          ID Booking: <span className="font-mono text-brand">{submitted.id}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Klik tombol di bawah untuk mengirim detail booking ke WhatsApp admin Bengkel Harun.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-[#25D366] hover:bg-[#1faa54] text-white">
            <a href={waLink(formatBookingForWA(submitted))} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1" /> Konfirmasi via WhatsApp
            </a>
          </Button>
          <Button variant="outline" onClick={() => setSubmitted(null)}>
            Buat Booking Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-premium rounded-3xl p-6 lg:p-8 grid lg:grid-cols-2 gap-5">
      <div className="lg:col-span-2">
        <Label>Pilih Layanan</Label>
        <div className="mt-2 grid grid-cols-2 lg:grid-cols-3 gap-2">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setForm({ ...form, serviceName: s.name })}
              className={cn(
                "text-left p-3 rounded-xl border text-sm transition",
                form.serviceName === s.name
                  ? "border-brand bg-brand/10 text-foreground"
                  : "border-border/60 hover:border-brand/40",
              )}
            >
              <s.icon className="size-4 text-brand mb-1" />
              <p className="font-medium">{s.name}</p>
              <p className="text-[11px] text-muted-foreground">{s.duration}</p>
            </button>
          ))}
        </div>
      </div>

      <Field icon={User} label="Nama Lengkap *">
        <Input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Budi Santoso" />
      </Field>
      <Field icon={Phone} label="Nomor HP / WA *">
        <Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0812xxxxxx" />
      </Field>
      <Field icon={Car} label="Model Mobil *">
        <Input required value={form.carModel} onChange={(e) => setForm({ ...form, carModel: e.target.value })} placeholder="Toyota Avanza 2018" />
      </Field>
      <Field icon={FileText} label="Plat Nomor">
        <Input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="G 1234 AB" />
      </Field>
      <Field icon={Calendar} label="Tanggal">
        <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      </Field>
      <Field icon={Clock} label="Jam">
        <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
      </Field>

      <div className="lg:col-span-2">
        <Label>Catatan / Keluhan</Label>
        <Textarea
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Mis: mobil bergetar saat di rem, AC kurang dingin..."
          className="mt-1.5"
        />
      </div>

      <div className="lg:col-span-2 flex justify-end">
        <Button type="submit" size="lg" className="bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow">
          <Calendar className="mr-1" /> Simpan & Lanjut ke WhatsApp
        </Button>
      </div>
    </form>
  );
}

function Field({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="inline-flex items-center gap-1.5">
        <Icon className="size-3.5 text-brand" /> {label}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function BookingHistory({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="card-premium rounded-3xl p-12 text-center">
        <Calendar className="size-12 mx-auto text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Belum ada riwayat booking</h2>
        <p className="mt-1 text-sm text-muted-foreground">Booking pertama Anda akan muncul di sini.</p>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    Menunggu: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    Dikonfirmasi: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    Selesai: "bg-green-500/15 text-green-300 border-green-500/30",
    Dibatalkan: "bg-red-500/15 text-red-300 border-red-500/30",
  };

  return (
    <div className="space-y-3">
      {bookings.map((b, i) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card-premium rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
              <span className={cn("text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border", statusColor[b.status])}>
                {b.status}
              </span>
            </div>
            <h3 className="mt-1.5 font-semibold">{b.serviceName}</h3>
            <p className="text-sm text-muted-foreground">
              {b.customerName} · {b.carModel} {b.plate && `(${b.plate})`}
            </p>
            <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
              <Calendar className="size-3" /> {b.date} · {b.time}
            </p>
            {b.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{b.notes}"</p>}
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" className="bg-[#25D366] hover:bg-[#1faa54] text-white">
              <a href={waLink(formatBookingForWA(b))} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
              </a>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (confirm("Hapus booking ini?")) deleteBooking(b.id);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
