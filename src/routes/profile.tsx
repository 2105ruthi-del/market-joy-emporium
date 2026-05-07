import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Package, Heart, MapPin, CreditCard, LogOut, Settings, Store } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Account — APJ Store" }] }),
  component: Profile,
});

const orders = [
  { id: "APJ-2415", date: "May 4, 2026", total: 30498, status: "Delivered", items: 2 },
  { id: "APJ-2387", date: "Apr 28, 2026", total: 4999, status: "Shipped", items: 1 },
  { id: "APJ-2301", date: "Apr 12, 2026", total: 1499, status: "Delivered", items: 1 },
];

function Profile() {
  const { count: wcount } = useWishlist();
  const { count: ccount } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-border bg-card p-6 h-fit shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground text-xl font-bold">A</div>
          <div>
            <div className="font-semibold">Aarav Sharma</div>
            <div className="text-xs text-muted-foreground">aarav@example.com</div>
          </div>
        </div>
        <nav className="mt-6 flex flex-col gap-1 text-sm">
          {[
            { icon: User, label: "Profile", to: "/profile" },
            { icon: Package, label: "My Orders", to: "/profile" },
            { icon: Heart, label: `Wishlist (${wcount})`, to: "/wishlist" },
            { icon: MapPin, label: "Addresses", to: "/profile" },
            { icon: CreditCard, label: "Payments", to: "/profile" },
            { icon: Store, label: "Vendor Portal", to: "/vendor" },
            { icon: Settings, label: "Settings", to: "/profile" },
          ].map((i) => (
            <Link key={i.label} to={i.to as any}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-secondary transition-colors">
              <i.icon className="h-4 w-4 text-muted-foreground" /> {i.label}
            </Link>
          ))}
          <Link to="/login" className="flex items-center gap-2.5 rounded-lg px-3 py-2 mt-2 text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Sign Out
          </Link>
        </nav>
      </aside>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Orders", value: orders.length },
            { label: "Wishlist", value: wcount },
            { label: "In Cart", value: ccount },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Link to="/profile" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground bg-secondary/30">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-6 py-3 font-semibold">{o.id}</td>
                  <td className="px-6 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-6 py-3">{o.items}</td>
                  <td className="px-6 py-3 font-semibold">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      o.status === "Delivered" ? "bg-success/15" : "bg-accent/20 text-accent-foreground"
                    }`} style={o.status === "Delivered" ? { color: "var(--success)" } : undefined}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}