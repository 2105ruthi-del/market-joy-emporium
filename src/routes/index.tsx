import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Award, Sparkles, Leaf } from "lucide-react";
import heroImg from "@/assets/hero-collage.jpg";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/store/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "APJ Store — Everything You Need In One Place" },
      { name: "description", content: "Shop electronics, fashion, organic products, furniture, beauty and more on APJ Store. Premium quality, fast delivery, secure payments." },
      { property: "og:title", content: "APJ Store — Modern Multi-Category Marketplace" },
      { property: "og:description", content: "From iPhones to organic honey — discover everything in one beautiful place." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Truck, title: "Fast Delivery", desc: "Free shipping over ₹999" },
  { icon: ShieldCheck, title: "Secure Payments", desc: "100% safe transactions" },
  { icon: Award, title: "Premium Products", desc: "Handpicked quality" },
  { icon: Leaf, title: "Fresh Organic", desc: "Naturally grown" },
];

function Home() {
  const featured = products.slice(0, 8);
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.78 0.18 85 / 0.3), transparent 50%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" /> Premium Marketplace
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Everything You Need <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
                In One Place
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Shop the latest electronics, fashion, fresh organic essentials, furniture and more — all curated for you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95 transition-all">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/deals"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/60 backdrop-blur px-6 py-3 text-sm font-semibold hover:bg-background transition-all">
                Today's Deals
              </Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm">
              <div><div className="text-2xl font-bold">10K+</div><div className="text-muted-foreground">Products</div></div>
              <div><div className="text-2xl font-bold">50K+</div><div className="text-muted-foreground">Customers</div></div>
              <div><div className="text-2xl font-bold">4.8★</div><div className="text-muted-foreground">Rating</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[image:var(--gradient-primary)] rounded-3xl blur-3xl opacity-30 -z-10" />
            <img src={heroImg} alt="Featured products" width={1280} height={1024}
              className="rounded-3xl shadow-[var(--shadow-card)] w-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Shop by Category</h2>
          <Link to="/shop" className="text-sm font-medium text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((c) => {
            const sample = products.find((p) => p.category === c);
            return (
              <Link key={c} to="/shop" search={{ c }}
                className="group rounded-2xl overflow-hidden border border-border bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all">
                <div className="aspect-square bg-secondary/40 overflow-hidden">
                  {sample && <img src={sample.image} alt={c} loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                </div>
                <div className="p-3 text-center text-sm font-semibold">{c}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Featured Products</h2>
            <p className="text-sm text-muted-foreground mt-1">Handpicked just for you</p>
          </div>
          <Link to="/shop" className="text-sm font-medium text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Organic banner */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-14" style={{ background: "var(--gradient-primary)" }}>
          <div className="relative z-10 max-w-xl text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">
              <Leaf className="h-3.5 w-3.5" /> 100% Natural
            </span>
            <h3 className="mt-4 text-3xl md:text-4xl font-extrabold">Fresh Organic Collection</h3>
            <p className="mt-3 opacity-90">Farm-fresh, chemical-free essentials delivered to your door.</p>
            <Link to="/shop" search={{ c: "Organic" }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-semibold hover:scale-105 transition-transform">
              Shop Organic <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center">What Our Customers Say</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { name: "Aarav Sharma", text: "Loved the quality and super-fast delivery. APJ Store is my go-to now!", rating: 5 },
            { name: "Priya Mehta", text: "The organic range is genuinely fresh. Packaging was top-notch too.", rating: 5 },
            { name: "Rohan Iyer", text: "Got my iPhone 15 Pro at the best price. Smooth checkout experience.", rating: 4 },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: t.rating }).map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="mt-3 text-sm text-foreground/80">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground font-bold">
                  {t.name[0]}
                </div>
                <div className="font-semibold text-sm">{t.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
