import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — APJ Store" }] }),
  component: Register,
});

function Register() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-extrabold">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join APJ Store in seconds.</p>
        <form className="mt-6 space-y-3" onSubmit={(e) => e.preventDefault()}>
          {["Full Name", "Email", "Password", "Confirm Password"].map((p, i) => (
            <input key={p} type={i >= 2 ? "password" : i === 1 ? "email" : "text"} required placeholder={p}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/>
          ))}
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
