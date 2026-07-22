import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function FloatingAI() {
  return (
    <Link
      to="/chat"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full gradient-hero text-white shadow-glow transition-transform hover:scale-110"
      aria-label="Open AI Assistant"
    >
      <Sparkles className="h-6 w-6" />
    </Link>
  );
}