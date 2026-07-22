import { useEffect } from "react";
import { loadSettings } from "@/lib/storage";

export function ThemeSync() {
  useEffect(() => {
    const apply = () => {
      const s = loadSettings();
      const root = document.documentElement;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = s.theme === "dark" || (s.theme === "system" && prefersDark);
      root.classList.toggle("dark", dark);
    };
    apply();
    window.addEventListener("opspilot:settings", apply);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => {
      window.removeEventListener("opspilot:settings", apply);
      mq.removeEventListener("change", apply);
    };
  }, []);
  return null;
}