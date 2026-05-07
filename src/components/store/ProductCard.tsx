import { Link } from "@tanstack/react-router";
import { Star, ShoppingCart, Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-card)] hover:-translate-y-1">
      <Link to="/product/$id" params={{ id: String(product.id) }} className="relative block aspect-square overflow-hidden bg-secondary/40">
        <img src={product.image} alt={product.title} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute top-3 left-3 rounded-full bg-[image:var(--gradient-accent)] px-2.5 py-1 text-[10px] font-bold text-accent-foreground shadow-md">
          {product.discount}
        </span>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggle(product.id); }}
        aria-label="Wishlist"
        className={`absolute top-3 right-3 z-10 grid place-items-center h-9 w-9 rounded-full backdrop-blur transition-all ${wished ? "bg-destructive text-destructive-foreground" : "bg-background/80 text-foreground hover:bg-background"}`}
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
      </button>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.category}</p>
        <Link to="/product/$id" params={{ id: String(product.id) }}
          className="mt-1 line-clamp-2 font-semibold text-foreground hover:text-primary transition-colors">
          {product.title}
        </Link>
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span className="flex items-center gap-0.5 rounded bg-success/10 px-1.5 py-0.5 font-semibold text-success" style={{color: "var(--success)"}}>
            {product.rating} <Star className="h-3 w-3 fill-current" />
          </span>
          <span className="text-muted-foreground">• {product.stock}</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold">{formatINR(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
        </div>
        <button onClick={() => add(product)}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-[image:var(--gradient-primary)] hover:shadow-[var(--shadow-glow)]">
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
