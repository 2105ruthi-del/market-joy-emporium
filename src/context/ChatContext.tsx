import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ChatMessage = {
  id: string;
  from: "customer" | "vendor";
  text: string;
  at: string;
};

export type ChatThread = {
  vendor: string; // vendor shop name (also id)
  customerEmail: string;
  customerName: string;
  productTitle?: string;
  messages: ChatMessage[];
};

type Ctx = {
  threads: ChatThread[];
  threadKey: (vendor: string, email: string) => string;
  getThread: (vendor: string, email: string) => ChatThread | undefined;
  send: (vendor: string, email: string, name: string, from: "customer" | "vendor", text: string, productTitle?: string) => void;
  threadsForVendor: (vendor: string) => ChatThread[];
  threadsForCustomer: (email: string) => ChatThread[];
};

const CCtx = createContext<Ctx | null>(null);

const seed: ChatThread[] = [
  {
    vendor: "AppleHub Store",
    customerEmail: "demo@apj.com",
    customerName: "Aarav Sharma",
    productTitle: "iPhone 15 Pro",
    messages: [
      { id: "m1", from: "customer", text: "Hi! Is this available in Natural Titanium?", at: new Date(Date.now() - 3600000 * 5).toISOString() },
      { id: "m2", from: "vendor", text: "Yes! We have all 4 colors in stock. Free express delivery available.", at: new Date(Date.now() - 3600000 * 4).toISOString() },
    ],
  },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<ChatThread[]>(seed);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("apj-chats");
      if (raw) setThreads(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("apj-chats", JSON.stringify(threads));
  }, [threads]);

  const threadKey = (vendor: string, email: string) => `${vendor}::${email}`;
  const getThread = (vendor: string, email: string) =>
    threads.find((t) => t.vendor === vendor && t.customerEmail === email);

  const send: Ctx["send"] = (vendor, email, name, from, text, productTitle) => {
    setThreads((cur) => {
      const i = cur.findIndex((t) => t.vendor === vendor && t.customerEmail === email);
      const msg: ChatMessage = { id: "m" + Date.now(), from, text, at: new Date().toISOString() };
      if (i === -1) {
        return [
          ...cur,
          { vendor, customerEmail: email, customerName: name, productTitle, messages: [msg] },
        ];
      }
      const next = [...cur];
      next[i] = { ...next[i], messages: [...next[i].messages, msg] };
      return next;
    });
  };

  const threadsForVendor = (vendor: string) => threads.filter((t) => t.vendor === vendor);
  const threadsForCustomer = (email: string) => threads.filter((t) => t.customerEmail === email);

  return (
    <CCtx.Provider value={{ threads, threadKey, getThread, send, threadsForVendor, threadsForCustomer }}>
      {children}
    </CCtx.Provider>
  );
}

export function useChat() {
  const c = useContext(CCtx);
  if (!c) throw new Error("useChat must be used within ChatProvider");
  return c;
}
