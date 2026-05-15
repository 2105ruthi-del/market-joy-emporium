import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useOrders, ORDER_FLOW, type OrderStatus } from "@/context/OrdersContext";
import { useNotifications } from "@/context/NotificationsContext";
import { statusBadgeClass } from "@/components/store/OrderTimeline";

export const Route = createFileRoute("/vendor/orders")({
  component: VendorOrders,
});

const STATUSES: OrderStatus[] = [...ORDER_FLOW, "Cancelled"];

function VendorOrders() {
  const { orders, updateStatus, acceptOrder, cancelOrder } = useOrders();
  const { push } = useNotifications();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground mt-1">{orders.length} total orders • {orders.filter((o) => o.status === "Pending").length} pending action</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm">
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">No orders to show.</div>
      ) : (
        <div className="space-y-3">
          {list.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-bold">{o.id} <span className="text-xs text-muted-foreground font-normal">• {new Date(o.date).toLocaleString()}</span></div>
                  <div className="text-sm text-muted-foreground">{o.customerName} • {o.customerEmail}</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClass(o.status)}`}>{o.status}</span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] items-center">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex -space-x-2">
                    {o.items.slice(0, 3).map((it) => (
                      <img key={it.productId} src={it.image} alt="" className="h-12 w-12 rounded-lg border-2 border-card object-cover bg-secondary" />
                    ))}
                  </div>
                  <div className="min-w-0 text-sm">
                    <div className="font-semibold line-clamp-1">{o.items[0]?.title}{o.items.length > 1 && ` + ${o.items.length - 1} more`}</div>
                    <div className="text-xs text-muted-foreground">{o.payment.method} • {o.payment.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{o.total.toLocaleString("en-IN")}</div>
                  <div className="text-xs text-muted-foreground">Ship to {o.address.city} — {o.address.pincode}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {o.status === "Pending" && (
                  <>
                    <button onClick={() => { acceptOrder(o.id); push({ title: "Order accepted", body: `${o.id} moved to Processing`, link: `/order/${o.id}` }); }}
                      className="rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-4 py-1.5 text-xs font-bold">Accept Order</button>
                    <button onClick={() => cancelOrder(o.id)}
                      className="rounded-full border border-destructive/40 text-destructive px-4 py-1.5 text-xs font-semibold hover:bg-destructive/10 inline-flex items-center gap-1">
                      <X className="h-3 w-3"/> Reject
                    </button>
                  </>
                )}
                {o.status !== "Pending" && o.status !== "Delivered" && o.status !== "Cancelled" && (
                  <select value={o.status} onChange={(e) => { updateStatus(o.id, e.target.value as OrderStatus); push({ title: "Status updated", body: `${o.id} → ${e.target.value}`, link: `/order/${o.id}` }); }}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold">
                    {STATUSES.filter((s) => s !== "Pending").map((s) => <option key={s}>{s}</option>)}
                  </select>
                )}
                <Link to="/order/$id" params={{ id: o.id }}
                  className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-secondary">View</Link>
                <Link to="/vendor/chat"
                  className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-secondary inline-flex items-center gap-1">
                  <MessageCircle className="h-3 w-3"/> Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
