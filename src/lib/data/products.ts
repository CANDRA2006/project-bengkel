import akiGs from "../../assets/katalog/aki-gs.jpeg";
import banMichelin from "../../assets/katalog/ban-michelin.jpeg";
import busi from "../../assets/katalog/busi.jpg";
import coilover from "../../assets/katalog/coilover.jpg";
import dashcam from "../../assets/katalog/dashcam.webp";
import filterUdara from "../../assets/katalog/filter-udara.jpg";
import headUnit from "../../assets/katalog/head-unit.webp";
import kacaFilm from "../../assets/katalog/kaca-film.jpg";
import kampasRem from "../../assets/katalog/kampas-rem-depan.jpg";
import karpet from "../../assets/katalog/karpet.webp";
import knalpotRacing from "../../assets/katalog/knalpot-racing.avif";
import lampuLed from "../../assets/katalog/lampu-led.jpg";
import oliShell from "../../assets/katalog/oli-shell.webp";
import perEibach from "../../assets/katalog/per-eibach.jpg";
import radiator from "../../assets/katalog/radiator.jpg";
import shockBreaker from "../../assets/katalog/shock-breaker.jpg";
import velgRacing from "../../assets/katalog/velg-racing.jpg";
import wiper from "../../assets/katalog/wiper.jpg";
import stiker from "../../assets/katalog/stiker-wrap.avif"

export type ProductCategory = "Aksesori" | "Suku Cadang" | "Bahan Modifikasi";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string;
};

// Using specific, accurate Unsplash images for each product category
export const products: Product[] = [
  // Suku Cadang
  {
    id: "sp-01",
    name: "Kampas Rem Depan Ceramic",
    category: "Suku Cadang",
    description: "Kampas rem ceramic semi-metallic, daya cengkeram tinggi, low dust, cocok untuk pemakaian harian.",
    price: 285000,
    image: kampasRem,
  },
  {
    id: "sp-02",
    name: "Filter Udara Performance",
    category: "Suku Cadang",
    description: "Filter udara high-flow meningkatkan respons throttle dan tenaga mesin.",
    price: 175000,
    image: filterUdara,
  },
  {
    id: "sp-03",
    name: "Aki GS Premium 65Ah",
    category: "Suku Cadang",
    description: "Aki maintenance-free bergaransi, daya tahan hingga 3 tahun.",
    price: 1450000,
    image: akiGs,
  },
  {
    id: "sp-04",
    name: "Busi Iridium NGK (4 pcs)",
    category: "Suku Cadang",
    description: "Busi iridium tip 0.6mm, pembakaran sempurna, efisiensi BBM optimal.",
    price: 480000,
    image: busi,
  },
  {
    id: "sp-05",
    name: "Oli Shell Helix Ultra 5W-40 4L",
    category: "Suku Cadang",
    description: "Full synthetic, melindungi mesin di suhu ekstrem, garansi mesin.",
    price: 695000,
    image: oliShell,
  },
  {
    id: "sp-06",
    name: "Timing Belt Set OEM",
    category: "Suku Cadang",
    description: "Set timing belt + tensioner + idler pulley, grade OEM terpercaya.",
    price: 1850000,
    image: radiator,
  },
  {
    id: "sp-07",
    name: "Radiator Coolant Long Life 4L",
    category: "Suku Cadang",
    description: "Coolant ready-to-use, mencegah karat, overheat, dan korosi.",
    price: 165000,
    image: radiator,
  },
  {
    id: "sp-08",
    name: "Shockbreaker KYB Excel-G (Pair)",
    category: "Suku Cadang",
    description: "Shockbreaker original KYB depan, kenyamanan dan handling optimal.",
    price: 1650000,
    image: shockBreaker,
  },

  // Aksesori
  {
    id: "ax-01",
    name: "Karpet Mobil 5D Premium",
    category: "Aksesori",
    description: "Karpet 5D PU leather custom per tipe mobil, anti-slip, waterproof.",
    price: 850000,
    image: karpet,
  },
  {
    id: "ax-02",
    name: "Head Unit Android 10\" 2GB/32GB",
    category: "Aksesori",
    description: "Tape Android dengan CarPlay & Android Auto wireless, kamera mundur built-in.",
    price: 2450000,
    image: headUnit,
  },
  {
    id: "ax-03",
    name: "Kaca Film 3M Crystalline 70%",
    category: "Aksesori",
    description: "Kaca film premium 3M, tolak panas tinggi tanpa gelap, garansi 5 tahun.",
    price: 3500000,
    image: kacaFilm,
  },
  {
    id: "ax-04",
    name: "Dashcam Front & Rear 1440p",
    category: "Aksesori",
    description: "Dashcam dual lens dengan GPS, parking mode 24 jam, Wi-Fi.",
    price: 1650000,
    image: dashcam,
  },
  {
    id: "ax-05",
    name: "Wiper Bosch Aerotwin (Pair)",
    category: "Aksesori",
    description: "Wiper frameless Bosch, sapuan halus, senyap, dan merata di semua cuaca.",
    price: 385000,
    image: wiper,
  },
  {
    id: "ax-06",
    name: "Lampu LED Headlamp H4 12000lm",
    category: "Aksesori",
    description: "LED headlamp super bright, plug & play, 6000K putih terang.",
    price: 685000,
    image: lampuLed,
  },

  // Bahan Modifikasi
  {
    id: "md-01",
    name: "Velg Racing 17\" Alloy 4-Hole",
    category: "Bahan Modifikasi",
    description: "Velg alloy ringan desain sporty multi-spoke, 1 set 4 pcs.",
    price: 4850000,
    image: velgRacing,
  },
  {
    id: "md-02",
    name: "Ban Michelin Pilot Sport 205/45 R17",
    category: "Bahan Modifikasi",
    description: "Ban performance Michelin, grip maksimal di kondisi basah maupun kering.",
    price: 1850000,
    image: banMichelin,
  },
  {
    id: "md-03",
    name: "Per Eibach Pro-Kit Lowering",
    category: "Bahan Modifikasi",
    description: "Per pendek Eibach, turun 30mm, handling lebih sporty tanpa kehilangan kenyamanan.",
    price: 3850000,
    image: perEibach,
  },
  {
    id: "md-04",
    name: "Knalpot Racing Stainless Steel",
    category: "Bahan Modifikasi",
    description: "Muffler stainless steel, suara sporty deep, tahan karat.",
    price: 1450000,
    image: knalpotRacing,
  },
  {
    id: "md-05",
    name: "Stiker Wrap Vinyl 3M 1080 (per meter)",
    category: "Bahan Modifikasi",
    description: "Vinyl wrap 3M premium, banyak pilihan warna & finish, mudah dilepas.",
    price: 285000,
    image: stiker,
  },
  {
    id: "md-06",
    name: "Coilover Adjustable HKS Hipermax",
    category: "Bahan Modifikasi",
    description: "Suspensi coilover 32-step damping, height adjustable, racing grade.",
    price: 18500000,
    image: coilover,
  },
];



export const categories: ProductCategory[] = ["Aksesori", "Suku Cadang", "Bahan Modifikasi"];

export function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}
