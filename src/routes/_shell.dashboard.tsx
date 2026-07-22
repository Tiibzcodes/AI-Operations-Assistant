import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Ticket, Mail, FileText, BookOpen, CalendarClock, MessageSquare, ArrowUpRight, Sparkles, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadCounters, loadHistory, type HistoryItem, type Counters } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { AIDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — OpsPilot AI" }, { name: "description", content: "Overview of your OpsPilot AI workspace, KPIs, quick actions, and recent activity." }] }),
  component: Dashboard,
});

const kpis = [
  { key: "ticket", label: "Tickets Processed", icon: Ticket },
  { key: "email", label: "Emails Generated", icon: Mail },
  { key: "meeting", label: "Meetings Summarized", icon: FileText },
  { key: "research", label: "Research Requests", icon: BookOpen },
  { key: "planner", label: "Tasks Planned", icon: CalendarClock },
] as const;

const quick = [
  { to: "/tickets", label: "Analyze Ticket", icon: Ticket },
  { to: "/email", label: "Draft Email", icon: Mail },
  { to: "/meetings", label: "Summarize Notes", icon: FileText },
  { to: "/planner", label: "Plan My Day", icon: CalendarClock },
  { to: "/research", label: "Research", icon: BookOpen },
  { to: "/chat", label: "Ask OpsPilot", icon: MessageSquare },
] as const;

function Dashboard() {
  const [counters, setCounters] = useState<Counters>({ ticket: 0, email: 0, meeting: 0, research: 0, planner: 0, chat: 0 });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const sync = () => { setCounters(loadCounters()); setHistory(loadHistory().slice(0, 6)); };
    sync();
    window.addEventListener("opspilot:update", sync);
    return () => window.removeEventListener("opspilot:update", sync);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-hero text-white shadow-elegant">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your OpsPilot workspace — reduce repetitive work with AI.</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-2 shadow-elegant">
        <label className="flex items-center gap-3 px-4 py-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0" />
          <input
            placeholder="Ask OpsPilot AI anything… e.g. 'Explain OAuth', 'Draft an incident update'"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            onKeyDown={(e) => { if (e.key === "Enter" && e.currentTarget.value.trim()) { const q = encodeURIComponent(e.currentTarget.value); window.location.href = `/chat?q=${q}`; } }}
          />
          <kbd className="hidden sm:inline-flex h-6 items-center rounded border bg-muted px-2 text-[10px] font-mono">⌘K</kbd>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.key} className="glass p-5 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <k.icon className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight">{counters[k.key]}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Activity</h2>
            <Button asChild variant="ghost" size="sm"><Link to="/history">View all<ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </div>
          {history.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No activity yet. Try a Quick Action to get started.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {history.map((h) => (
                <div key={h.id} className="py-3 flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-xs font-semibold uppercase text-primary">{h.feature[0]}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{h.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(h.createdAt, { addSuffix: true })} · {h.feature}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {quick.map((q) => (
              <Button key={q.to} asChild variant="outline" className="h-auto justify-start py-3">
                <Link to={q.to}>
                  <q.icon className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-xs">{q.label}</span>
                </Link>
              </Button>
            ))}
          </div>
          <div className="mt-6"><AIDisclaimer /></div>
        </div>
      </div>
    </div>
  );
}