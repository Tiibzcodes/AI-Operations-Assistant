import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FeatureHeader } from "@/components/feature-header";
import { Settings as SettingsIcon } from "lucide-react";
import { loadSettings, saveSettings, type Settings } from "@/lib/storage";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({ meta: [{ title: "Settings — OpsPilot AI" }, { name: "description", content: "Configure theme, language, model and notifications for OpsPilot AI." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [s, setS] = useState<Settings>({ theme: "system", language: "en", model: "gemini-flash", notifications: true });
  useEffect(() => { setS(loadSettings()); }, []);
  const update = (patch: Partial<Settings>) => { const next = { ...s, ...patch }; setS(next); saveSettings(next); toast.success("Settings saved"); };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-8">
      <FeatureHeader icon={SettingsIcon} title="Settings" description="Personalize your OpsPilot workspace." />
      <div className="glass rounded-2xl p-6 space-y-6 shadow-elegant">
        <Row label="Theme" hint="Match your system or force light/dark">
          <Select value={s.theme} onValueChange={(v) => update({ theme: v as Settings["theme"] })}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem><SelectItem value="system">System</SelectItem></SelectContent>
          </Select>
        </Row>
        <Row label="Language" hint="Interface language">
          <Select value={s.language} onValueChange={(v) => update({ language: v })}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Español</SelectItem><SelectItem value="fr">Français</SelectItem><SelectItem value="de">Deutsch</SelectItem><SelectItem value="pt">Português</SelectItem></SelectContent>
          </Select>
        </Row>
        <Row label="AI Model" hint="Model used across OpsPilot features">
          <Select value={s.model} onValueChange={(v) => update({ model: v })}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="gemini-flash">Gemini 3 Flash (default)</SelectItem><SelectItem value="gemini-pro">Gemini 3 Pro</SelectItem><SelectItem value="gpt-5">GPT-5</SelectItem></SelectContent>
          </Select>
        </Row>
        <Row label="Notifications" hint="Get toast notifications on AI completion">
          <Switch checked={s.notifications} onCheckedChange={(v) => update({ notifications: v })} />
        </Row>
      </div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <div className="min-w-0">
        <Label className="text-sm">{label}</Label>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}