import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

import { SlackMessage } from "./slack/message.ts";

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
  try {
    const body = await req.json() as SlackMessage;

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
