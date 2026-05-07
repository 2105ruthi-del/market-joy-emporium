import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Award, Truck, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — APJ Store" }, { name: "description", content: "APJ Store is a modern multi-category marketplace blending everyday essentials with fresh organic collections." }] }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About APJ Store</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        APJ Store is a modern multi-category marketplace inspired by the best of online shopping.
        From the latest electronics and fashion to fresh organic essentials, we bring everything you need into one beautiful place.
      </p>
      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        {[
          { i: Leaf, t: "Naturally Curated", d: "Premium organic and everyday products side by side." },
          { i: Award, t: "Quality First", d: "Every product is handpicked and verified." },
          { i: Truck, t: "Fast Delivery", d: "Quick, reliable shipping across India." },
          { i: Users, t: "Loved by 50K+", d: "A growing community of happy customers." },
        ].map((x) => (
          <div key={x.t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><x.i className="h-5 w-5"/></div>
            <h3 className="mt-3 font-bold">{x.t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{x.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
