export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
};

export type MembershipTier = {
  id: "free" | "premium";
  name: string;
  pricePerYear: number;
  pricePerMonth: number;
  color: string;
  features: string[];
  highlight?: boolean;
};

export const services: Service[] = [
  {
    id: "svc-01",
    name: "Ganti Oli & Filter",
    description: "Penggantian oli mesin dan filter oli dengan produk terpilih. Termasuk pemeriksaan 10 titik kendaraan.",
    price: 150000,
    duration: "30 menit",
    icon: "droplets",
  },
  {
    id: "svc-02",
    name: "Servis AC Lengkap",
    description: "Cuci evaporator, isi freon, bersihkan filter kabin, cek kompressor dan kondensor.",
    price: 350000,
    duration: "2 jam",
    icon: "wind",
  },
  {
    id: "svc-03",
    name: "Tune Up Mesin",
    description: "Pengecekan dan penyetelan sistem pengapian, karburator/injeksi, idle, dan kelistrikan.",
    price: 450000,
    duration: "3 jam",
    icon: "settings",
  },
  {
    id: "svc-04",
    name: "Balancing & Spooring",
    description: "Balancing semua ban dan spooring alignment roda untuk kestabilan berkendara optimal.",
    price: 200000,
    duration: "1 jam",
    icon: "rotate-cw",
  },
  {
    id: "svc-05",
    name: "Servis Rem",
    description: "Pemeriksaan dan penggantian kampas rem, disc, serta bleeding minyak rem.",
    price: 250000,
    duration: "1.5 jam",
    icon: "octagon",
  },
  {
    id: "svc-06",
    name: "Cuci Mobil Premium",
    description: "Cuci eksterior foam wash, poles bodi, vacuum interior, dan wax coating.",
    price: 120000,
    duration: "1.5 jam",
    icon: "sparkles",
  },
  {
    id: "svc-07",
    name: "Modifikasi & Custom",
    description: "Konsultasi dan pengerjaan modifikasi bodi, suspensi, velg, audio, dan eksterior.",
    price: 0,
    duration: "Sesuai project",
    icon: "zap",
  },
  {
    id: "svc-08",
    name: "Pemasangan Aksesori",
    description: "Pemasangan head unit, kamera mundur, kaca film, dashcam, dan aksesori lainnya.",
    price: 100000,
    duration: "1-3 jam",
    icon: "wrench",
  },
];

export const membershipTiers: MembershipTier[] = [
  {
    id: "free",
    name: "Basic",
    pricePerYear: 0,
    pricePerMonth: 0,
    color: "from-slate-600 to-slate-700",
    features: [
      "Booking layanan online",
      "Riwayat servis digital",
      "Notifikasi WhatsApp",
      "Akses katalog produk",
    ],
  },
  {
    id: "premium",
    name: "Member Premium",
    pricePerYear: 599000,
    pricePerMonth: 55000,
    color: "from-amber-500 to-orange-600",
    highlight: true,
    features: [
      "Semua fitur Basic",
      "Home Service (antar-jemput kendaraan)",
      "Diskon 10% semua layanan",
      "Prioritas antrian & booking",
      "Kaos MAXGIC eksklusif (Rp 150.000)",
      "Keychain Bengkel Harun (Rp 45.000)",
      "Konsultasi mesin gratis",
      "Garansi servis 30 hari",
    ],
  },
];

export function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}
