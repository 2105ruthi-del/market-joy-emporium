import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — APJ Store" }] }),
  component: Register,
});

function Register() {
  const { register } = useAuth();
  const { push } = useNotifications();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", phone: "", pass: "", confirm: "" });
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.phone) return setErr("All fields are required");
    if (f.pass.length < 6) return setErr("Password must be at least 6 characters");
    if (f.pass !== f.confirm) return setErr("Passwords don't match");
    register(f.name, f.email, f.phone);
    push({ title: "Account created", body: "Welcome to APJ Store." });
    nav({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-extrabold">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join APJ Store in seconds.</p>
        {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
        <form className="mt-6 space-y-3" onSubmit={submit}>
          <input required placeholder="Full Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/>
          <input type="email" required placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/>
          <input required placeholder="Mobile Number" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/>
          <input type="password" required placeholder="Password" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/>
          <input type="password" required placeholder="Confirm Password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/>
          <button className="w-full rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground py-3 text-sm font-bold shadow-[var(--shadow-glow)]">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
