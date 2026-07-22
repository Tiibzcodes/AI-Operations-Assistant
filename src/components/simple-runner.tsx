import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { ResultCard } from "./result-card";
import { LoadingSkeleton } from "./loading-skeleton";
import { saveHistoryItem, uid, type HistoryItem } from "@/lib/storage";
import { runAI } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";

export function SimpleRunner({
  feature,
  placeholder,
  sample,
  ctaLabel = "Generate with AI",
  minHeight = 220,
}: {
  feature: HistoryItem["feature"];
  placeholder: string;
  sample: string;
  ctaLabel?: string;
  minHeight?: number;
}) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const run = useServerFn(runAI);

  const submit = async (promptText?: string) => {
    const text = (promptText ?? input).trim();
    if (!text) { toast.error("Please enter some content"); return; }
    setLoading(true); setResult("");
    try {
      const { content } = await run({ data: { feature, prompt: text } });
      setResult(content);
      saveHistoryItem({ id: uid(), feature, title: text.slice(0, 60), prompt: text, response: content, createdAt: Date.now() });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed");
    } finally { setLoading(false); }
  };

  const onFile = async (f: File) => {
    const text = await f.text();
    setInput(text);
    toast.success(`Loaded ${f.name}`);
  };

  return (
    <div className="space-y-6">
      <div
        className="glass rounded-2xl p-4 shadow-elegant"
        onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) await onFile(f); }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="border-0 bg-transparent resize-none focus-visible:ring-0 shadow-none text-sm"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/60 mt-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput(sample)}>Use sample</Button>
            <label className="inline-flex">
              <Button asChild variant="outline" size="sm"><span><Upload className="h-3.5 w-3.5 mr-1.5" />Upload</span></Button>
              <input type="file" accept=".txt,.md,.log" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
            </label>
            <span className="text-xs text-muted-foreground hidden sm:inline">or drop a .txt/.md file</span>
          </div>
          <Button onClick={() => submit()} disabled={loading} className="gradient-hero text-white border-0 shadow-elegant hover:opacity-90">
            <Sparkles className="h-4 w-4 mr-1.5" />{loading ? "Generating…" : ctaLabel}
          </Button>
        </div>
      </div>
      {loading && <LoadingSkeleton />}
      {result && <ResultCard content={result} onRegenerate={() => submit(input)} filename={`opspilot-${feature}.md`} />}
    </div>
  );
}