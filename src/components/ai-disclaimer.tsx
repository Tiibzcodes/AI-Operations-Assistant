import { AlertTriangle } from "lucide-react";

export function AIDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground ${className}`}>
      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent" />
      <span>AI-generated responses may contain inaccuracies. Always validate technical recommendations before implementing changes in production.</span>
    </div>
  );
}