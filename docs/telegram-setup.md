# Telegram setup

## Environment

See [`.env.example`](../.env.example) for `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET_TOKEN`, and `TELEGRAM_CHAT_ID` (proactive pushes from the **web UI** only).

## Webhook

Register after deploy:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://YOUR_APP.vercel.app/eve/v1/telegram",
       "secret_token":"'"$TELEGRAM_WEBHOOK_SECRET_TOKEN"'",
       "allowed_updates":["message","callback_query"]}'
```

## Bot command menu (optional)

In [@BotFather](https://t.me/BotFather):

1. Send `/setcommands`
2. Select your bot (e.g. `@eve_test_test_bot`)
3. Paste:

```text
summarize - Summarize a web page
```

Users can then pick **summarize** from the `/` menu in private chat, or type `/summarize` and follow the prompt for a URL.

## Chat ID

Message the bot, then read `chat.id` from `getUpdates` (delete webhook first if webhook is active). See `scripts/print-telegram-chat-id.sh`.
