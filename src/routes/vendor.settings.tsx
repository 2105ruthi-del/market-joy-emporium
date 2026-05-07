import { createFileRoute } from "@tanstack/react-router";
import { useVendor } from "@/context/VendorContext";
import { useState } from "react";

export const Route = createFileRoute("/vendor/settings")({
  component: VendorSettings,
});

function VendorSettings() {
  const { vendor, login } = useVendor();
  const [shop, setShop] = useState(vendor?.shop || "");
  const [name, setName] = useState(vendor?.name || "");
  const [email, setEmail] = useState(vendor?.email || "");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Shop Settings</h1>
        <p className="text-muted-foreground mt-1">Update your store profile.</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); login(email, name, shop); setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        className="rounded-2xl border border-border bg-card p-6 max-w-xl space-y-4">
        <div>
          <label className="text-xs font-semibold">Shop Name</label>
          <input value={shop} onChange={(e) => setShop(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold">Owner Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2 text-sm font-bold shadow-[var(--shadow-glow)]">
            Save Changes
          </button>
          {saved && <span className="text-sm text-success" style={{ color: "var(--success)" }}>Saved!</span>}
        </div>
      </form>
    </div>
  );
}