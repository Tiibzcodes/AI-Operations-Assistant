import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { FeatureHeader } from "@/components/feature-header";
import { SimpleRunner } from "@/components/simple-runner";

export const Route = createFileRoute("/_shell/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summaries — OpsPilot AI" }, { name: "description", content: "Turn raw meeting notes into decisions, action items, owners, and risks." }] }),
  component: Meetings,
});

const SAMPLE = `Weekly incident review — 24 July
Attendees: Ops, Support, Platform, Product
- Discussed 3 P1 incidents this week; two linked to voucher API deploy.
- Decision: rollback pipeline must run pre-deploy load test on staging.
- Action: Ana to draft runbook by Friday. Owner: Ana, Deadline: 26 July.
- Risk: on-call rotation understaffed next week.
- Open: do we need a formal RCA for INC-1421?`;

function Meetings() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      <FeatureHeader icon={FileText} title="Meeting Notes Summarizer" description="Paste raw notes or a transcript. Get a clean executive summary, decisions, action items with owners and deadlines." />
      <SimpleRunner feature="meeting" placeholder="Paste meeting notes or transcript here…" sample={SAMPLE} ctaLabel="Summarize Meeting" />
    </div>
  );
}