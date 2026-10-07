const TELEGRAM_MESSAGE_LIMIT = 4096;

function requireTelegramConfig(): { token: string; chatId: string } {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }
  if (!chatId?.trim()) {
    throw new Error(
      "TELEGRAM_CHAT_ID is not configured. Message your bot, then read chat.id from getUpdates.",
    );
  }
  return { token, chatId: chatId.trim() };
}

async function sendTelegramChunk(token: string, chatId: string, text: string): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram sendMessage failed (${response.status}): ${body.slice(0, 200)}`);
  }
}

export async function sendTelegramPlainText(text: string): Promise<void> {
  const { token, chatId } = requireTelegramConfig();

  for (let offset = 0; offset < text.length; offset += TELEGRAM_MESSAGE_LIMIT) {
    const chunk = text.slice(offset, offset + TELEGRAM_MESSAGE_LIMIT);
    await sendTelegramChunk(token, chatId, chunk);
  }
}

export async function notifyTelegramCompleted(url: string, summary: string): Promise<void> {
  const message = `Completed\n\nURL: ${url}\n\n${summary}`;
  await sendTelegramPlainText(message);
}

export async function notifyTelegramFailed(url: string, errorMessage: string): Promise<void> {
  const message = `Failed\n\nURL: ${url}\n\n${errorMessage.slice(0, 500)}`;
  await sendTelegramPlainText(message);
}
