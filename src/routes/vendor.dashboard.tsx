import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, ShoppingBag, Package, IndianRupee, ArrowUpRight } from "lucide-react";
import { useVendor } from "@/context/VendorContext";

export const Route = createFileRoute("/vendor/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { vendor, products, orders } = useVendor();
  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "Pending").length;

  const stats = [
    { label: "Total Revenue", value: "₹" + revenue.toLocaleString("en-IN"), icon: IndianRupee, change: "+18.2%" },
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, change: "+12.4%" },
    { label: "Active Products", value: products.length, icon: Package, change: products.length === 0 ? "Add some" : "Live" },
    { label: "Pending", value: pending, icon: TrendingUp, change: "Action needed" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {vendor?.name}</h1>
        <p className="text-muted-foreground mt-1">Here's how your shop is performing today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-success" style={{ color: "var(--success)" }}>{s.change}</span>
            </div>
            <div className="mt-4 text-2xl font-extrabold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Orders</h2>
            <Link to="/vendor/orders" className="text-sm text-primary font-medium inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{o.title}</div>
                  <div className="text-xs text-muted-foreground">{o.id} • {o.customer}</div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="font-bold text-sm">₹{o.total.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-muted-foreground">{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-[image:var(--gradient-primary)] text-primary-foreground p-6 shadow-[var(--shadow-glow)]">
          <h3 className="text-lg font-extrabold">Boost your sales</h3>
          <p className="text-sm opacity-90 mt-2">Add more products and join APJ Premium Sellers to get featured placements.</p>
          <Link to="/vendor/products" className="mt-4 inline-flex rounded-full bg-background text-foreground px-4 py-2 text-sm font-semibold">
            Add Product
          </Link>
        </div>
      </div>
    </div>
  );
}