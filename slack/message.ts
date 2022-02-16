export type SlackMessage = SlacekMessageUrlVerification;

export interface SlacekMessageUrlVerification {
  type: "url_verification";
  challenge: string;
  token: string;
}
