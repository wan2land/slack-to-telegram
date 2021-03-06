import { createVerifier } from "./slack/verify.ts";

import { SlackMessage, SlackMessageEventCallback } from "./slack/message.ts";

function response(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain" },
  });
}

export interface CreateServerHandlerOptions {
  slackSigningSecret: string;
  telegramToken: string;
  telegramChatId: string;
  debug?: boolean;
  match?: (message: SlackMessageEventCallback) => boolean;
  transform?: (message: SlackMessageEventCallback) => string;
}

const defaultMatcher = (message: SlackMessageEventCallback) => {
  return message.event.type === "message" && !message.event.subtype;
};

const defaultTransform = (message: SlackMessageEventCallback) => {
  return [
    "```json",
    JSON.stringify(message.event, null, "  "),
    "```",
  ].join("\n");
};

export function createServerHandler(options: CreateServerHandlerOptions) {
  const verify = createVerifier(options.slackSigningSecret);
  const matcher = options.match ?? defaultMatcher;
  const transform = options.transform ?? defaultTransform;

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

      if (body.type === "event_callback") {
        if (options.debug) {
          console.log(
            `${
              new Date().toLocaleString("en", { timeZone: "UTC" })
            } [request] ${JSON.stringify(body)}`,
          );
        }

        const isMatched = matcher(body);
        if (options.debug) {
          console.log(
            `${
              new Date().toLocaleString("en", { timeZone: "UTC" })
            } [matched] ${isMatched}`,
          );
        }

        if (isMatched) {
          const response = await fetch(
            `https://api.telegram.org/bot${options.telegramToken}/sendMessage`,
            {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                chat_id: options.telegramChatId,
                parse_mode: "markdown",
                disable_web_page_preview: true,
                text: transform(body),
              }),
            },
          );
          if (options.debug) {
            console.log(
              `${
                new Date().toLocaleString("en", { timeZone: "UTC" })
              } [telegram.response] ${
                JSON.stringify({
                  status: response.status,
                  body: await response.text(),
                })
              }`,
            );
          }
        }
      }
      return response("pong");
    } catch (e) {
      console.error(e);
      return response("error", 500);
    }
  };
}
