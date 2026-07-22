import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Sparkles } from "lucide-react";
import { useState } from "react";
import { FeatureHeader } from "@/components/feature-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { runAI } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { ResultCard } from "@/components/result-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { saveHistoryItem, uid } from "@/lib/storage";

export const Route = createFileRoute("/_shell/planner")({
  head: () => ({ meta: [{ title: "Task Planner — OpsPilot AI" }, { name: "description", content: "Plan your day and week with an AI-optimized priority matrix and focus schedule." }] }),
  component: Planner,
});

function Planner() {
  const [tasks, setTasks] = useState("");
  const [priority, setPriority] = useState("Balanced");
  const [hours, setHours] = useState("9:00 - 17:30");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const run = useServerFn(runAI);

  const generate = async () => {
    if (!tasks.trim()) { toast.error("Please add some tasks"); return; }
    setLoading(true); setResult("");
    const prompt = `Working hours: ${hours}\nPriority mode: ${priority}\n\nTasks:\n${tasks}`;
    try {
      const { content } = await run({ data: { feature: "planner", prompt } });
      setResult(content);
      saveHistoryItem({ id: uid(), feature: "planner", title: `Plan for ${hours}`, prompt, response: content, createdAt: Date.now() });
    } catch (e) { toast.error(e instanceof Error ? e.message : "AI request failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      <FeatureHeader icon={CalendarClock} title="Daily Operations Planner" description="Turn a task list into a focused schedule with priorities, time blocks, and breaks." />
      <div className="glass rounded-2xl p-6 space-y-4 shadow-elegant">
        <div className="space-y-1.5">
          <Label>Tasks (one per line)</Label>
          <Textarea value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"Review INC-1421 RCA\nDraft partner update email\nMeet with Support lead\n1:1 with Ana"} className="min-h-[160px] font-mono text-sm" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Priority mode</Label>
            <Select value={priority} onValueChange={setPriority}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="Balanced">Balanced</SelectItem>
              <SelectItem value="Deep Focus">Deep Focus</SelectItem>
              <SelectItem value="Fast Turnaround">Fast Turnaround</SelectItem>
              <SelectItem value="Meetings-heavy">Meetings-heavy</SelectItem>
            </SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label>Working hours</Label><Input value={hours} onChange={(e) => setHours(e.target.value)} /></div>
        </div>
        <div className="flex justify-end">
          <Button onClick={generate} disabled={loading} className="gradient-hero text-white border-0 shadow-elegant hover:opacity-90">
            <Sparkles className="h-4 w-4 mr-1.5" />{loading ? "Planning…" : "Generate Plan"}
          </Button>
        </div>
      </div>
      {loading && <LoadingSkeleton />}
      {result && <ResultCard content={result} onRegenerate={generate} filename="opspilot-plan.md" />}
    </div>
  );
}