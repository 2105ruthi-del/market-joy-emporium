import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Search as SearchIcon } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/store/ProductCard";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: ({ match }: any) => ({
    meta: [{ title: `Search: ${match?.search?.q ?? ""} — APJ Store` }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const term = (q || "").toLowerCase();
  const results = term
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.shortDescription.toLowerCase().includes(term),
      )
    : [];
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center gap-3">
        <SearchIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {term ? <>Results for "<span className="text-primary">{q}</span>"</> : "Search"}
        </h1>
      </div>
      <p className="mt-2 text-muted-foreground">{results.length} matching products</p>
      {results.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          {term ? "No products matched your search." : "Type something to start searching."}
        </div>
      )}
    </div>
  );
}