import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Ticket, Mail, FileText, BookOpen, CalendarClock, MessageSquare, ArrowUpRight, Sparkles, Search, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadCounters, loadHistory, loadProfile, type HistoryItem, type Counters, type Profile } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { AvatarPicker } from "@/components/avatar-picker";

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
  const [profile, setProfile] = useState<Profile>({ name: "Tebello", avatar: null });
  const [pickerOpen, setPickerOpen] = useState(false);
  useEffect(() => {
    const sync = () => { setCounters(loadCounters()); setHistory(loadHistory().slice(0, 6)); };
    const syncProfile = () => setProfile(loadProfile());
    sync();
    syncProfile();
    window.addEventListener("opspilot:update", sync);
    window.addEventListener("opspilot:profile", syncProfile);
    return () => {
      window.removeEventListener("opspilot:update", sync);
      window.removeEventListener("opspilot:profile", syncProfile);
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      <section
        className="relative overflow-hidden rounded-3xl border border-white/60 p-6 sm:p-8 shadow-elegant"
        style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #D9F1FF 100%)" }}
      >
        {/* decorative blurred circles */}
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/50 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-8 right-1/3 h-24 w-24 rounded-full bg-white/40 blur-2xl" />

        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            aria-label="Change avatar"
            className="group relative shrink-0 cursor-pointer rounded-full outline-none transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_-6px_rgba(56,132,255,0.35)] focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 border-white bg-white shadow-elegant sm:h-16 sm:w-16">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <span className="gradient-text text-2xl font-bold sm:text-xl">{(profile.name[0] || "?").toUpperCase()}</span>
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-white shadow-md ring-2 ring-white transition-transform duration-200 group-hover:scale-110">
              <Pencil className="h-3.5 w-3.5" />
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              <span className="mr-2">👋</span> Welcome back, {profile.name}!
            </h1>
            <p className="mt-1 text-sm text-slate-700 sm:text-base">
              Your OpsPilot workspace is ready. Let's make today productive.
            </p>
          </div>
        </div>
      </section>

      <AvatarPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        current={profile.avatar}
        name={profile.name}
        onSave={(avatar, name) => setProfile({ avatar, name })}
      />

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