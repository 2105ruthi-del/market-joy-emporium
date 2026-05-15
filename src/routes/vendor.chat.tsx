import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useVendor } from "@/context/VendorContext";
import { useChat } from "@/context/ChatContext";
import { ChatPanel } from "@/components/store/ChatPanel";

export const Route = createFileRoute("/vendor/chat")({
  component: VendorChat,
});

function VendorChat() {
  const { vendor } = useVendor();
  const { threadsForVendor, getThread } = useChat();
  const list = vendor ? threadsForVendor(vendor.shop) : [];
  const [active, setActive] = useState<string | null>(list[0]?.customerEmail ?? null);

  if (!vendor) return null;
  const thread = active ? getThread(vendor.shop, active) : undefined;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold tracking-tight">Customer Messages</h1>
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {list.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">No messages yet.</p>
          ) : list.map((t) => (
            <button key={t.customerEmail} onClick={() => setActive(t.customerEmail)}
              className={`w-full text-left p-3 border-b border-border last:border-0 hover:bg-secondary/50 ${active === t.customerEmail ? "bg-secondary/60" : ""}`}>
              <div className="font-semibold text-sm">{t.customerName}</div>
              <div className="text-xs text-muted-foreground truncate">{t.messages[t.messages.length - 1]?.text}</div>
            </button>
          ))}
        </div>
        <div>
          {thread ? (
            <ChatPanel thread={thread} asRole="vendor" vendor={vendor.shop}
              customerEmail={thread.customerEmail} customerName={thread.customerName} />
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground h-[500px] grid place-items-center">
              Select a conversation to view messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
