import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/store/ProductCard";
import { Link } from "@tanstack/react-router";

const search = z.object({ c: z.string().optional() });

export const Route = createFileRoute("/shop")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Shop All Products — APJ Store" },
      { name: "description", content: "Browse all products across electronics, fashion, organic, beauty and more." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { c } = Route.useSearch();
  const active = c && c !== "all" ? c : null;
  const list = active ? products.filter((p) => p.category === active) : products;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        {active ? active : "All Products"}
      </h1>
      <p className="mt-2 text-muted-foreground">{list.length} products available</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/shop" search={{ c: "all" }}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${!active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}>
          All
        </Link>
        {categories.map((cat) => (
          <Link key={cat} to="/shop" search={{ c: cat }}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${active === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}>
            {cat}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
