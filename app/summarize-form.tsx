"use client";

import { useEveAgent } from "eve/react";
import { FormEvent, useMemo, useState } from "react";

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function textFromMessageParts(
  parts: ReadonlyArray<{ type: string; text?: string }>,
): string {
  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("\n")
    .trim();
}

export function SummarizeForm() {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const agent = useEveAgent();

  const isBusy =
    agent.status === "submitted" || agent.status === "streaming";
  const isResuming = agent.status === "resuming";

  const statusLabel = useMemo(() => {
    switch (agent.status) {
      case "ready":
        return "Ready";
      case "submitted":
        return "Submitted";
      case "streaming":
        return "Working…";
      case "resuming":
        return "Resuming…";
      case "error":
        return "Error";
      default:
        return agent.status;
    }
  }, [agent.status]);

  const assistantText = useMemo(() => {
    const assistants = agent.data.messages.filter((m) => m.role === "assistant");
    const last = assistants.at(-1);
    if (!last) return null;
    return textFromMessageParts(last.parts);
  }, [agent.data.messages]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!isValidHttpUrl(trimmed)) {
      setValidationError("Enter a valid http or https URL.");
      return;
    }
    setValidationError(null);
    if (!isResuming) {
      await agent.send(trimmed);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">URL summarizer</h1>
        <p className="text-muted-foreground text-sm">
          Scrape with Tavily, summarize with AI, and notify your Telegram bot.
        </p>
      </header>

      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor="url">
          Page URL
          <input
            className="border-input bg-background ring-offset-background focus-visible:ring-ring rounded-md border px-3 py-2 text-base outline-none focus-visible:ring-2"
            disabled={isBusy || isResuming}
            id="url"
            name="url"
            placeholder="https://example.com/article"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>
        {validationError ? (
          <p className="text-destructive text-sm">{validationError}</p>
        ) : null}
        <button
          className="bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 rounded-md px-4 py-2 text-sm font-medium"
          disabled={isBusy || isResuming || url.trim().length === 0}
          type="submit"
        >
          {isBusy ? "Summarizing…" : "Summarize"}
        </button>
      </form>

      <section
        aria-live="polite"
        className="border-border bg-card text-card-foreground rounded-lg border p-4"
      >
        <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
          Status: {statusLabel}
        </p>
        {agent.error ? (
          <p className="text-destructive text-sm">{agent.error.message}</p>
        ) : null}
        {assistantText ? (
          <pre className="whitespace-pre-wrap font-sans text-sm">{assistantText}</pre>
        ) : (
          <p className="text-muted-foreground text-sm">
            Submit a URL to see the summary here and in Telegram.
          </p>
        )}
      </section>
    </div>
  );
}
