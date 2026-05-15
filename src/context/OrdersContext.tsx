import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export const ORDER_FLOW: OrderStatus[] = [
  "Pending",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export type OrderItem = {
  productId: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
  vendor: string;
  category: string;
};

export type OrderAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
};

export type Order = {
  id: string;
  customerEmail: string;
  customerName: string;
  date: string; // ISO
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: OrderAddress;
  payment: { method: string; status: "Paid" | "COD" | "Pending" };
  status: OrderStatus;
  history: { status: OrderStatus; at: string }[];
  estimatedDelivery: string;
  vendorAccepted?: boolean;
};

type Ctx = {
  orders: Order[];
  createOrder: (o: Omit<Order, "id" | "date" | "status" | "history" | "estimatedDelivery">) => Order;
  updateStatus: (id: string, status: OrderStatus) => void;
  acceptOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
  ordersFor: (email: string) => Order[];
};

const OCtx = createContext<Ctx | null>(null);

const seed: Order[] = [
  {
    id: "APJ-2415",
    customerEmail: "demo@apj.com",
    customerName: "Aarav Sharma",
    date: new Date(Date.now() - 86400000 * 11).toISOString(),
    items: [
      { productId: 1, title: "iPhone 15 Pro", image: "", price: 129999, quantity: 1, vendor: "AppleHub Store", category: "Electronics" },
    ],
    subtotal: 129999,
    shipping: 0,
    total: 129999,
    address: { fullName: "Aarav Sharma", phone: "+91 90000 00000", line1: "12 Lake View Apt", city: "Mumbai", pincode: "400001" },
    payment: { method: "UPI", status: "Paid" },
    status: "Delivered",
    history: [
      { status: "Pending", at: new Date(Date.now() - 86400000 * 11).toISOString() },
      { status: "Processing", at: new Date(Date.now() - 86400000 * 10).toISOString() },
      { status: "Shipped", at: new Date(Date.now() - 86400000 * 9).toISOString() },
      { status: "Delivered", at: new Date(Date.now() - 86400000 * 7).toISOString() },
    ],
    estimatedDelivery: new Date(Date.now() - 86400000 * 7).toISOString(),
    vendorAccepted: true,
  },
];

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seed);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("apj-orders");
      if (raw) setOrders(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("apj-orders", JSON.stringify(orders));
  }, [orders]);

  const createOrder: Ctx["createOrder"] = (o) => {
    const id = "APJ-" + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString();
    const eta = new Date(Date.now() + 86400000 * 5).toISOString();
    const order: Order = {
      ...o,
      id,
      date: now,
      status: "Pending",
      history: [{ status: "Pending", at: now }],
      estimatedDelivery: eta,
    };
    setOrders((cur) => [order, ...cur]);
    return order;
  };

  const updateStatus = (id: string, status: OrderStatus) =>
    setOrders((cur) =>
      cur.map((o) =>
        o.id === id
          ? { ...o, status, history: [...o.history, { status, at: new Date().toISOString() }] }
          : o
      )
    );

  const acceptOrder = (id: string) =>
    setOrders((cur) =>
      cur.map((o) => (o.id === id ? { ...o, vendorAccepted: true, status: "Processing", history: [...o.history, { status: "Processing", at: new Date().toISOString() }] } : o))
    );

  const cancelOrder = (id: string) => updateStatus(id, "Cancelled");

  const getOrder = (id: string) => orders.find((o) => o.id === id);
  const ordersFor = (email: string) => orders.filter((o) => o.customerEmail === email);

  return (
    <OCtx.Provider value={{ orders, createOrder, updateStatus, acceptOrder, cancelOrder, getOrder, ordersFor }}>
      {children}
    </OCtx.Provider>
  );
}

export function useOrders() {
  const c = useContext(OCtx);
  if (!c) throw new Error("useOrders must be used within OrdersProvider");
  return c;
}
