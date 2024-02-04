import { Timestamp } from "firebase/firestore";
import { IUser } from "./user.model";

export interface IRoom {
  users: string[];
  created_at: Timestamp;
  recentMessage: IMessage;
  messages: IMessage[];
}

export interface IRoomWithId {
  [id: string]: IRoom;
}

export interface IMessage {
  sendBy: string;
  message: string;
  created_at: Timestamp;
  user?: IUser;
}
