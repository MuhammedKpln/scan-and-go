import { Timestamp } from "firebase/firestore";

export interface IFcmToken {
  timestamp: Timestamp;
  token: string;
}
