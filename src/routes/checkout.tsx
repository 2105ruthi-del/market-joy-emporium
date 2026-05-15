import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useNotifications } from "@/context/NotificationsContext";
import { formatINR } from "@/components/store/ProductCard";
import { useState } from "react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — APJ Store" }, { name: "description", content: "Complete your order securely on APJ Store." }] }),
  component: Checkout,
});

const PAY_OPTIONS = ["UPI", "Credit / Debit Card", "Net Banking", "Wallet", "Cash on Delivery"];

function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { push } = useNotifications();
  const nav = useNavigate();
  const ship = total > 999 ? 0 : 49;

  const def = user?.addresses.find((a) => a.isDefault) ?? user?.addresses[0];
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({
    fullName: def?.fullName ?? user?.name ?? "",
    phone: def?.phone ?? user?.phone ?? "",
    line1: def?.line1 ?? "",
    line2: def?.line2 ?? "",
    city: def?.city ?? "",
    pincode: def?.pincode ?? "",
  });
  const [pay, setPay] = useState("UPI");

  if (!user) {
    return (
      <div className="mx-auto max-w-md text-center py-24 px-4">
        <h1 className="text-2xl font-extrabold">Sign in to checkout</h1>
        <p className="mt-2 text-muted-foreground">Please log in to place your order.</p>
        <button onClick={() => nav({ to: "/login", search: { redirect: "/checkout" } })}
          className="mt-6 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-6 py-3 text-sm font-bold">
          Go to Login
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-24 px-4">
        <h1 className="text-2xl font-extrabold">Your cart is empty</h1>
        <button onClick={() => nav({ to: "/shop" })} className="mt-6 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-bold">
          Start Shopping
        </button>
      </div>
    );
  }

  const placeOrder = () => {
    const order = createOrder({
      customerEmail: user.email,
      customerName: user.name,
      items: items.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        image: i.product.image,
        price: i.product.price,
        quantity: i.quantity,
        vendor: (i.product as any).vendor ?? "APJ Store",
        category: i.product.category,
      })),
      subtotal: total,
      shipping: ship,
      total: total + ship,
      address: addr,
      payment: { method: pay, status: pay === "Cash on Delivery" ? "COD" : "Paid" },
    });
    push({ title: "Order placed 🎉", body: `Your order ${order.id} has been placed.`, link: `/order/${order.id}` });
    clear();
    nav({ to: "/order/$id", params: { id: order.id } });
  };

  const Stepper = () => (
    <div className="flex items-center gap-2 mb-6">
      {["Address", "Payment", "Review"].map((s, i) => {
        const n = i + 1;
        return (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-7 w-7 grid place-items-center rounded-full text-xs font-bold ${step >= n ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{n}</div>
            <span className={`text-sm font-semibold ${step >= n ? "" : "text-muted-foreground"}`}>{s}</span>
            {i < 2 && <span className="w-8 h-px bg-border mx-1" />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
        <Stepper />

        {step === 1 && (
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-bold mb-4">Delivery Address</h2>
            {user.addresses.length > 0 && (
              <div className="mb-4 grid gap-2">
                {user.addresses.map((a) => (
                  <button key={a.id} type="button" onClick={() => setAddr({ fullName: a.fullName, phone: a.phone, line1: a.line1, line2: a.line2 ?? "", city: a.city, pincode: a.pincode })}
                    className="text-left rounded-xl border border-border p-3 text-sm hover:border-primary">
                    <div className="font-semibold">{a.label} • {a.fullName}</div>
                    <div className="text-xs text-muted-foreground">{a.line1}, {a.city} — {a.pincode}</div>
                  </button>
                ))}
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              <input required placeholder="Full Name" value={addr.fullName} onChange={(e) => setAddr({ ...addr, fullName: e.target.value })} className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <input required placeholder="Phone" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <input required placeholder="Address Line 1" value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} className="md:col-span-2 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <input placeholder="Address Line 2 (optional)" value={addr.line2} onChange={(e) => setAddr({ ...addr, line2: e.target.value })} className="md:col-span-2 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <input required placeholder="City" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <input required placeholder="Pincode" value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button type="button" disabled={!addr.fullName || !addr.line1 || !addr.city || !addr.pincode}
              onClick={() => setStep(2)}
              className="mt-5 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-6 py-2.5 text-sm font-bold disabled:opacity-50">
              Continue to Payment
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-bold mb-4">Payment Method</h2>
            <div className="grid gap-2">
              {PAY_OPTIONS.map((m) => (
                <label key={m} className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${pay === m ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}>
                  <input type="radio" name="pay" checked={pay === m} onChange={() => setPay(m)} className="accent-primary"/>
                  <span className="text-sm font-medium">{m}</span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">Back</button>
              <button type="button" onClick={() => setStep(3)} className="rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-6 py-2.5 text-sm font-bold">
                Review Order
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] space-y-4">
            <h2 className="font-bold">Review & Place Order</h2>
            <div className="rounded-xl bg-secondary/30 p-4 text-sm">
              <div className="font-semibold">{addr.fullName} • {addr.phone}</div>
              <div className="text-muted-foreground">{addr.line1}{addr.line2 ? ", " + addr.line2 : ""}, {addr.city} — {addr.pincode}</div>
            </div>
            <div className="rounded-xl bg-secondary/30 p-4 text-sm">
              <div className="text-xs text-muted-foreground">Payment</div>
              <div className="font-semibold">{pay}</div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">Back</button>
              <button type="button" onClick={placeOrder}
                className="rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-6 py-2.5 text-sm font-bold shadow-[var(--shadow-glow)]">
                Place Order — {formatINR(total + ship)}
              </button>
            </div>
          </section>
        )}
      </div>

      <aside className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] h-fit">
        <h2 className="font-bold mb-4">Order Summary</h2>
        <div className="space-y-3 max-h-72 overflow-auto">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-3 text-sm">
              <img src={product.image} alt="" className="h-12 w-12 rounded-lg object-cover bg-secondary"/>
              <div className="flex-1 min-w-0">
                <div className="font-medium line-clamp-1">{product.title}</div>
                <div className="text-xs text-muted-foreground">Qty {quantity}</div>
              </div>
              <div className="font-semibold">{formatINR(product.price * quantity)}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-border my-4" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(total)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{ship === 0 ? "FREE" : formatINR(ship)}</span></div>
          <div className="flex justify-between text-base font-extrabold pt-2"><span>Total</span><span>{formatINR(total + ship)}</span></div>
        </div>
      </aside>
    </div>
  );
}
