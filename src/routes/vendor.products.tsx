import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Package, X } from "lucide-react";
import { useVendor, type VendorProduct } from "@/context/VendorContext";
import { categories } from "@/data/products";

export const Route = createFileRoute("/vendor/products")({
  component: VendorProducts,
});

const empty = {
  title: "",
  category: "Electronics",
  price: 0,
  originalPrice: 0,
  discount: "10% OFF",
  rating: 4.5,
  stock: "In Stock",
  image: "",
  shortDescription: "",
  fullDescription: "",
  vendor: "My Shop",
};

function VendorProducts() {
  const { vendor, products, addProduct, updateProduct, deleteProduct } = useVendor();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VendorProduct | null>(null);
  const [form, setForm] = useState({ ...empty, vendor: vendor?.shop || "My Shop" });

  const openAdd = () => {
    setEditing(null);
    setForm({ ...empty, vendor: vendor?.shop || "My Shop" });
    setOpen(true);
  };
  const openEdit = (p: VendorProduct) => {
    setEditing(p);
    setForm({ ...p });
    setOpen(true);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateProduct(editing.id, form);
    else addProduct(form);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} listed in your shop</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2.5 text-sm font-bold shadow-[var(--shadow-glow)]">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">You haven't added any products yet.</p>
          <button onClick={openAdd} className="mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold">
            Add your first product
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/30 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden grid place-items-center">
                        {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" />
                          : <Package className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="font-semibold">{p.title}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 font-semibold">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-secondary" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-card rounded-2xl shadow-[var(--shadow-card)] my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold">{editing ? "Edit Product" : "Add New Product"}</h2>
              <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold">Stock Status</label>
                <select value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option>In Stock</option><option>Limited Stock</option><option>Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold">Price (₹)</label>
                <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Original Price (₹)</label>
                <input type="number" required value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Discount Label</label>
                <input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Rating</label>
                <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..." className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold">Short Description</label>
                <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold">Full Description</label>
                <textarea rows={4} value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-border px-5 py-2 text-sm font-semibold hover:bg-secondary">
                Cancel
              </button>
              <button className="rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2 text-sm font-bold shadow-[var(--shadow-glow)]">
                {editing ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}