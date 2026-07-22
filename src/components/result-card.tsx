import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Markdown } from "./markdown";
import { AIDisclaimer } from "./ai-disclaimer";

export function ResultCard({
  content,
  onRegenerate,
  filename = "opspilot-output.md",
}: {
  content: string;
  onRegenerate?: () => void;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  };
  const download = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="glass rounded-2xl p-6 shadow-elegant animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-end gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}<span className="ml-1.5">Copy</span></Button>
        {onRegenerate && <Button variant="outline" size="sm" onClick={onRegenerate}><RefreshCw className="h-4 w-4 mr-1.5" />Regenerate</Button>}
        <Button variant="outline" size="sm" onClick={download}><Download className="h-4 w-4 mr-1.5" />Export</Button>
      </div>
      <Markdown>{content}</Markdown>
      <div className="mt-4"><AIDisclaimer /></div>
    </div>
  );
}