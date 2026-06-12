import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

export function FloatingWA() {
  return (
    <motion.a
      href={waLink("Halo Bengkel Harun, saya ingin bertanya.")}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-40 grid place-items-center size-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-10px_rgba(37,211,102,0.6)] animate-glow-pulse"
      aria-label="WhatsApp"
    >
      <MessageCircle className="size-6" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </motion.a>
  );
}
