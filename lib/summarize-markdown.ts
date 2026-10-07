import { createGateway } from "@ai-sdk/gateway";
import { generateText } from "ai";

const SUMMARY_MODEL = "openai/gpt-4o-mini";

export async function summarizeMarkdown(url: string, markdown: string): Promise<string> {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    throw new Error("AI_GATEWAY_API_KEY is not configured.");
  }

  const gateway = createGateway({ apiKey });
  const trimmed = markdown.length > 80_000 ? `${markdown.slice(0, 80_000)}\n\n[truncated]` : markdown;

  const { text } = await generateText({
    model: gateway(SUMMARY_MODEL),
    prompt: `You summarize web pages for a Telegram notification. Use plain text only (no Markdown).

URL: ${url}

Page content:
${trimmed}

Write:
- 3–6 bullet points of the main ideas
- One final line starting with "Takeaway:" with a single-sentence conclusion
Keep the whole reply under 1200 characters when possible.`,
  });

  const summary = text.trim();
  if (!summary) {
    throw new Error("The model returned an empty summary.");
  }

  return summary;
}
