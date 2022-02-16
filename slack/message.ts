export type SlackMessage =
  | SlacekMessageUrlVerification
  | SlackMessageEventCallback;

export interface SlacekMessageUrlVerification {
  type: "url_verification";
  challenge: string;
  token: string;
}

export interface SlackMessageEventCallback {
  type: "event_callback";
  token: string;
  team_id: string;
  api_app_id: string;
}
