import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "@/data/products";

export type VendorProduct = Product & { vendor: string };
export type VendorOrder = {
  id: string;
  productId: number;
  title: string;
  qty: number;
  total: number;
  customer: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
};

type Ctx = {
  vendor: { name: string; email: string; shop: string } | null;
  login: (email: string, name?: string, shop?: string) => void;
  logout: () => void;
  products: VendorProduct[];
  addProduct: (p: Omit<VendorProduct, "id">) => void;
  updateProduct: (id: number, p: Partial<VendorProduct>) => void;
  deleteProduct: (id: number) => void;
  orders: VendorOrder[];
  setOrderStatus: (id: string, s: VendorOrder["status"]) => void;
};

const VCtx = createContext<Ctx | null>(null);

const seedOrders: VendorOrder[] = [
  { id: "ORD-1042", productId: 1, title: "iPhone 15 Pro", qty: 1, total: 129999, customer: "Aarav Sharma", status: "Pending", date: "2026-05-04" },
  { id: "ORD-1041", productId: 5, title: "Fresh Organic Apples", qty: 3, total: 747, customer: "Priya Mehta", status: "Shipped", date: "2026-05-03" },
  { id: "ORD-1040", productId: 12, title: "Smart Fitness Watch", qty: 2, total: 9998, customer: "Rohan Iyer", status: "Delivered", date: "2026-05-01" },
  { id: "ORD-1039", productId: 7, title: "Modern Wooden Sofa", qty: 1, total: 25999, customer: "Neha Kapoor", status: "Delivered", date: "2026-04-29" },
];

export function VendorProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendor] = useState<Ctx["vendor"]>(null);
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>(seedOrders);

  useEffect(() => {
    try {
      const v = localStorage.getItem("apj-vendor");
      if (v) setVendor(JSON.parse(v));
      const p = localStorage.getItem("apj-vendor-products");
      if (p) setProducts(JSON.parse(p));
      const o = localStorage.getItem("apj-vendor-orders");
      if (o) setOrders(JSON.parse(o));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("apj-vendor", JSON.stringify(vendor));
  }, [vendor]);
  useEffect(() => {
    localStorage.setItem("apj-vendor-products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem("apj-vendor-orders", JSON.stringify(orders));
  }, [orders]);

  const login = (email: string, name = "Vendor", shop = "My Shop") =>
    setVendor({ email, name, shop });
  const logout = () => setVendor(null);

  const addProduct = (p: Omit<VendorProduct, "id">) =>
    setProducts((cur) => [{ ...p, id: Date.now() }, ...cur]);
  const updateProduct = (id: number, p: Partial<VendorProduct>) =>
    setProducts((cur) => cur.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const deleteProduct = (id: number) =>
    setProducts((cur) => cur.filter((x) => x.id !== id));

  const setOrderStatus = (id: string, status: VendorOrder["status"]) =>
    setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status } : o)));

  return (
    <VCtx.Provider value={{ vendor, login, logout, products, addProduct, updateProduct, deleteProduct, orders, setOrderStatus }}>
      {children}
    </VCtx.Provider>
  );
}

export function useVendor() {
  const c = useContext(VCtx);
  if (!c) throw new Error("useVendor must be used within VendorProvider");
  return c;
}