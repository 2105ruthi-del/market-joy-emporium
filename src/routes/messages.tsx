import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages — APJ Store" }] }),
  component: Messages,
});

function Messages() {
  const { user } = useAuth();
  const { threadsForCustomer } = useChat();
  const nav = useNavigate();

  if (!user) {
    return (
      <div className="mx-auto max-w-md text-center py-24 px-4">
        <h1 className="text-2xl font-extrabold">Sign in to view messages</h1>
        <button onClick={() => nav({ to: "/login", search: { redirect: "/messages" } })}
          className="mt-6 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-bold">Sign In</button>
      </div>
    );
  }
  const threads = threadsForCustomer(user.email);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-5 flex items-center gap-2"><MessageCircle className="h-6 w-6 text-primary"/> Messages</h1>
      {threads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No conversations yet. Chat with vendors from product pages or orders.
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {threads.map((t) => {
            const last = t.messages[t.messages.length - 1];
            return (
              <Link key={t.vendor} to="/chat/$vendor" params={{ vendor: t.vendor }}
                className="flex items-center gap-3 p-4 hover:bg-secondary/40">
                <div className="h-11 w-11 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground font-bold">
                  {t.vendor.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{t.vendor}</div>
                  <div className="text-xs text-muted-foreground truncate">{last?.text}</div>
                </div>
                <div className="text-[11px] text-muted-foreground">{last && new Date(last.at).toLocaleDateString()}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
