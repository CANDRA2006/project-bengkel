import { Wrench, Gauge, Droplets, Cog, Truck, type LucideIcon } from "lucide-react";

export type Service = {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: string;
  duration: string;
  icon: LucideIcon;
  image: string;
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const services: Service[] = [
  {
    id: "service-berkala",
    name: "Service Berkala",
    description: "Perawatan rutin sesuai jadwal pabrikan untuk menjaga performa & umur mesin.",
    features: ["Ganti oli mesin", "Cek filter & busi", "Inspeksi 30 titik", "Tune kelistrikan"],
    price: "Mulai Rp 350.000",
    duration: "± 90 menit",
    icon: Wrench,
    image: u("photo-1486006920555-c77dcf18193c"),
  },
  {
    id: "tune-up",
    name: "Tune Up Mesin",
    description: "Optimasi performa mesin agar respon lebih ringan & konsumsi BBM efisien.",
    features: ["Bersihkan throttle body", "Setel idle RPM", "Cek timing", "Servis injektor"],
    price: "Mulai Rp 550.000",
    duration: "± 2 jam",
    icon: Gauge,
    image: u("photo-1632823471565-1ecdf7a02a4b"),
  },
  {
    id: "ganti-oli",
    name: "Ganti Oli Express",
    description: "Penggantian oli mesin & filter dengan oli berkualitas tinggi.",
    features: ["Oli synthetic / mineral", "Filter oli baru", "Cek level fluid lain", "Reset service indicator"],
    price: "Mulai Rp 285.000",
    duration: "± 30 menit",
    icon: Droplets,
    image: u("photo-1635770310744-c2c2469d3b81"),
  },
  {
    id: "perbaikan-mesin",
    name: "Perbaikan Mesin",
    description: "Diagnosa & perbaikan mesin profesional dengan scanner OBD-II modern.",
    features: ["Diagnosa scanner", "Overhaul mesin", "Ganti timing belt", "Garansi servis"],
    price: "Mulai Rp 1.500.000",
    duration: "1–3 hari kerja",
    icon: Cog,
    image: u("photo-1597007030739-6d2e7172ee6e"),
  },
  {
    id: "home-service",
    name: "Home Service",
    description: "Layanan servis di lokasi Anda — hemat waktu, tetap berkualitas bengkel.",
    features: ["Teknisi datang ke rumah", "Peralatan lengkap", "Pembayaran setelah selesai", "Area Pekalongan & sekitar"],
    price: "Mulai Rp 150.000 (jasa panggil)",
    duration: "Sesuai jenis servis",
    icon: Truck,
    image: u("photo-1632823469850-2f77dd9c7f93"),
  },
];
