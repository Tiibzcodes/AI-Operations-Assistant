import { createFileRoute } from "@tanstack/react-router";
import { Mail, Sparkles } from "lucide-react";
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

export const Route = createFileRoute("/_shell/email")({
  head: () => ({ meta: [{ title: "Email Generator — OpsPilot AI" }, { name: "description", content: "Draft professional emails tuned by audience, tone, and purpose." }] }),
  component: EmailPage,
});

const AUDIENCES = ["Customer","Manager","Engineering","Finance","Sales"];
const TONES = ["Professional","Friendly","Formal","Empathetic","Urgent"];
const PURPOSES = ["Issue Update","Incident Communication","Escalation","Follow-up","Meeting Invitation","General Communication"];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [audience, setAudience] = useState("Customer");
  const [tone, setTone] = useState("Professional");
  const [purpose, setPurpose] = useState("Issue Update");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const run = useServerFn(runAI);

  const generate = async () => {
    if (!context.trim()) { toast.error("Please add some context"); return; }
    setLoading(true); setResult("");
    const prompt = `Recipient: ${recipient || "(unspecified)"}\nAudience: ${audience}\nTone: ${tone}\nPurpose: ${purpose}\n\nContext / details:\n${context}`;
    try {
      const { content } = await run({ data: { feature: "email", prompt } });
      setResult(content);
      saveHistoryItem({ id: uid(), feature: "email", title: `${purpose} → ${recipient || audience}`, prompt, response: content, createdAt: Date.now() });
    } catch (e) { toast.error(e instanceof Error ? e.message : "AI request failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      <FeatureHeader icon={Mail} title="Smart Email Generator" description="Draft polished emails with the right tone for any audience." />
      <div className="glass rounded-2xl p-6 space-y-4 shadow-elegant">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Recipient</Label><Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Jane Doe / Acme Corp" /></div>
          <div className="space-y-1.5"><Label>Audience</Label>
            <Select value={audience} onValueChange={setAudience}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{AUDIENCES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TONES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label>Purpose</Label>
            <Select value={purpose} onValueChange={setPurpose}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PURPOSES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Additional context</Label>
          <Textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="Key points, timelines, incident IDs, decisions to communicate…" className="min-h-[140px]" />
        </div>
        <div className="flex justify-end">
          <Button onClick={generate} disabled={loading} className="gradient-hero text-white border-0 shadow-elegant hover:opacity-90">
            <Sparkles className="h-4 w-4 mr-1.5" />{loading ? "Drafting…" : "Generate Email"}
          </Button>
        </div>
      </div>
      {loading && <LoadingSkeleton />}
      {result && <ResultCard content={result} onRegenerate={generate} filename="opspilot-email.md" />}
    </div>
  );
}