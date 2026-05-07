import { useEffect, useState } from "react";
import { products as base, type Product } from "@/data/products";
import type { VendorProduct } from "@/context/VendorContext";

function read(): Product[] {
  try {
    const raw = localStorage.getItem("apj-vendor-products");
    if (!raw) return base;
    const vp = JSON.parse(raw) as VendorProduct[];
    return [...vp, ...base];
  } catch {
    return base;
  }
}

export function useAllProducts() {
  const [list, setList] = useState<Product[]>(base);
  useEffect(() => {
    setList(read());
    const onStorage = () => setList(read());
    window.addEventListener("storage", onStorage);
    const i = setInterval(() => setList(read()), 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(i);
    };
  }, []);
  return list;
}