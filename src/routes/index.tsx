import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Ticket, Mail, FileText, BookOpen, CalendarClock, MessageSquare, PlayCircle, ArrowRight } from "lucide-react";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpsPilot AI — Operations & Productivity Copilot" },
      { name: "description", content: "Your AI-powered workplace assistant for Operations, Technical Support and Customer Success teams. Analyze tickets, draft emails, summarize meetings, and plan your day." },
      { property: "og:title", content: "OpsPilot AI — Operations & Productivity Copilot" },
      { property: "og:description", content: "Reduce repetitive work with AI. Built for Ops, Support, CS, and Integration teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Ticket, title: "AI Ticket Analyzer", desc: "Root-cause analysis, severity, and next steps from any support ticket." },
  { icon: Mail, title: "Smart Email Generator", desc: "Professional emails tuned by audience, tone, and purpose." },
  { icon: FileText, title: "Meeting Notes Summarizer", desc: "Decisions, action items, owners, and risks — in seconds." },
  { icon: BookOpen, title: "AI Research Assistant", desc: "Enterprise-grade explanations of APIs, protocols, and standards." },
  { icon: CalendarClock, title: "Daily Operations Planner", desc: "Priority matrix and focused time blocks for your workday." },
  { icon: MessageSquare, title: "AI Workplace Chat", desc: "A persistent copilot for incidents, escalations, and release notes." },
];

function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-hero text-white shadow-elegant">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">OpsPilot AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard">Dashboard</Link></Button>
            <Button asChild size="sm" className="gradient-hero text-white border-0 shadow-elegant hover:opacity-90">
              <Link to="/dashboard">Get Started<ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30" style={{ background: "radial-gradient(60% 50% at 50% 0%, var(--primary) 0%, transparent 60%)" }} />
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Enterprise AI copilot for Ops & Support teams
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-700">
            <span className="gradient-text">OpsPilot AI</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700">
            Your AI-powered workplace assistant for Operations, Technical Support and Customer Success teams.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gradient-hero text-white border-0 shadow-elegant hover:opacity-90">
              <Link to="/dashboard">Get Started<ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass">
              <Link to="/chat"><PlayCircle className="mr-1.5 h-4 w-4" />Watch Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-elegant animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-hero text-white shadow-elegant">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
