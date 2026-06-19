import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getSession, logout as authLogout, readCart, writeCart, type User, type CartItem, initializeAdmin } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refresh: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, logout: () => {}, refresh: () => {},
  cart: [], addToCart: () => {}, removeFromCart: () => {}, updateQty: () => {}, clearCart: () => {},
  cartCount: 0, cartTotal: 0,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCartState] = useState<CartItem[]>([]);

  const refresh = useCallback(() => {
    const u = getSession();
    setUser(u);
    setLoading(false);
    if (u) {
      setCartState(readCart(u.id));
    } else {
      setCartState([]);
    }
  }, []);

  useEffect(() => {
    initializeAdmin();
    refresh();
    const handler = () => refresh();
    window.addEventListener("bh-auth-changed", handler);
    return () => window.removeEventListener("bh-auth-changed", handler);
  }, [refresh]);

  const logout = useCallback(() => {
    authLogout();
    setCartState([]);
  }, []);

  const persistCart = useCallback((items: CartItem[], userId: string) => {
    setCartState(items);
    writeCart(userId, items);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    if (!user) return;
    setCartState((prev) => {
      const idx = prev.findIndex((i) => i.productId === item.productId);
      const updated = idx >= 0
        ? prev.map((i, n) => n === idx ? { ...i, qty: i.qty + item.qty } : i)
        : [...prev, item];
      writeCart(user.id, updated);
      return updated;
    });
  }, [user]);

  const removeFromCart = useCallback((productId: string) => {
    if (!user) return;
    setCartState((prev) => {
      const updated = prev.filter((i) => i.productId !== productId);
      writeCart(user.id, updated);
      return updated;
    });
  }, [user]);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (!user) return;
    setCartState((prev) => {
      const updated = qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => i.productId === productId ? { ...i, qty } : i);
      writeCart(user.id, updated);
      return updated;
    });
  }, [user]);

  const clearCart = useCallback(() => {
    if (!user) return;
    writeCart(user.id, []);
    setCartState([]);
  }, [user]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AuthContext.Provider value={{
      user, loading, logout, refresh,
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartCount, cartTotal,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
