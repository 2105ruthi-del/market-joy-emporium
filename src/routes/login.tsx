import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — APJ Store" }] }),
  component: Login,
});

function Login() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-extrabold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to continue shopping.</p>
        <form className="mt-6 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input type="email" required placeholder="Email"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/>
          <input type="password" required placeholder="Password"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/>
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
