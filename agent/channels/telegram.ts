import {
  defaultTelegramAuth,
  telegramChannel,
} from "eve/channels/telegram";

export default telegramChannel({
  botUsername: "eve_test_test_bot",
  onMessage(_ctx, message) {
    return {
      auth: defaultTelegramAuth(message),
      context: [
        "The user is in a private Telegram chat with the bot.",
        "When you call summarize_url, always pass notifyTelegram: false.",
        "Deliver results only as replies in this Telegram chat, not via proactive push.",
      ],
    };
  },
});
