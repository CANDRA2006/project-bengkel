export type BookingStatus = "Menunggu" | "Dikonfirmasi" | "Selesai" | "Dibatalkan";

export type Booking = {
  id: string;
  serviceName: string;
  customerName: string;
  phone: string;
  carModel: string;
  plate: string;
  date: string;
  time: string;
  notes?: string;
  status: BookingStatus;
  createdAt: number;
};

const KEY = "bengkel-harun:bookings";

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(b: Omit<Booking, "id" | "createdAt" | "status">): Booking {
  const booking: Booking = {
    ...b,
    id: `BK-${Date.now().toString(36).toUpperCase()}`,
    createdAt: Date.now(),
    status: "Menunggu",
  };
  const list = getBookings();
  list.unshift(booking);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("bookings:update"));
  return booking;
}

export function deleteBooking(id: string) {
  const list = getBookings().filter((b) => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("bookings:update"));
}

export function formatBookingForWA(b: Booking) {
  return `*Booking Baru — Bengkel Harun*
ID: ${b.id}
Layanan: ${b.serviceName}
Nama: ${b.customerName}
HP: ${b.phone}
Mobil: ${b.carModel} (${b.plate})
Jadwal: ${b.date} ${b.time}
${b.notes ? `Catatan: ${b.notes}` : ""}`.trim();
}
