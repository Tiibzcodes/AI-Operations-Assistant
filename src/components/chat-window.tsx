import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, User, Loader2 } from "lucide-react";
import { Markdown } from "./markdown";
import { AIDisclaimer } from "./ai-disclaimer";
import { runAI } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { loadThreads, saveThreads, upsertThread, uid, type ChatThread, bumpCounter } from "@/lib/storage";
import { toast } from "sonner";

const SUGGESTED = [
  "Summarize this incident.",
  "Write an escalation email.",
  "Explain this API error.",
  "Create meeting minutes.",
  "Generate release notes.",
  "Help investigate a production issue.",
];

export function ChatWindow({ threadId, initialPrompt }: { threadId: string; initialPrompt?: string }) {
  const [thread, setThread] = useState<ChatThread>(() => {
    const existing = loadThreads().find((t) => t.id === threadId);
    return existing ?? { id: threadId, title: "New conversation", updatedAt: Date.now(), messages: [] };
  });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const run = useServerFn(runAI);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const seededRef = useRef(false);

  useEffect(() => { taRef.current?.focus(); }, [threadId]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [thread.messages.length, sending]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || sending) return;
    const userMsg = { role: "user" as const, content, id: uid() };
    const nextMsgs = [...thread.messages, userMsg];
    const title = thread.messages.length === 0 ? content.slice(0, 50) : thread.title;
    const updated: ChatThread = { ...thread, messages: nextMsgs, title, updatedAt: Date.now() };
    setThread(updated); upsertThread(updated); setInput(""); setSending(true);
    try {
      const history = nextMsgs.map((m) => ({ role: m.role, content: m.content }));
      const { content: reply } = await run({ data: { feature: "chat", prompt: content, history: history.slice(0, -1) } });
      const assistantMsg = { role: "assistant" as const, content: reply, id: uid() };
      const final: ChatThread = { ...updated, messages: [...nextMsgs, assistantMsg], updatedAt: Date.now() };
      setThread(final); upsertThread(final); bumpCounter("chat");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed");
    } finally { setSending(false); taRef.current?.focus(); }
  };

  useEffect(() => {
    if (initialPrompt && !seededRef.current && thread.messages.length === 0) {
      seededRef.current = true;
      void send(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const empty = thread.messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {empty ? (
            <div className="text-center pt-12">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-hero text-white shadow-glow"><Sparkles className="h-6 w-6" /></div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight">How can I help you today?</h2>
              <p className="mt-2 text-sm text-muted-foreground">Your enterprise AI copilot for Ops, Support and Customer Success.</p>
              <div className="mt-8 grid gap-2 sm:grid-cols-2">
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => send(s)} className="glass rounded-xl p-3 text-left text-sm transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            thread.messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-hero text-white shadow-elegant"><Sparkles className="h-4 w-4" /></div>
                )}
                <div className={m.role === "user" ? "max-w-[80%] rounded-2xl bg-primary text-primary-foreground px-4 py-2.5 text-sm" : "max-w-[85%]"}>
                  {m.role === "user" ? m.content : <Markdown>{m.content}</Markdown>}
                </div>
                {m.role === "user" && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted"><User className="h-4 w-4" /></div>
                )}
              </div>
            ))
          )}
          {sending && (
            <div className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-hero text-white shadow-elegant"><Sparkles className="h-4 w-4" /></div>
              <div className="glass rounded-2xl px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />Thinking…
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-border/60 bg-background/70 backdrop-blur p-4">
        <div className="mx-auto max-w-3xl space-y-2">
          <div className="glass rounded-2xl p-2 shadow-elegant flex items-end gap-2">
            <Textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask OpsPilot anything…"
              className="min-h-[44px] max-h-40 border-0 bg-transparent resize-none focus-visible:ring-0 shadow-none text-sm"
            />
            <Button size="icon" className="gradient-hero text-white border-0 shrink-0 shadow-elegant hover:opacity-90" onClick={() => send(input)} disabled={sending || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <AIDisclaimer />
        </div>
      </div>
    </div>
  );
}