import { useEffect, useState } from "react";
import { getSession, type User } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getSession());
    setReady(true);
    const handler = () => setUser(getSession());
    window.addEventListener("bh-auth-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("bh-auth-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { user, ready };
}
