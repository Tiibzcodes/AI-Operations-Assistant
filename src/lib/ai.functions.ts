import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAI, type ChatMessage } from "./ai-gateway.server";

const BASE_STYLE = `You are OpsPilot AI, an enterprise-grade productivity copilot for Operations, Technical Support, Customer Success, and Integration teams.
Always respond professionally using structured markdown headings, concise bullet points, highlighted risks, and clear next steps.
Use enterprise business language. Avoid unsupported assumptions. Never guarantee correctness — recommend validation for production changes.`;

const PROMPTS: Record<string, string> = {
  ticket: `${BASE_STYLE}

Analyze the support ticket the user provides. Respond in markdown with exactly these sections:
## Executive Summary
## Possible Root Cause
## Troubleshooting Checklist
## Customer Response
## Internal Escalation Notes
## Severity Level
## Suggested Team
## Estimated Priority
## Recommended Next Steps`,

  email: `${BASE_STYLE}

Draft a professional email. Output markdown with these sections in order:
**Subject:** ...
**Greeting:** ...
**Body:** ...
**Call To Action:** ...
**Closing:** ...
**Signature:** [Your Name]`,

  meeting: `${BASE_STYLE}

Summarize the meeting notes. Respond in markdown with sections:
## Executive Summary
## Key Decisions
## Action Items (with owners & deadlines)
## Risks
## Open Questions`,

  research: `${BASE_STYLE}

Answer the research question. Respond in markdown with sections:
## Simple Explanation
## Real-world Example
## Best Practices
## Common Mistakes
## Additional Learning Resources`,

  planner: `${BASE_STYLE}

Create a daily/weekly plan from the user's tasks. Respond in markdown with:
## Daily Schedule (time blocks)
## Weekly Planner
## Priority Matrix (Urgent/Important quadrants)
## Suggested Focus Order
## Break Recommendations
## Productivity Tips`,

  chat: BASE_STYLE,
};

export const runAI = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        feature: z.enum(["ticket", "email", "meeting", "research", "planner", "chat"]),
        prompt: z.string().min(1).max(20000),
        history: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
          .optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const system = PROMPTS[data.feature];
    const messages: ChatMessage[] = [{ role: "system", content: system }];
    if (data.history) messages.push(...data.history);
    messages.push({ role: "user", content: data.prompt });
    const content = await callAI(messages);
    return { content };
  });