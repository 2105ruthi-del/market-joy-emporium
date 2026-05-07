import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/components/store/ProductCard";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — APJ Store" }, { name: "description", content: "Review items in your shopping cart." }] }),
  component: Cart,
});

function Cart() {
  const { items, remove, setQty, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-24 px-4">
        <div className="mx-auto h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-6 py-3 text-sm font-semibold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">Your Cart ({items.length})</h1>
        <div className="space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
              <Link to="/product/$id" params={{ id: String(product.id) }} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to="/product/$id" params={{ id: String(product.id) }} className="font-semibold hover:text-primary line-clamp-1">{product.title}</Link>
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-border overflow-hidden text-sm">
                    <button onClick={() => setQty(product.id, quantity - 1)} className="p-1.5 hover:bg-secondary"><Minus className="h-3 w-3"/></button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button onClick={() => setQty(product.id, quantity + 1)} className="p-1.5 hover:bg-secondary"><Plus className="h-3 w-3"/></button>
                  </div>
                  <button onClick={() => remove(product.id)} className="text-sm text-destructive hover:underline inline-flex items-center gap-1">
                    <Trash2 className="h-3.5 w-3.5"/> Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatINR(product.price * quantity)}</div>
                <div className="text-xs text-muted-foreground">{formatINR(product.price)} each</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] h-fit sticky top-24">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(total)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span className="text-primary font-semibold">{total > 999 ? "FREE" : formatINR(49)}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Tax (incl.)</span><span>—</span></div>
        </div>
        <div className="border-t border-border my-4" />
        <div className="flex justify-between text-lg font-extrabold">
          <span>Total</span><span>{formatINR(total + (total > 999 ? 0 : 49))}</span>
        </div>
        <Link to="/checkout" className="mt-5 block text-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground py-3 text-sm font-bold shadow-[var(--shadow-glow)] hover:opacity-95">
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}
