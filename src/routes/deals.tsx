import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/data/products";
import { ProductCard } from "@/components/store/ProductCard";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/deals")({
  head: () => ({ meta: [{ title: "Today's Deals — APJ Store" }, { name: "description", content: "Hot discounts across electronics, fashion, organic and more." }] }),
  component: Deals,
});

function Deals() {
  const sorted = [...products].sort((a, b) => parseInt(b.discount) - parseInt(a.discount));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="rounded-3xl p-8 md:p-12 text-primary-foreground relative overflow-hidden" style={{ background: "var(--gradient-accent)" }}>
        <Flame className="h-10 w-10" />
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">Mega Deals</h1>
        <p className="mt-2 opacity-90">Limited time offers across every category.</p>
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
