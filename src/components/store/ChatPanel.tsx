import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useChat, type ChatThread } from "@/context/ChatContext";

export function ChatPanel({ thread, asRole, vendor, customerEmail, customerName, productTitle }: {
  thread?: ChatThread;
  asRole: "customer" | "vendor";
  vendor: string;
  customerEmail: string;
  customerName: string;
  productTitle?: string;
}) {
  const { send } = useChat();
  const [text, setText] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight }); }, [thread?.messages.length]);

  return (
    <div className="rounded-2xl border border-border bg-card flex flex-col h-[500px] shadow-[var(--shadow-soft)] overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground text-sm font-bold">
          {(asRole === "customer" ? vendor : customerName).charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm truncate">{asRole === "customer" ? vendor : customerName}</div>
          <div className="text-xs text-muted-foreground truncate">{productTitle ?? thread?.productTitle ?? "General inquiry"}</div>
        </div>
      </div>
      <div ref={ref} className="flex-1 overflow-auto p-4 space-y-2 bg-secondary/20">
        {(thread?.messages ?? []).length === 0 && (
          <p className="text-center text-xs text-muted-foreground mt-6">Start the conversation 👋</p>
        )}
        {thread?.messages.map((m) => {
          const mine = m.from === asRole;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
                <div>{m.text}</div>
                <div className={`text-[10px] mt-0.5 ${mine ? "opacity-80" : "text-muted-foreground"}`}>
                  {new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        send(vendor, customerEmail, customerName, asRole, text.trim(), productTitle);
        setText("");
      }}
        className="border-t border-border p-3 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…"
          className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <button className="rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-4 py-2 text-sm font-bold inline-flex items-center gap-1">
          <Send className="h-4 w-4"/> Send
        </button>
      </form>
    </div>
  );
}
