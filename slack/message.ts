export type SlackMessage =
  | SlacekMessageUrlVerification
  | SlackMessageEventCallback;

export interface SlacekMessageUrlVerification {
  type: "url_verification";
  challenge: string;
  token: string; // Deprecated
}

export interface SlackMessageEventCallback {
  type: "event_callback";
  token: string; // Deprecated
  team_id: string;
  api_app_id: string;
  authed_users: string[];
  authorizations: {
    enterprise_id: null;
    team_id: string;
    user_id: string;
    is_bot: boolean;
    is_enterprise_install: boolean;
  }[];
  event_id: string;
  event_time: number;
  event_context: string;
  event: EventMessageNew | EventMessageChanged | EventMessageDeleted;
}

export interface EventMessage {
  client_msg_id: string;
  type: "message";
  text: string;
  user: string;
  ts: string;
  team: string;
  // blocks: [ { type: "rich_text", block_id: "", elements: [Array] } ],
}

export interface EventMessageNew extends EventMessage {
  channel: string;
  channel_type: "channel";

  event_ts: string;
}

export interface EventMessageChanged {
  type: "message";
  subtype: "message_changed";
  message: EventMessage & {
    edited?: { user: string; ts: string };
    source_team: string;
    user_team: string;
  };
  previous_message: EventMessage;

  channel: string;
  channel_type: "channel";

  hidden: boolean;
  ts: string;

  event_ts: string;
}

export interface EventMessageDeleted {
  type: "message";
  subtype: "message_deleted";
  previous_message: EventMessage;

  channel: string;
  channel_type: "channel";

  hidden: boolean;
  ts: string;
  event_ts: string;
  deleted_ts: string;
}
