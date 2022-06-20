# Slack To Telegram

## Installation

**Slack**

1. https://api.slack.com/apps
2. Click `Create New App`
3. Click `Event Subscriptions`
4. Turn on `Enable Events`
5. Copy your deno URL, paste to `Request URL`
6. `Subscribe to bot events` -> `Add Bot User Event` -> `message.channels`
7. Click `Save Changes`

**Telegram**

1. https://t.me/botfather
2. Create bot
3. Copy token
4. https://api.telegram.org/bot{token}/getUpdates?limit=10

**Deno Deploy**

1.

## Usage

```ts
import { serve } from "https://deno.land/std@0.125.0/http/server.ts";
import { unescapeHtml } from "https://deno.land/x/escape@1.3.0/mod.ts";
import { createServerHandler } from "https://raw.githubusercontent.com/wan2land/slack-to-telegram/0.0.1/server.ts";

const SLACK_SIGNING_SECRET = Deno.env.get("SLACK_SIGNING_SECRET") ?? "";
const TELEGRAM_TOKEN = Deno.env.get("TELEGRAM_TOKEN") ?? "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";

const serverHandler = createServerHandler({
  slackSigningSecret: SLACK_SIGNING_SECRET,
  telegramToken: TELEGRAM_TOKEN,
  telegramChatId: TELEGRAM_CHAT_ID,
  match: (message) => {
    return message.event.type === "message"
      && !message.event.subtype)
      && message.event.bot_id
  },
  transform: (message) => {
    const title = unescapeHtml(message.event.attachments[0].title);
    const titleLink = message.event.attachments[0].title_link;
    const text = message.event.attachments[0].text;
    return [
      `*${title}*`,
      text,
      "",
      `${titleLink}`,
    ].join("\n");
  },
});

serve(serverHandler);
```
