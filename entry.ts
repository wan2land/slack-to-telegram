import { serve } from "https://deno.land/std@0.125.0/http/server.ts";
import { createVerifier } from "./slack/verify.ts";

import { SlackMessage } from "./slack/message.ts";

const SLACK_SIGNING_SECRET = Deno.env.get("SLACK_SIGNING_SECRET") ?? "";

const verify = createVerifier(SLACK_SIGNING_SECRET);

function response(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain" },
  });
}

serve(async (req) => {
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

    console.log("->", body);

    return response("pong");
  } catch (e) {
    console.log(e);
    return response("error", 500);
  }
});
