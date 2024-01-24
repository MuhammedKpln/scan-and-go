import { Timestamp } from "firebase/firestore";

export type INote = {
  title: string;
  content: string;
  expire_at: Timestamp;
  userUid: string;
};
