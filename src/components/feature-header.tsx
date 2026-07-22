import type { LucideIcon } from "lucide-react";

export function FeatureHeader({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-hero text-white shadow-elegant">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}