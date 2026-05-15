import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, Package, Heart, MapPin, LogOut, Settings, Store, MessageCircle, Truck, Plus, Trash2 } from "lucide-react";
import { useAuth, type Address } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { statusBadgeClass } from "@/components/store/OrderTimeline";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Account — APJ Store" }] }),
  component: Profile,
});

type Tab = "info" | "orders" | "wishlist" | "addresses" | "settings";

function Profile() {
  const { user, logout, update, addAddress, removeAddress, setDefaultAddress } = useAuth();
  const { count: wcount } = useWishlist();
  const { count: ccount } = useCart();
  const { ordersFor } = useOrders();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("orders");

  if (!user) {
    return (
      <div className="mx-auto max-w-md text-center py-24 px-4">
        <User className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-extrabold">Sign in to view your profile</h1>
        <button onClick={() => nav({ to: "/login", search: { redirect: "/profile" } })}
          className="mt-6 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-6 py-3 text-sm font-bold">
          Sign In
        </button>
      </div>
    );
  }

  const myOrders = ordersFor(user.email);

  const tabs: { id: Tab; icon: any; label: string }[] = [
    { id: "info", icon: User, label: "Personal Info" },
    { id: "orders", icon: Package, label: `Order History (${myOrders.length})` },
    { id: "wishlist", icon: Heart, label: `Wishlist (${wcount})` },
    { id: "addresses", icon: MapPin, label: "Saved Addresses" },
    { id: "settings", icon: Settings, label: "Account Settings" },
  ];

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-border bg-card p-6 h-fit shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground text-xl font-bold">{initial}</div>
          <div className="min-w-0">
            <div className="font-semibold truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>
        <nav className="mt-6 flex flex-col gap-1 text-sm">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors ${tab === t.id ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-secondary"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
          <Link to="/vendor" className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-secondary">
            <Store className="h-4 w-4 text-muted-foreground" /> Vendor Portal
          </Link>
          <button onClick={() => { logout(); nav({ to: "/" }); }}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 mt-2 text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </nav>
      </aside>

      <div className="space-y-6 min-w-0">
        {tab === "info" && <PersonalInfo />}
        {tab === "orders" && <OrderHistory orders={myOrders} ccount={ccount} wcount={wcount} />}
        {tab === "wishlist" && <WishlistTab />}
        {tab === "addresses" && <AddressesTab addAddress={addAddress} removeAddress={removeAddress} setDefaultAddress={setDefaultAddress} />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );

  function PersonalInfo() {
    const [form, setForm] = useState({ name: user!.name, email: user!.email, phone: user!.phone });
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-bold mb-4">Personal Information</h2>
        <div className="grid gap-3 md:grid-cols-2 text-sm">
          {(["name", "email", "phone"] as const).map((k) => (
            <label key={k} className="block">
              <span className="text-xs font-semibold capitalize">{k}</span>
              <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"/>
            </label>
          ))}
        </div>
        <button onClick={() => update(form)}
          className="mt-4 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2 text-sm font-bold">
          Save Changes
        </button>
      </div>
    );
  }

  function WishlistTab() {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-bold mb-2">Wishlist</h2>
        <p className="text-sm text-muted-foreground">View and manage your saved items.</p>
        <Link to="/wishlist" className="mt-4 inline-flex rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2 text-sm font-bold">
          Open Wishlist
        </Link>
      </div>
    );
  }

  function SettingsTab() {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] space-y-3">
        <h2 className="text-lg font-bold">Account Settings</h2>
        <div className="text-sm text-muted-foreground">Notifications, password, and privacy preferences.</div>
        <div className="grid gap-2 mt-2">
          {["Email notifications", "Order updates", "Promotional offers"].map((s) => (
            <label key={s} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <span>{s}</span>
              <input type="checkbox" defaultChecked className="accent-primary h-4 w-4" />
            </label>
          ))}
        </div>
      </div>
    );
  }
}

function OrderHistory({ orders, ccount, wcount }: { orders: ReturnType<ReturnType<typeof useOrders>["ordersFor"]>; ccount: number; wcount: number }) {
  const { add } = useCart();
  return (
    <>
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
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">Order History</h2>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No orders yet. <Link to="/shop" className="text-primary font-semibold hover:underline">Start shopping</Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((o) => (
              <div key={o.id} className="p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="min-w-0">
                    <div className="font-bold">{o.id}</div>
                    <div className="text-xs text-muted-foreground">Placed on {new Date(o.date).toLocaleDateString()}</div>
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
                      <div className="text-xs text-muted-foreground">Sold by {o.items[0]?.vendor} • {o.payment.method}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{o.total.toLocaleString("en-IN")}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/order/$id" params={{ id: o.id }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold">
                    <Truck className="h-3.5 w-3.5"/> Track Order
                  </Link>
                  <Link to="/chat/$vendor" params={{ vendor: o.items[0]?.vendor ?? "APJ Store" }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-secondary">
                    <MessageCircle className="h-3.5 w-3.5"/> Chat with Vendor
                  </Link>
                  <button onClick={() => o.items.forEach((it) => add({ id: it.productId, title: it.title, image: it.image, price: it.price, category: it.category, originalPrice: it.price, discount: "", rating: 4.5, stock: "In Stock", shortDescription: "", fullDescription: "" } as any, it.quantity))}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-secondary">
                    Buy Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function AddressesTab({ addAddress, removeAddress, setDefaultAddress }: { addAddress: (a: Omit<Address, "id">) => void; removeAddress: (id: string) => void; setDefaultAddress: (id: string) => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [a, setA] = useState({ label: "Home", fullName: "", phone: "", line1: "", line2: "", city: "", pincode: "", isDefault: false });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Saved Addresses</h2>
        <button onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold">
          <Plus className="h-3.5 w-3.5"/> Add Address
        </button>
      </div>
      {open && (
        <div className="rounded-xl border border-border p-4 mb-4 grid gap-2 md:grid-cols-2 text-sm">
          {(["label","fullName","phone","line1","line2","city","pincode"] as const).map((k) => (
            <input key={k} placeholder={k} value={(a as any)[k]} onChange={(e) => setA({ ...a, [k]: e.target.value })}
              className="rounded-xl border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
          ))}
          <label className="md:col-span-2 flex items-center gap-2 text-xs">
            <input type="checkbox" checked={a.isDefault} onChange={(e) => setA({ ...a, isDefault: e.target.checked })} className="accent-primary"/>
            Set as default
          </label>
          <button onClick={() => { addAddress(a); setOpen(false); setA({ label: "Home", fullName: "", phone: "", line1: "", line2: "", city: "", pincode: "", isDefault: false }); }}
            className="md:col-span-2 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground py-2 text-sm font-bold">Save Address</button>
        </div>
      )}
      {user!.addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {user!.addresses.map((ad) => (
            <div key={ad.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{ad.label} {ad.isDefault && <span className="ml-2 text-[10px] uppercase text-primary font-bold">Default</span>}</div>
                <button onClick={() => removeAddress(ad.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4"/></button>
              </div>
              <div className="text-sm mt-1">{ad.fullName} • {ad.phone}</div>
              <div className="text-xs text-muted-foreground">{ad.line1}, {ad.city} — {ad.pincode}</div>
              {!ad.isDefault && (
                <button onClick={() => setDefaultAddress(ad.id)} className="mt-2 text-xs text-primary font-semibold hover:underline">
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
