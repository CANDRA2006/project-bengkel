import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const INITIAL: Msg = {
  role: "assistant",
  content:
    "Halo! Saya **Harun AI**, asisten Bengkel Harun. Tanya saya soal mobil, sparepart, atau booking servis. Ada yang bisa saya bantu?",
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: `⚠️ ${data.error ?? "Gagal menghubungi Harun AI."}` },
        ]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.text ?? "..." }]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Koneksi gagal. Coba lagi sebentar." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const quick = [
    "Estimasi service berkala?",
    "Mobil saya bunyi kasar saat dingin",
    "Rekomendasi ban touring",
    "Booking ganti oli",
  ];

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 250 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-24 z-40 grid place-items-center size-14 rounded-full bg-gradient-to-br from-brand to-accent text-brand-foreground shadow-[0_10px_40px_-10px_hsl(var(--brand)/0.7)]"
        aria-label="Chat dengan Harun AI"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="size-6" />
            </motion.span>
          ) : (
            <motion.span key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="size-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 grid place-items-center size-5 rounded-full bg-accent text-[10px] font-bold animate-pulse">
            AI
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[560px] max-h-[80vh] rounded-2xl glass-strong border border-border/60 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-4 py-3 border-b border-border/40 flex items-center gap-3 bg-gradient-to-r from-brand/15 to-accent/15">
              <div className="relative grid place-items-center size-10 rounded-xl bg-gradient-to-br from-brand to-accent">
                <Bot className="size-5 text-brand-foreground" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-green-500 ring-2 ring-background" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  Harun AI <Sparkles className="size-3 text-accent" />
                </p>
                <p className="text-[11px] text-muted-foreground">Asisten otomotif · Online</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-md hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-gradient-to-br from-brand to-accent text-brand-foreground rounded-br-sm"
                        : "bg-secondary/80 rounded-bl-sm",
                    )}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-strong:text-brand">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary/80 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm flex items-center gap-2">
                    <Loader2 className="size-3.5 animate-spin text-brand" />
                    <span className="text-muted-foreground">Harun AI sedang mengetik...</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick replies */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {quick.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => send(), 50);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full glass border border-border/60 hover:border-brand/40"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <div className="border-t border-border/40 p-3 flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Tanya soal mobil atau sparepart..."
                rows={1}
                className="flex-1 resize-none bg-secondary/50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/40 max-h-24"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="grid place-items-center size-10 rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground disabled:opacity-40"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
