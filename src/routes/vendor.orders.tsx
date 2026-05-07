import { createFileRoute } from "@tanstack/react-router";
import { useVendor, type VendorOrder } from "@/context/VendorContext";

export const Route = createFileRoute("/vendor/orders")({
  component: VendorOrders,
});

const STATUSES: VendorOrder["status"][] = ["Pending", "Shipped", "Delivered", "Cancelled"];

function VendorOrders() {
  const { orders, setOrderStatus } = useVendor();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">{orders.length} total orders</p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/30 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">{o.id}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.title}</td>
                <td className="px-4 py-3">{o.qty}</td>
                <td className="px-4 py-3 font-semibold">₹{o.total.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value as VendorOrder["status"])}
                    className={`rounded-full px-3 py-1 text-xs font-semibold border border-border bg-background ${
                      o.status === "Delivered" ? "text-success" :
                      o.status === "Cancelled" ? "text-destructive" :
                      o.status === "Shipped" ? "text-primary" : ""
                    }`}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}