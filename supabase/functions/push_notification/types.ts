import { Tables } from "../_shared/types.ts";

export interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: Tables<"notifications">;
  schema: "public";
}
