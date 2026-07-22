const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callAI(messages: ChatMessage[], model = "google/gemini-3-flash-preview"): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({ model, messages }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in your workspace billing.");
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "";
}