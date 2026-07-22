import { createFileRoute } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import { FeatureHeader } from "@/components/feature-header";
import { SimpleRunner } from "@/components/simple-runner";

export const Route = createFileRoute("/_shell/tickets")({
  head: () => ({ meta: [{ title: "AI Ticket Analyzer — OpsPilot AI" }, { name: "description", content: "Analyze support tickets for root cause, severity, and next steps." }] }),
  component: Tickets,
});

const SAMPLE = `Merchant reports voucher redemption failures.
API returns HTTP 401 Unauthorized.
Partner reports issue started after today's deployment.`;

function Tickets() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      <FeatureHeader icon={Ticket} title="AI Ticket Analyzer" description="Paste a support ticket. OpsPilot returns root cause, severity, escalation notes, and a suggested customer response." />
      <SimpleRunner
        feature="ticket"
        placeholder="Paste the full ticket description, logs, or partner report here…"
        sample={SAMPLE}
        ctaLabel="Analyze Ticket"
      />
    </div>
  );
}