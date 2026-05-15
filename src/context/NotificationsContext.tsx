import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Notification = {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  link?: string;
};

type Ctx = {
  notifications: Notification[];
  unread: number;
  push: (n: Omit<Notification, "id" | "at" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
};

const NCtx = createContext<Ctx | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("apj-notif");
      if (raw) setNotifications(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("apj-notif", JSON.stringify(notifications));
  }, [notifications]);

  const push: Ctx["push"] = (n) =>
    setNotifications((cur) => [
      { ...n, id: "n" + Date.now() + Math.random(), at: new Date().toISOString(), read: false },
      ...cur,
    ].slice(0, 30));

  const markRead = (id: string) =>
    setNotifications((cur) => cur.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((cur) => cur.map((n) => ({ ...n, read: true })));
  const clear = () => setNotifications([]);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <NCtx.Provider value={{ notifications, unread, push, markRead, markAllRead, clear }}>
      {children}
    </NCtx.Provider>
  );
}

export function useNotifications() {
  const c = useContext(NCtx);
  if (!c) throw new Error("useNotifications must be used within NotificationsProvider");
  return c;
}
