import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { uid } from "@/lib/storage";
import { z } from "zod";

export const Route = createFileRoute("/_shell/chat/")({
  head: () => ({ meta: [{ title: "AI Chat — OpsPilot AI" }, { name: "description", content: "Persistent AI workplace chat for incidents, escalations, and daily ops questions." }] }),
  validateSearch: z.object({ q: z.string().optional() }),
  component: NewChat,
});

function NewChat() {
  const navigate = useNavigate();
  const { q } = useSearch({ from: "/_shell/chat/" });
  useEffect(() => {
    const id = uid();
    navigate({ to: "/chat/$threadId", params: { threadId: id }, search: q ? { q } : {}, replace: true });
  }, [navigate, q]);
  return null;
}