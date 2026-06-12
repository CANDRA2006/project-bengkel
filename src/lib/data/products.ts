export type ProductCategory = "Aksesori" | "Suku Cadang" | "Bahan Modifikasi";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number; // IDR
  image: string;
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const products: Product[] = [
  // Suku Cadang
  { id: "sp-01", name: "Kampas Rem Depan Premium", category: "Suku Cadang", description: "Kampas rem ceramic semi-metallic, daya cengkeram tinggi, low dust.", price: 285000, image: u("photo-1486262715619-67b85e0b08d3") },
  { id: "sp-02", name: "Filter Udara Performance", category: "Suku Cadang", description: "Filter udara high-flow untuk meningkatkan respon mesin.", price: 175000, image: u("photo-1632823471565-1ecdf7a02a4b") },
  { id: "sp-03", name: "Aki Mobil GS Premium 65Ah", category: "Suku Cadang", description: "Aki maintenance-free, daya tahan hingga 3 tahun pemakaian.", price: 1450000, image: u("photo-1632933273820-72b87f7ad88a") },
  { id: "sp-04", name: "Busi Iridium NGK (4 pcs)", category: "Suku Cadang", description: "Busi iridium tip 0.6mm, pembakaran sempurna & efisiensi BBM.", price: 480000, image: u("photo-1530046339915-78e95dbc5e2c") },
  { id: "sp-05", name: "Oli Mesin Shell Helix Ultra 5W-40 4L", category: "Suku Cadang", description: "Full synthetic, melindungi mesin pada suhu ekstrem.", price: 695000, image: u("photo-1635770310744-c2c2469d3b81") },
  { id: "sp-06", name: "Timing Belt Set Original", category: "Suku Cadang", description: "Set timing belt + tensioner + idler pulley, OEM grade.", price: 1850000, image: u("photo-1503376780353-7e6692767b70") },
  { id: "sp-07", name: "Radiator Coolant Long Life 4L", category: "Suku Cadang", description: "Coolant ready-to-use, mencegah karat & overheat.", price: 165000, image: u("photo-1591293836027-e05b48473b67") },
  { id: "sp-08", name: "Shockbreaker KYB Depan (Pair)", category: "Suku Cadang", description: "Shockbreaker original KYB Excel-G, kenyamanan optimal.", price: 1650000, image: u("photo-1487754180451-c456f719a1fc") },
  { id: "sp-09", name: "Ball Joint Set 555 Japan", category: "Suku Cadang", description: "Ball joint heavy duty buatan Jepang, awet & presisi.", price: 425000, image: u("photo-1486006920555-c77dcf18193c") },
  { id: "sp-10", name: "Filter Oli Mesin", category: "Suku Cadang", description: "Filter oli OEM, wajib diganti setiap servis berkala.", price: 95000, image: u("photo-1632823469850-2f77dd9c7f93") },
  { id: "sp-11", name: "Kopling Set Original Aisin", category: "Suku Cadang", description: "Clutch disc + cover + release bearing, set lengkap.", price: 2950000, image: u("photo-1597007030739-6d2e7172ee6e") },
  { id: "sp-12", name: "Tie Rod End 555 (Pair)", category: "Suku Cadang", description: "Tie rod end Jepang untuk steering presisi.", price: 385000, image: u("photo-1543393470-b2d953f1d5a4") },

  // Aksesori
  { id: "ax-01", name: "Karpet Mobil 5D Premium Custom", category: "Aksesori", description: "Karpet 5D PU leather custom per tipe mobil, anti-slip & waterproof.", price: 850000, image: u("photo-1554744512-d6c603f27c54") },
  { id: "ax-02", name: "Cover Jok Kulit Sintetis MBTech", category: "Aksesori", description: "Sarung jok bahan MBTech, finishing rapi, pasang di tempat.", price: 1750000, image: u("photo-1503376780353-7e6692767b70") },
  { id: "ax-03", name: "Head Unit Android 10\" 2GB/32GB", category: "Aksesori", description: "Tape Android dengan CarPlay & Android Auto wireless.", price: 2450000, image: u("photo-1606664515524-ed2f786a0bd6") },
  { id: "ax-04", name: "Kamera Mundur HD Night Vision", category: "Aksesori", description: "Kamera parkir 720p dengan night vision & sensor parkir.", price: 485000, image: u("photo-1614026480209-cd1b1c0d9166") },
  { id: "ax-05", name: "Kaca Film 3M Crystalline 70%", category: "Aksesori", description: "Kaca film premium 3M, tolak panas tinggi, garansi 5 tahun.", price: 3500000, image: u("photo-1494976388531-d1058494cdd8") },
  { id: "ax-06", name: "Talang Air Mobil Premium", category: "Aksesori", description: "Talang air injection, anti rontok, model OEM.", price: 295000, image: u("photo-1571127236794-81c0bbfe1ce3") },
  { id: "ax-07", name: "Dashcam Front & Rear 1440p", category: "Aksesori", description: "Dashcam dual lens dengan GPS, parking mode 24 jam.", price: 1650000, image: u("photo-1449965408869-eaa3f722e40d") },
  { id: "ax-08", name: "Lampu LED Headlamp H4 100W", category: "Aksesori", description: "LED headlamp super bright 12000 lumen, plug & play.", price: 685000, image: u("photo-1542367592-8849eb950fd8") },
  { id: "ax-09", name: "Wiper Bosch Aerotwin (Pair)", category: "Aksesori", description: "Wiper frameless Bosch, sapuan halus & senyap.", price: 385000, image: u("photo-1605152276897-4f618f831968") },
  { id: "ax-10", name: "Parfum Mobil Treefrog Original", category: "Aksesori", description: "Pengharum mobil Jepang, tahan hingga 6 bulan.", price: 145000, image: u("photo-1502877338535-766e1452684a") },

  // Bahan Modifikasi
  { id: "md-01", name: "Velg Racing 17\" 4 Holes", category: "Bahan Modifikasi", description: "Velg alloy ringan, desain sporty multi-spoke (1 set 4 pcs).", price: 4850000, image: u("photo-1492144534655-ae79c964c9d7") },
  { id: "md-02", name: "Ban Michelin Pilot Sport 205/45 R17", category: "Bahan Modifikasi", description: "Ban performance Michelin, grip maksimal di basah & kering.", price: 1850000, image: u("photo-1580273916550-e323be2ae537") },
  { id: "md-03", name: "Bodykit Drag Style Universal", category: "Bahan Modifikasi", description: "Bodykit fiber set lengkap (front, side, rear, spoiler).", price: 5500000, image: u("photo-1552519507-da3b142c6e3d") },
  { id: "md-04", name: "Knalpot Racing HKS Replica", category: "Bahan Modifikasi", description: "Muffler stainless steel, suara sporty deep.", price: 1450000, image: u("photo-1583121274602-3e2820c69888") },
  { id: "md-05", name: "Per Eibach Pro-Kit Lowering", category: "Bahan Modifikasi", description: "Per pendek Eibach, turun 30mm, handling lebih sporty.", price: 3850000, image: u("photo-1568605117036-5fe5e7bab0b7") },
  { id: "md-06", name: "Coilover Adjustable HKS Hipermax", category: "Bahan Modifikasi", description: "Suspensi coilover 32-step damping, height adjustable.", price: 18500000, image: u("photo-1542362567-b07e54358753") },
  { id: "md-07", name: "Stiker Wrap Vinyl 3M 1080 (per meter)", category: "Bahan Modifikasi", description: "Vinyl wrap 3M premium, banyak pilihan warna & finish.", price: 285000, image: u("photo-1511919884226-fd3cad34687c") },
  { id: "md-08", name: "Strut Bar Carbon Steel", category: "Bahan Modifikasi", description: "Strut tower bar carbon, meningkatkan rigidity sasis.", price: 1250000, image: u("photo-1581540222194-0def2dda95b8") },
];

export const categories: ProductCategory[] = ["Aksesori", "Suku Cadang", "Bahan Modifikasi"];

export function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}
