import { Timestamp } from "firebase/firestore";

export type INote = {
  content: string;
  userUid: string;
  tagUid: string;
  expire_at: Timestamp;
  created_at: Timestamp;
};
export type INoteWithId = {
  [id: string]: INote;
};
