import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = { product: Product; quantity: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("apj-cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("apj-cart", JSON.stringify(items));
  }, [items]);

  const add = (p: Product, qty = 1) =>
    setItems((cur) => {
      const f = cur.find((i) => i.product.id === p.id);
      if (f) return cur.map((i) => (i.product.id === p.id ? { ...i, quantity: i.quantity + qty } : i));
      return [...cur, { product: p, quantity: qty }];
    });
  const remove = (id: number) => setItems((c) => c.filter((i) => i.product.id !== id));
  const setQty = (id: number, qty: number) =>
    setItems((c) => c.map((i) => (i.product.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.quantity * i.product.price, 0);

  return <Ctx.Provider value={{ items, add, remove, setQty, clear, count, total }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
