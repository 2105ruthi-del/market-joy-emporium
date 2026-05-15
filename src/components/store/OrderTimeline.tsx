import { Check, Clock, X } from "lucide-react";
import { ORDER_FLOW, type Order, type OrderStatus } from "@/context/OrdersContext";

export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "Cancelled") {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 flex items-center gap-3 text-sm">
        <X className="h-5 w-5 text-destructive" />
        <div>
          <div className="font-semibold text-destructive">Order Cancelled</div>
          <div className="text-xs text-muted-foreground">This order was cancelled.</div>
        </div>
      </div>
    );
  }
  const reachedIdx = ORDER_FLOW.indexOf(order.status);
  return (
    <ol className="relative border-l-2 border-border ml-3 space-y-5">
      {ORDER_FLOW.map((s, i) => {
        const done = i <= reachedIdx;
        const current = i === reachedIdx;
        const ev = order.history.find((h) => h.status === s);
        return (
          <li key={s} className="ml-5 relative">
            <span className={`absolute -left-[34px] grid place-items-center h-7 w-7 rounded-full border-2 ${done ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"}`}>
              {done ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
            </span>
            <div className={`text-sm font-semibold ${done ? "" : "text-muted-foreground"}`}>{s}{current && " (current)"}</div>
            {ev && <div className="text-xs text-muted-foreground">{new Date(ev.at).toLocaleString()}</div>}
          </li>
        );
      })}
    </ol>
  );
}

export function statusBadgeClass(s: OrderStatus) {
  if (s === "Delivered") return "bg-success/15 text-[var(--success)]";
  if (s === "Cancelled") return "bg-destructive/15 text-destructive";
  if (s === "Shipped" || s === "Out for Delivery") return "bg-primary/15 text-primary";
  return "bg-accent/20 text-accent-foreground";
}
