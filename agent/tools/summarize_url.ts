import { defineWorkflowTool } from "eve/tools";
import { z } from "zod";
import { extractUrlMarkdown } from "../../lib/tavily-extract";
import { summarizeMarkdown } from "../../lib/summarize-markdown";
import {
  notifyTelegramCompleted,
  notifyTelegramFailed,
} from "../../lib/telegram-notify";

async function scrapeStep(url: string) {
  "use step";
  return extractUrlMarkdown(url);
}

async function summarizeStep(url: string, markdown: string) {
  "use step";
  return summarizeMarkdown(url, markdown);
}

async function notifyCompletedStep(url: string, summary: string) {
  "use step";
  await notifyTelegramCompleted(url, summary);
}

async function notifyFailedStep(url: string, errorMessage: string) {
  "use step";
  await notifyTelegramFailed(url, errorMessage);
}

export default defineWorkflowTool({
  description:
    "Scrape a URL with Tavily, summarize the content, notify Telegram, and return the summary.",
  inputSchema: z.object({
    url: z.url(),
  }),
  async *execute({ url }, _ctx) {
    "use workflow";

    try {
      yield { phase: "scraping" as const };
      const markdown = await scrapeStep(url);

      yield { phase: "summarizing" as const };
      const summary = await summarizeStep(url, markdown);

      yield { phase: "notifying" as const };
      await notifyCompletedStep(url, summary);

      return { status: "completed" as const, url, summary };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      try {
        await notifyFailedStep(url, message);
      } catch {
        // Best-effort failure notification; still return failed status to the UI.
      }
      return { status: "failed" as const, url, error: message };
    }
  },
});
