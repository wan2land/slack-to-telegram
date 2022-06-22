export type SlackMessage =
  | SlackMessageUrlVerification
  | SlackMessageEventCallback;

export interface SlackMessageUrlVerification {
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
  blocks: BlockRoot[];
  attachments: Attachment[];
}

export interface EventMessageNew extends EventMessage {
  subtype: undefined;
  bot_id?: string;
  bot_profile?: BotProfile;
  channel: string;
  event_ts: string;
  channel_type: "channel";
}

export interface EventMessageChanged {
  bot_id?: string;
  bot_profile?: BotProfile;
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
  bot_id?: string;
  bot_profile?: BotProfile;
  type: "message";
  subtype: "message_deleted";
  previous_message: EventMessage & {
    edited?: { user: string; ts: string };
  };

  channel: string;
  hidden: boolean;
  deleted_ts: string;
  event_ts: string;
  ts: string;
  channel_type: "channel";
}

export interface EventMessageBotMessage {
  type: "message";
  subtype: "bot_message";
  text: string;
  bot_id: string;
  blocks: BlockRoot[];

  channel: string;
  event_ts: string;
  ts: string;
  channel_type: "channel";
}

export type BlockRoot = BlockRichText | BlockSection;

// https://api.slack.com/reference/block-kit/blocks#section
export interface BlockSection {
  type: "section";
  block_id: string;
  text: BlockTextObject;
}

// https://api.slack.com/reference/block-kit/composition-objects#text
export type BlockTextObject = BlockMarkdown | BlockPlainText;

export interface BlockMarkdown {
  type: "mrkdwn";
  text: string;
  verbatim?: boolean;
}

export interface BlockPlainText {
  type: "plain_text";
  text: string;
  emoji?: boolean;
}

export interface BlockRichText {
  type: "rich_text";
  block_id: string;
  element: BlockRichTextSection[];
}

export interface BlockRichTextSection {
  type: "rich_text_section";
  elements: BlockText[];
}

export interface BlockText {
  type: "text";
  text: string;
}

export interface BotProfile {
  id: string;
  deleted: boolean;
  name: string;
  updated: number;
  app_id: string;
  icons: {
    image_36: string;
    image_48: string;
    image_72: string;
  };
  team_id: string;
}

export interface Attachment {
  id: number;
  footer_icon: string;
  ts: number;
  color: string;
  fallback: string;
  text: string;
  title: string;
  title_link: string;
  callback_id: string;
  footer: string;
  mrkdwn_in: ("text")[];
  actions: {
    id: string;
    name: string;
    text: string;
    type: string;
    value: string;
    style: string;
  }[];
}
