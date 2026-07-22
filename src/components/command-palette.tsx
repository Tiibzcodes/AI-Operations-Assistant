import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { LayoutDashboard, Ticket, Mail, FileText, BookOpen, CalendarClock, MessageSquare, History, Settings as SettingsIcon, Sparkles } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tickets", label: "AI Ticket Analyzer", icon: Ticket },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summaries", icon: FileText },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Ask AI or jump to a page…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Ask OpsPilot AI">
          <CommandItem onSelect={() => { setOpen(false); navigate({ to: "/chat" }); }}>
            <Sparkles className="mr-2 h-4 w-4 text-primary" />Open AI Chat
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          {items.map((it) => (
            <CommandItem key={it.to} onSelect={() => { setOpen(false); navigate({ to: it.to }); }}>
              <it.icon className="mr-2 h-4 w-4" />{it.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}