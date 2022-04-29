import { serve } from "https://deno.land/std@0.125.0/http/server.ts";
import { createServerHandler } from "./server.ts";

const SLACK_SIGNING_SECRET = Deno.env.get("SLACK_SIGNING_SECRET") ?? "";
const TELEGRAM_TOKEN = Deno.env.get("TELEGRAM_TOKEN") ?? "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";

const serverHandler = createServerHandler({
  slackSigningSecret: SLACK_SIGNING_SECRET,
  telegramToken: TELEGRAM_TOKEN,
  telegramChatId: TELEGRAM_CHAT_ID,
});

serve(serverHandler);
