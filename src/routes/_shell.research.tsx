import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { FeatureHeader } from "@/components/feature-header";
import { SimpleRunner } from "@/components/simple-runner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/_shell/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — OpsPilot AI" }, { name: "description", content: "Enterprise-grade explanations of APIs, protocols, and standards." }] }),
  component: Research,
});

const TOPICS = ["Explain REST APIs","Explain OAuth","Explain Webhooks","Explain HTTP Status Codes","Explain Payment Gateways","Explain PCI DSS","Explain Idempotency","Explain API Authentication","Explain SFTP"];

function Research() {
  const [sample, setSample] = useState("Explain OAuth 2.0 and when to use each grant type.");
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      <FeatureHeader icon={BookOpen} title="AI Research Assistant" description="Ask workplace and technical questions. Get simple explanations, examples, best practices, and pitfalls." />
      <div className="glass rounded-2xl p-4">
        <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Popular topics</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <Button key={t} variant="outline" size="sm" onClick={() => setSample(t)}>{t}</Button>
          ))}
        </div>
      </div>
      <SimpleRunner key={sample} feature="research" placeholder="Ask a technical or workplace question…" sample={sample} ctaLabel="Ask OpsPilot" />
    </div>
  );
}