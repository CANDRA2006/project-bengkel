export const WA_NUMBER = "6282329661815";

export function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function waOrder(productName: string) {
  return waLink(`Halo Bengkel Harun, saya ingin memesan ${productName}.`);
}

export function waBooking(serviceName: string) {
  return waLink(`Halo Bengkel Harun, saya ingin booking layanan ${serviceName}.`);
}

export const WA_EMERGENCY = waLink("Darurat! Saya membutuhkan bantuan kendaraan.");
