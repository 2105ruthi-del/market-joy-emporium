import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Store, BarChart3, Leaf } from "lucide-react";
import { useVendor } from "@/context/VendorContext";
import { useState } from "react";

export const Route = createFileRoute("/vendor")({
  head: () => ({
    meta: [
      { title: "Vendor Portal — APJ Store" },
      { name: "description", content: "Sell on APJ Store. Manage your shop, products, and orders." },
    ],
  }),
  component: VendorLayout,
});

function VendorLayout() {
  const { vendor, login, logout } = useVendor();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [shop, setShop] = useState("");

  if (!vendor) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Vendor Sign In</h1>
              <p className="text-xs text-muted-foreground">Manage your APJ Store shop</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(email || "vendor@apj.com", name || "Vendor", shop || "My Shop");
              navigate({ to: "/vendor/dashboard" });
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold">Shop Name</label>
              <input value={shop} onChange={(e) => setShop(e.target.value)}
                placeholder="Acme Organic Co." required
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-semibold">Your Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Riya Patel" required
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-semibold">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)}
                type="email" placeholder="riya@shop.com" required
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button className="w-full rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground py-2.5 text-sm font-bold shadow-[var(--shadow-glow)]">
              Enter Vendor Portal
            </button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Demo portal — no real account required.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: BarChart3, label: "Track Sales" },
            { icon: Package, label: "Manage Stock" },
            { icon: Leaf, label: "Grow Faster" },
          ].map((b) => (
            <div key={b.label} className="rounded-xl border border-border bg-card/60 p-3">
              <b.icon className="h-5 w-5 mx-auto text-primary mb-1" />
              <div className="text-xs font-medium">{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/vendor/products", label: "Products", icon: Package },
    { to: "/vendor/orders", label: "Orders", icon: ShoppingBag },
    { to: "/vendor/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 md:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border border-border bg-card p-4 h-fit md:sticky md:top-20 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
          <div className="h-9 w-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground">
            <Store className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm truncate">{vendor.shop}</div>
            <div className="text-[10px] text-muted-foreground truncate">{vendor.email}</div>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5">
          {nav.map((i) => {
            const active = path === i.to || (i.to === "/vendor/dashboard" && path === "/vendor");
            return (
              <Link key={i.to} to={i.to as any}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-secondary"}`}>
                <i.icon className="h-4 w-4" /> {i.label}
              </Link>
            );
          })}
          <button
            onClick={() => { logout(); navigate({ to: "/" }); }}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 mt-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}