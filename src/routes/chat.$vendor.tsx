import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { ChatPanel } from "@/components/store/ChatPanel";

export const Route = createFileRoute("/chat/$vendor")({
  head: () => ({ meta: [{ title: "Chat — APJ Store" }] }),
  component: ChatPage,
});

function ChatPage() {
  const { vendor } = Route.useParams();
  const { user } = useAuth();
  const { getThread } = useChat();
  const nav = useNavigate();

  if (!user) {
    return (
      <div className="mx-auto max-w-md text-center py-24 px-4">
        <h1 className="text-2xl font-extrabold">Sign in to chat</h1>
        <button onClick={() => nav({ to: "/login", search: { redirect: `/chat/${vendor}` } })}
          className="mt-6 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-bold">Sign In</button>
      </div>
    );
  }

  const thread = getThread(vendor, user.email);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-1">Chat with {vendor}</h1>
      <p className="text-sm text-muted-foreground mb-5">Ask questions about products, delivery, or orders.</p>
      <ChatPanel thread={thread} asRole="customer" vendor={vendor} customerEmail={user.email} customerName={user.name} />
    </div>
  );
}
