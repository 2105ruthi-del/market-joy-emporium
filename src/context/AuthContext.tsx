import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
};

type Ctx = {
  user: Customer | null;
  login: (email: string, name?: string, phone?: string) => void;
  register: (name: string, email: string, phone: string) => void;
  logout: () => void;
  update: (patch: Partial<Customer>) => void;
  addAddress: (a: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
};

const ACtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("apj-user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    if (user) localStorage.setItem("apj-user", JSON.stringify(user));
    else localStorage.removeItem("apj-user");
  }, [user]);

  const login = (email: string, name = "Aarav Sharma", phone = "+91 90000 00000") =>
    setUser({ name, email, phone, addresses: [] });

  const register = (name: string, email: string, phone: string) =>
    setUser({ name, email, phone, addresses: [] });

  const logout = () => setUser(null);

  const update = (patch: Partial<Customer>) =>
    setUser((u) => (u ? { ...u, ...patch } : u));

  const addAddress = (a: Omit<Address, "id">) =>
    setUser((u) => {
      if (!u) return u;
      const next = { ...a, id: "addr-" + Date.now() };
      const list = [...u.addresses, next];
      if (a.isDefault) list.forEach((x) => (x.isDefault = x.id === next.id));
      else if (list.length === 1) list[0].isDefault = true;
      return { ...u, addresses: list };
    });

  const removeAddress = (id: string) =>
    setUser((u) => (u ? { ...u, addresses: u.addresses.filter((a) => a.id !== id) } : u));

  const setDefaultAddress = (id: string) =>
    setUser((u) =>
      u ? { ...u, addresses: u.addresses.map((a) => ({ ...a, isDefault: a.id === id })) } : u
    );

  return (
    <ACtx.Provider value={{ user, login, register, logout, update, addAddress, removeAddress, setDefaultAddress }}>
      {children}
    </ACtx.Provider>
  );
}

export function useAuth() {
  const c = useContext(ACtx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
