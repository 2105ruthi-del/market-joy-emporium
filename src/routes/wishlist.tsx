import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/data/products";
import { ProductCard } from "@/components/store/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "My Wishlist — APJ Store" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { ids } = useWishlist();
  const items = products.filter((p) => ids.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Heart className="h-7 w-7 text-destructive" />
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">My Wishlist</h1>
      </div>
      <p className="text-muted-foreground">{items.length} saved item{items.length !== 1 && "s"}</p>
      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">Your wishlist is empty.</p>
          <Link to="/shop" className="mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}