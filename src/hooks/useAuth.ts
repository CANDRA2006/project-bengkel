import { useState, useEffect, useCallback } from "react";
import { getSession, logout as authLogout, type User } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setUser(getSession());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("bh-auth-changed", handler);
    return () => window.removeEventListener("bh-auth-changed", handler);
  }, [refresh]);

  const logout = useCallback(() => {
    authLogout();
  }, []);

  return { user, loading, logout, refresh };
}
