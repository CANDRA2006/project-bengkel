import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/bengkel-harun-logo.png.asset.json";

const KEY = "bengkel-harun:splash-shown";

export function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;
    setShow(true);
    sessionStorage.setItem(KEY, "1");
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-background"
        >
          {/* Cinematic backdrop */}
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <motion.div
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.35 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--brand)/0.4), transparent 70%)",
            }}
          />

          {/* Sweeping light bar */}
          <motion.div
            initial={{ x: "-110%" }}
            animate={{ x: "110%" }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
          />

          {/* Logo */}
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand to-accent blur-3xl opacity-50 animate-pulse" />
              <img
                src={logoAsset.url}
                alt="Bengkel Harun"
                className="relative size-32 md:size-40 object-contain drop-shadow-[0_0_30px_rgba(255,80,40,0.6)]"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
                BENGKEL <span className="text-gradient-brand">HARUN</span>
              </h1>
              <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.4em] text-muted-foreground">
                Drive · Perform · Trust
              </p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 1.8, ease: "easeInOut" }}
              className="h-[2px] w-48 md:w-72 origin-left bg-gradient-to-r from-transparent via-brand to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
