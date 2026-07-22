import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { FeatureHeader } from "@/components/feature-header";
import { History as HistoryIcon, Search, Trash2 } from "lucide-react";
import { deleteHistoryItem, loadHistory, type HistoryItem } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Markdown } from "@/components/markdown";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_shell/history")({
  head: () => ({ meta: [{ title: "History — OpsPilot AI" }, { name: "description", content: "Search, filter and reopen previous AI interactions." }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const sync = () => setItems(loadHistory());
    sync();
    window.addEventListener("opspilot:update", sync);
    return () => window.removeEventListener("opspilot:update", sync);
  }, []);

  const filtered = useMemo(() => items.filter((i) =>
    (filter === "all" || i.feature === filter) &&
    (!query || (i.title + i.prompt + i.response).toLowerCase().includes(query.toLowerCase()))
  ), [items, query, filter]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
      <FeatureHeader icon={HistoryIcon} title="History" description="Every AI interaction is stored locally — search, filter, reopen or delete." />
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search history…" className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All features</SelectItem>
            <SelectItem value="ticket">Tickets</SelectItem>
            <SelectItem value="email">Emails</SelectItem>
            <SelectItem value="meeting">Meetings</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="planner">Planner</SelectItem>
            <SelectItem value="chat">Chat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={HistoryIcon} title="Nothing here yet" description="Use any OpsPilot feature — analyzed tickets, generated emails, plans and research will appear here." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="glass rounded-2xl divide-y divide-border/60 max-h-[70vh] overflow-y-auto">
            {filtered.map((i) => (
              <button
                key={i.id}
                onClick={() => setSelected(i)}
                className={`w-full text-left p-4 transition-colors ${selected?.id === i.id ? "bg-primary/10" : "hover:bg-muted/50"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase text-primary">{i.feature}</p>
                  <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(i.createdAt, { addSuffix: true })}</span>
                </div>
                <p className="mt-1 text-sm font-medium truncate">{i.title || "Untitled"}</p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{i.prompt}</p>
              </button>
            ))}
          </div>
          <div className="glass rounded-2xl p-6 max-h-[70vh] overflow-y-auto">
            {selected ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase text-primary">{selected.feature}</p>
                    <h3 className="truncate font-semibold">{selected.title}</h3>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {selected.feature === "chat" ? null : (
                      <Button asChild variant="outline" size="sm"><Link to={`/${selected.feature === "ticket" ? "tickets" : selected.feature === "meeting" ? "meetings" : selected.feature}` as string}>Reopen</Link></Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => { deleteHistoryItem(selected.id); setSelected(null); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <Markdown>{selected.response}</Markdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-20">Select an item to view details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}