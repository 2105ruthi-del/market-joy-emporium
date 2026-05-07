import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, ShoppingCart, Zap, Truck, RotateCcw, ShieldCheck, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { getProduct, getRelated } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ProductCard, formatINR } from "@/components/store/ProductCard";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(Number(params.id));
    if (!product) throw notFound();
    return { product, related: getRelated(product.category, product.id) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.title} — APJ Store` },
      { name: "description", content: loaderData.product.shortDescription },
      { property: "og:title", content: loaderData.product.title },
      { property: "og:description", content: loaderData.product.shortDescription },
      { property: "og:image", content: loaderData.product.image },
    ] : [],
  }),
  component: ProductPage,
  notFoundComponent: () => <div className="p-20 text-center">Product not found</div>,
  errorComponent: ({ error }) => <div className="p-20 text-center">{error.message}</div>,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" className="hover:text-primary">Shop</Link> / <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="rounded-3xl overflow-hidden bg-secondary/40 border border-border shadow-[var(--shadow-card)]">
            <img src={product.image} alt={product.title} className="w-full aspect-square object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[product.image, product.image, product.image, product.image].map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-border hover:border-primary cursor-pointer bg-secondary/40">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-primary font-semibold">{product.category}</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{product.title}</h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded bg-success/10 px-2 py-0.5 text-sm font-semibold" style={{color:"var(--success)"}}>
              {product.rating} <Star className="h-3.5 w-3.5 fill-current" />
            </span>
            <span className="text-sm text-muted-foreground">• {product.stock}</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold">{formatINR(product.price)}</span>
            <span className="text-lg text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
            <span className="rounded-full bg-[image:var(--gradient-accent)] px-2.5 py-1 text-xs font-bold text-accent-foreground">{product.discount}</span>
          </div>

          <p className="mt-5 text-foreground/80 leading-relaxed">{product.fullDescription}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-semibold">Quantity</span>
            <div className="inline-flex items-center rounded-full border border-border overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-secondary"><Minus className="h-4 w-4"/></button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-secondary"><Plus className="h-4 w-4"/></button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => add(product, qty)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-6 py-3 text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all">
              <ShoppingCart className="h-4 w-4"/> Add to Cart
            </button>
            <button onClick={() => { add(product, qty); navigate({ to: "/checkout" }); }}
              className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-6 py-3 text-sm font-bold shadow-[var(--shadow-glow)] hover:opacity-95">
              <Zap className="h-4 w-4"/> Buy Now
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            {[
              { i: Truck, t: "Free delivery", d: "Orders over ₹999" },
              { i: RotateCcw, t: "7-day returns", d: "Easy replacement" },
              { i: ShieldCheck, t: "Secure pay", d: "UPI, Card, COD" },
            ].map((x) => (
              <div key={x.t} className="rounded-xl border border-border bg-card p-3">
                <x.i className="h-4 w-4 text-primary mb-1" />
                <div className="font-semibold">{x.t}</div>
                <div className="text-muted-foreground">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
