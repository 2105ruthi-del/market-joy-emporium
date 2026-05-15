import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Package, MapPin, MessageCircle, Download, ShoppingBag, Truck } from "lucide-react";
import { useOrders } from "@/context/OrdersContext";
import { OrderTimeline, statusBadgeClass } from "@/components/store/OrderTimeline";
import { formatINR } from "@/components/store/ProductCard";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [{ title: "Order Details — APJ Store" }] }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { getOrder } = useOrders();
  const nav = useNavigate();
  const order = getOrder(id);

  if (!order) {
    return (
      <div className="mx-auto max-w-md text-center py-24 px-4">
        <h1 className="text-2xl font-extrabold">Order not found</h1>
        <button onClick={() => nav({ to: "/profile" })} className="mt-6 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-bold">View My Orders</button>
      </div>
    );
  }

  const justPlaced = order.status === "Pending";
  const vendor = order.items[0]?.vendor ?? "APJ Store";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {justPlaced && (
        <div className="rounded-3xl bg-[image:var(--gradient-primary)] text-primary-foreground p-8 text-center mb-8 shadow-[var(--shadow-glow)]">
          <CheckCircle2 className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-3xl font-extrabold">Order placed successfully!</h1>
          <p className="mt-1 opacity-90">Thank you for shopping with APJ Store.</p>
          <p className="mt-3 text-sm opacity-90">Order ID: <span className="font-bold">{order.id}</span></p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg flex items-center gap-2"><Truck className="h-5 w-5 text-primary"/> Tracking</h2>
                <div className="text-xs text-muted-foreground mt-1">Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClass(order.status)}`}>{order.status}</span>
            </div>
            <OrderTimeline order={order} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Package className="h-5 w-5 text-primary"/> Items</h2>
            <div className="space-y-3">
              {order.items.map((it) => (
                <div key={it.productId} className="flex gap-3 items-center">
                  <img src={it.image} alt="" className="h-16 w-16 rounded-xl object-cover bg-secondary" />
                  <div className="flex-1 min-w-0">
                    <Link to="/product/$id" params={{ id: String(it.productId) }} className="font-semibold hover:text-primary line-clamp-1">{it.title}</Link>
                    <div className="text-xs text-muted-foreground">Sold by {it.vendor} • Qty {it.quantity}</div>
                  </div>
                  <div className="font-bold">{formatINR(it.price * it.quantity)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-bold mb-3 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/> Delivery Address</h2>
            <div className="text-sm">
              <div className="font-semibold">{order.address.fullName} • {order.address.phone}</div>
              <div className="text-muted-foreground">{order.address.line1}{order.address.line2 ? ", " + order.address.line2 : ""}, {order.address.city} — {order.address.pincode}</div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-bold mb-3">Summary</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
              <div className="flex justify-between font-extrabold text-base pt-2 border-t border-border mt-2"><span>Total</span><span>{formatINR(order.total)}</span></div>
              <div className="flex justify-between pt-1 text-xs text-muted-foreground"><span>Payment</span><span>{order.payment.method} • {order.payment.status}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <Link to="/chat/$vendor" params={{ vendor }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary text-primary px-4 py-2.5 text-sm font-bold hover:bg-primary hover:text-primary-foreground">
              <MessageCircle className="h-4 w-4" /> Chat with Vendor
            </Link>
            <button onClick={() => window.print()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
              <Download className="h-4 w-4" /> Download Invoice
            </button>
            <Link to="/shop" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-4 py-2.5 text-sm font-bold">
              <ShoppingBag className="h-4 w-4" /> Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
