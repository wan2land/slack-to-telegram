import { createVerifier } from "./slack/verify.ts";

import { SlackMessage } from "./slack/message.ts";

function response(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain" },
  });
}

function escapeTelegramMarkdown(text: string) {
  return text.replace(/_/g, "\\_").replace(/\*/g, "\\*");
}

export interface CreateServerHandlerOptions {
  slackSigningSecret: string;
  telegramToken: string;
  telegramChatId: string;
  match?: (message: SlackMessage) => boolean;
  transform?: (message: SlackMessage) => string;
}

export function createServerHandler(options: CreateServerHandlerOptions) {
  const verify = createVerifier(options.slackSigningSecret);

  return async (req: Request): Promise<Response> => {
    if (req.method !== "POST") {
      return response("pong");
    }
    const rawbody = await req.text();

    try {
      const body = JSON.parse(rawbody) as SlackMessage;

      if (
        !(await verify(
          rawbody,
          req.headers.get("x-slack-request-timestamp"),
          req.headers.get("x-slack-signature"),
        ))
      ) {
        return response("unauthorized", 401);
      }

      if (body.type === "url_verification") {
        return response(body.challenge);
      }

      if (
        body.type === "event_callback" && body.event.type === "message" &&
        !body.event.subtype
      ) {
        await fetch(
          `https://api.telegram.org/bot${options.telegramToken}/sendMessage`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              chat_id: options.telegramChatId,
              parse_mode: "markdown",
              disable_web_page_preview: true,
              text: escapeTelegramMarkdown(
                JSON.stringify(body.event, null, "  "),
              ),
            }),
          },
        );
      }

      console.log(JSON.stringify(body, null, "  "));

      return response("pong");
    } catch (e) {
      console.log(e);
      return response("error", 500);
    }
  };
}
