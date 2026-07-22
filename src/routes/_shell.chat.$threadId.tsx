import { createFileRoute, Link, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChatWindow } from "@/components/chat-window";
import { loadThreads, deleteThread, uid, type ChatThread } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { z } from "zod";

export const Route = createFileRoute("/_shell/chat/$threadId")({
  head: () => ({ meta: [{ title: "AI Chat — OpsPilot AI" }] }),
  validateSearch: z.object({ q: z.string().optional() }),
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = useParams({ from: "/_shell/chat/$threadId" });
  const { q } = useSearch({ from: "/_shell/chat/$threadId" });
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    const sync = () => setThreads(loadThreads());
    sync();
    window.addEventListener("opspilot:update", sync);
    return () => window.removeEventListener("opspilot:update", sync);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] h-[calc(100vh-3.5rem)]">
      <aside className="hidden md:flex flex-col border-r border-border/60 bg-sidebar/40">
        <div className="p-3">
          <Button className="w-full gradient-hero text-white border-0 shadow-elegant hover:opacity-90" onClick={() => navigate({ to: "/chat/$threadId", params: { threadId: uid() } })}>
            <Plus className="h-4 w-4 mr-1.5" />New chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {threads.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">No conversations yet.</p>
          )}
          {threads.map((t) => (
            <div key={t.id} className={`group flex items-center gap-1 rounded-lg text-sm ${t.id === threadId ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60"}`}>
              <Link to="/chat/$threadId" params={{ threadId: t.id }} className="flex-1 min-w-0 px-3 py-2">
                <p className="truncate font-medium">{t.title || "Untitled"}</p>
                <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(t.updatedAt, { addSuffix: true })}</p>
              </Link>
              <button
                aria-label="Delete conversation"
                className="p-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); deleteThread(t.id); if (t.id === threadId) navigate({ to: "/chat/$threadId", params: { threadId: uid() } }); }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border/60 text-[10px] text-muted-foreground flex items-center gap-1.5">
          <MessageSquare className="h-3 w-3" />Threads saved locally
        </div>
      </aside>
      <ChatWindow key={threadId} threadId={threadId} initialPrompt={q} />
    </div>
  );
}