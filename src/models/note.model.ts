import { Timestamp } from "firebase/firestore";

export type INote = {
  content: string;
  userUid: string;
  expire_at: Timestamp;
  created_at: Timestamp;
};
