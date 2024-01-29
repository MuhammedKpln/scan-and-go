import { FirebaseCollections } from "@/models/firebase_collections.model";
import { INote } from "@/models/note.model";
import {
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import { BaseService } from "./base.service";

class NoteService extends BaseService {
  constructor() {
    super(FirebaseCollections.Notes);
  }

  fetchLatestNotes(userUid: string) {
    const queryRef = query(
      this.collectionRef,
      orderBy("created_at", "desc"),
      where("userUid", "==", userUid),
      startAt("expire_at", new Date()),
      limit(1)
    ).withConverter(this.converter<INote>());

    try {
      return getDocs(queryRef);
    } catch (error) {
      throw new Error("Error while fetch latest notes");
    }
  }
}

export const noteService = new NoteService();
