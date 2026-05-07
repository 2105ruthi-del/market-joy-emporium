import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/components/store/ProductCard";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — APJ Store" }, { name: "description", content: "Complete your order securely on APJ Store." }] }),
  component: Checkout,
});

function Checkout() {
  const { items, total, clear } = useCart();
  const [done, setDone] = useState(false);
  const nav = useNavigate();
  const ship = total > 999 ? 0 : 49;

  if (done) {
    return (
      <div className="mx-auto max-w-md text-center py-24 px-4">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-6 text-2xl font-extrabold">Order placed successfully!</h1>
        <p className="mt-2 text-muted-foreground">Thank you for shopping with APJ Store. A confirmation will be sent shortly.</p>
        <button onClick={() => nav({ to: "/" })} className="mt-6 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-6 py-3 text-sm font-bold">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid lg:grid-cols-3 gap-8">
      <form onSubmit={(e) => { e.preventDefault(); clear(); setDone(true); }} className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-bold mb-4">Shipping Address</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {["Full Name", "Phone", "Address Line 1", "Address Line 2", "City", "Pincode"].map((l) => (
              <input key={l} required={l !== "Address Line 2"} placeholder={l}
                className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-bold mb-4">Payment Method</h2>
          <div className="grid gap-2">
            {["UPI", "Credit / Debit Card", "Net Banking", "Cash on Delivery"].map((m, i) => (
              <label key={m} className="flex items-center gap-3 rounded-xl border border-border p-3 cursor-pointer hover:border-primary">
                <input type="radio" name="pay" defaultChecked={i === 0} className="accent-primary"/>
                <span className="text-sm font-medium">{m}</span>
              </label>
            ))}
          </div>
        </section>

        <button type="submit" disabled={items.length === 0}
          className="w-full rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground py-3.5 text-sm font-bold shadow-[var(--shadow-glow)] disabled:opacity-50">
          Place Order — {formatINR(total + ship)}
        </button>
      </form>

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
