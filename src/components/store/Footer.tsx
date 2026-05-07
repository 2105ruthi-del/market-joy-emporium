import { Link } from "@tanstack/react-router";
import { Leaf, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold">APJ<span className="text-primary">Store</span></span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Everything you need in one place — from electronics to fresh organic essentials.
          </p>
          <div className="flex gap-2 mt-4">
            {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
              <a key={i} href="#" className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/deals" className="hover:text-primary">Deals</Link></li>
            <li><Link to="/shop" search={{ c: "Organic" }} className="hover:text-primary">Organic</Link></li>
            <li><Link to="/shop" search={{ c: "Electronics" }} className="hover:text-primary">Electronics</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><a className="hover:text-primary" href="#">Shipping</a></li>
            <li><a className="hover:text-primary" href="#">Returns</a></li>
            <li><a className="hover:text-primary" href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-3">Get exclusive deals in your inbox.</p>
          <div className="flex gap-2">
            <input placeholder="Email" className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <button className="rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-4 text-sm font-medium hover:opacity-90">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} APJ Store. All rights reserved.
      </div>
    </footer>
  );
}
