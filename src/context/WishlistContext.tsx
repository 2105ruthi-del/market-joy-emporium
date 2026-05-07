import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Ctx = {
  ids: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  remove: (id: number) => void;
  count: number;
};

const WCtx = createContext<Ctx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("apj-wishlist");
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("apj-wishlist", JSON.stringify(ids));
  }, [ids]);

  const toggle = (id: number) =>
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const remove = (id: number) => setIds((cur) => cur.filter((x) => x !== id));
  const has = (id: number) => ids.includes(id);

  return (
    <WCtx.Provider value={{ ids, toggle, has, remove, count: ids.length }}>
      {children}
    </WCtx.Provider>
  );
}

export function useWishlist() {
  const c = useContext(WCtx);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
}