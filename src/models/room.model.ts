import { Tables } from "./supabase";
import { IUser } from "./user.model";

export interface IRoom {
  id: string;
  users: string[];
  profiles: IUser[];
  created_at: string;
}

export type IMessage = Tables<"messages">;

export interface IMessageWithProfiles extends IMessage {
  from: IUser;
  to: IUser;
}

export interface INewMessagePayload {
  payload: IMessageWithProfiles;
  event: string;
  type: "broadcast";
}
