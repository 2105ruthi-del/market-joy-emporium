import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Search, Heart, User, Menu, Leaf, Store, Bell, MessageCircle, LogOut, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const { count } = useCart();
  const { count: wcount } = useWishlist();
  const { user, logout } = useAuth();
  const { notifications, unread, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/shop", label: "Categories", search: { c: "all" } },
    { to: "/deals", label: "Deals" },
    { to: "/shop", label: "Organic", search: { c: "Organic" } },
    { to: "/about", label: "About" },
    { to: "/vendor", label: "Sell on APJ" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg shadow-[var(--shadow-soft)]">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] transition-transform group-hover:scale-110">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            APJ<span className="text-primary">Store</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {links.map((l, i) => (
            <Link key={i} to={l.to} search={(l as any).search}
              className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-primary hover:bg-secondary transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={(e) => { e.preventDefault(); if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } }); }}
          className="hidden md:flex flex-1 max-w-md ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for products, brands & more..."
            className="w-full rounded-full border border-input bg-secondary/40 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"/>
        </form>

        <div className="flex items-center gap-1 ml-auto md:ml-0">
          <Link to="/vendor" className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary px-3 py-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
            <Store className="h-3.5 w-3.5" /> Sell
          </Link>

          <div ref={notifRef} className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
              className="relative p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-md">
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border font-bold text-sm">Notifications</div>
                <div className="max-h-80 overflow-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-xs text-muted-foreground">No notifications yet.</p>
                  ) : notifications.map((n) => (
                    <Link key={n.id} to={(n.link as any) ?? "/profile"} onClick={() => setNotifOpen(false)}
                      className="block px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/40">
                      <div className="font-semibold text-sm">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.body}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{new Date(n.at).toLocaleString()}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/messages" className="relative hidden sm:inline-flex p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Messages">
            <MessageCircle className="h-5 w-5" />
          </Link>
          <Link to="/wishlist" className="relative hidden sm:inline-flex p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wcount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-md">
                {wcount}
              </span>
            )}
          </Link>

          <div ref={userRef} className="relative">
            <button onClick={() => setUserOpen(!userOpen)} className="hidden sm:inline-flex p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Account">
              <User className="h-5 w-5" />
            </button>
            {userOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden z-50">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-border">
                      <div className="font-semibold text-sm truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <Link to="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary"><User className="h-4 w-4 text-muted-foreground"/> My Profile</Link>
                    <Link to="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary"><Package className="h-4 w-4 text-muted-foreground"/> Orders</Link>
                    <Link to="/messages" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary"><MessageCircle className="h-4 w-4 text-muted-foreground"/> Messages</Link>
                    <button onClick={() => { logout(); setUserOpen(false); navigate({ to: "/" }); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 border-t border-border">
                      <LogOut className="h-4 w-4"/> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-secondary">Sign In</Link>
                    <Link to="/register" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-secondary">Create Account</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="relative p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[image:var(--gradient-accent)] px-1 text-[10px] font-bold text-accent-foreground shadow-md">
                {count}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-full hover:bg-secondary" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-border bg-background px-4 py-2 flex flex-col">
          {links.map((l, i) => (
            <Link key={i} to={l.to} search={(l as any).search} onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium hover:text-primary">{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
