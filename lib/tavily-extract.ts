const TAVILY_EXTRACT_URL = "https://api.tavily.com/extract";

type TavilyExtractResponse = {
  results?: Array<{ url: string; raw_content?: string }>;
  failed_results?: Array<{ url: string; error?: string }>;
};

export async function extractUrlMarkdown(url: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured.");
  }

  const response = await fetch(TAVILY_EXTRACT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      urls: url,
      format: "markdown",
      extract_depth: "basic",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Tavily extract failed (${response.status}): ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as TavilyExtractResponse;

  const failed = data.failed_results?.[0];
  if (failed) {
    throw new Error(failed.error ?? `Tavily could not extract ${failed.url}`);
  }

  const content = data.results?.[0]?.raw_content?.trim();
  if (!content) {
    throw new Error("Tavily returned no content for this URL.");
  }

  return content;
}
