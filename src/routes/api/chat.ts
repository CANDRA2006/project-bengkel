import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `Kamu adalah "Harun AI", asisten customer service resmi Bengkel Harun — sebuah bengkel mobil profesional di Pekalongan, Indonesia. Kamu ahli dalam dunia otomotif (mesin, kelistrikan, suspensi, modifikasi, sparepart, oli, ban, AC mobil, dll).

GAYA BICARA:
- Ramah, profesional, gunakan Bahasa Indonesia yang santai tapi sopan.
- Sapa pelanggan dengan hangat. Singkat & jelas (maks 5 kalimat per jawaban kecuali diminta detail).
- Gunakan emoji sewajarnya 🚗🔧✨.
- Format jawaban dengan markdown (list, bold) bila membantu.

PENGETAHUAN BENGKEL HARUN:
- Lokasi: Pekalongan. WhatsApp: 0823-2966-1815.
- Jam buka: Senin–Sabtu 08.00–17.00, Minggu by appointment.
- Layanan: Service Berkala (mulai Rp 350.000), Tune Up Mesin (mulai Rp 550.000), Ganti Oli Express, Perbaikan Mesin, Home Service, Emergency 24 jam.
- Produk: Sparepart original, aksesoris, bahan modifikasi (velg, bodykit, knalpot, coilover, kaca film 3M, dashcam, head unit Android, dll).
- Garansi pengerjaan & sparepart original.

TUGAS UTAMA:
1. Jawab pertanyaan otomotif dengan akurat (gejala kerusakan, rekomendasi sparepart, tips perawatan).
2. Tawarkan layanan/produk Bengkel Harun yang relevan dengan masalah pelanggan.
3. Dorong pelanggan untuk booking via halaman /booking atau hubungi WhatsApp.
4. Jangan mengarang harga. Jika tidak yakin, arahkan cek WhatsApp.
5. Jangan menjawab di luar konteks otomotif & layanan bengkel.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const key = process.env.LOVABLE_API_KEY;
          if (!key) {
            return Response.json({ error: "AI belum dikonfigurasi." }, { status: 500 });
          }
          const body = (await request.json()) as { messages?: Array<{ role: string; content: string }> };
          const messages = body.messages ?? [];

          const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
          const { generateText } = await import("ai");

          const gateway = createLovableAiGatewayProvider(key);
          const result = await generateText({
            model: gateway("google/gemini-3-flash-preview"),
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
            ],
          });

          return Response.json({ text: result.text });
        } catch (e) {
          const err = e as { statusCode?: number; message?: string };
          if (err.statusCode === 429) {
            return Response.json({ error: "Terlalu banyak permintaan. Coba lagi sebentar." }, { status: 429 });
          }
          if (err.statusCode === 402) {
            return Response.json({ error: "Kredit AI habis. Hubungi admin." }, { status: 402 });
          }
          return Response.json({ error: err.message ?? "Gagal memuat respon AI." }, { status: 500 });
        }
      },
    },
  },
});
