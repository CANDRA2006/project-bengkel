import { QueryClient } from "@tanstack/react-query";

// 1. Inisialisasi QueryClient bawaan dari TanStack Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// 2. Fungsi pembantu apiRequest yang dicari oleh Contact.tsx
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<any> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Terjadi kesalahan pada server");
  }

  return res.json();
}