import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: (s.redirect as string) || "/" }),
  head: () => ({ meta: [{ title: "Login — APJ Store" }] }),
  component: Login,
});

function Login() {
  const { login } = useAuth();
  const { push } = useNotifications();
  const nav = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pass) return setErr("Please fill all fields");
    login(email);
    push({ title: "Welcome back!", body: "Signed in successfully." });
    nav({ to: redirect as any });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-extrabold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to continue shopping.</p>
        {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
        <form className="mt-6 space-y-3" onSubmit={submit}>
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/>
          <input type="password" required placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-primary"/>
              Remember me
            </label>
            <button type="button" className="text-primary font-semibold hover:underline">Forgot password?</button>
          </div>
          <button className="w-full rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground py-3 text-sm font-bold shadow-[var(--shadow-glow)]">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-muted-foreground">
          New here? <Link to="/register" className="text-primary font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
