import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Check } from "lucide-react";
import { loadProfile, saveProfile } from "@/lib/storage";
import { toast } from "sonner";

// 20 diverse illustrated avatars via DiceBear (deterministic, cached)
const seeds = [
  { s: "Tebello", style: "avataaars" },
  { s: "Amara", style: "avataaars" },
  { s: "Kai", style: "avataaars" },
  { s: "Zara", style: "avataaars" },
  { s: "Diego", style: "avataaars" },
  { s: "Yuki", style: "avataaars" },
  { s: "Priya", style: "avataaars" },
  { s: "Marcus", style: "avataaars" },
  { s: "Sofia", style: "avataaars" },
  { s: "Jamal", style: "avataaars" },
  { s: "Nina", style: "personas" },
  { s: "Leo", style: "personas" },
  { s: "Chen", style: "personas" },
  { s: "Aisha", style: "personas" },
  { s: "Ethan", style: "personas" },
  { s: "Luna", style: "notionists" },
  { s: "Rafael", style: "notionists" },
  { s: "Ivy", style: "notionists" },
  { s: "Omar", style: "notionists" },
  { s: "Mika", style: "notionists" },
];
const AVATARS = seeds.map(({ s, style }) => `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(s)}&backgroundColor=eaf6ff,d9f1ff,ffe4e1,e8f5e9,fff3e0`);

export function AvatarPicker({
  open, onOpenChange, current, name, onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  current: string | null;
  name: string;
  onSave: (avatar: string | null, name: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(current);
  const [displayName, setDisplayName] = useState(name);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (f: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      toast.error("Please upload a JPG, PNG or WebP image");
      return;
    }
    if (f.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setSelected(reader.result as string);
    reader.readAsDataURL(f);
  };

  const save = () => {
    const p = { name: displayName.trim() || "Friend", avatar: selected };
    saveProfile(p);
    onSave(p.avatar, p.name);
    toast.success("Profile updated");
    onOpenChange(false);
  };

  const remove = () => {
    setSelected(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Personalize your profile</DialogTitle>
          <DialogDescription>Pick an illustrated avatar or upload your own photo.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-primary/20 bg-muted shadow-elegant">
            {selected ? (
              <img src={selected} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-muted-foreground">{(displayName[0] || "?").toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Display name</label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-2 h-3.5 w-3.5" /> Upload photo
          </Button>
          <Button variant="outline" size="sm" onClick={remove} disabled={!selected}>
            <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }}
          />
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-muted-foreground">Choose from our library ({AVATARS.length})</p>
          <div className="grid max-h-[320px] grid-cols-4 gap-3 overflow-y-auto rounded-xl border p-3 sm:grid-cols-5 md:grid-cols-6">
            {AVATARS.map((url) => {
              const active = selected === url;
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => setSelected(url)}
                  className={`group relative aspect-square overflow-hidden rounded-full border-2 bg-muted transition-all duration-200 hover:scale-105 hover:shadow-elegant ${active ? "border-primary shadow-elegant" : "border-transparent"}`}
                >
                  <img src={url} alt="Avatar option" className="h-full w-full object-cover" loading="lazy" />
                  {active && (
                    <span className="absolute inset-0 grid place-items-center bg-primary/40">
                      <Check className="h-5 w-5 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}