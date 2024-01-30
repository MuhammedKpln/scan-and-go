import { FirebaseCollections } from "@/models/firebase_collections.model";
import { INote } from "@/models/note.model";
import { getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { BaseService } from "./base.service";

class NoteService extends BaseService {
  constructor() {
    super(FirebaseCollections.Notes);
  }

  fetchLatestNotes(userUid: string) {
    const queryRef = query(
      this.collectionRef,
      where("userUid", "==", userUid),
      where("expire_at", ">", new Date()),
      orderBy("expire_at", "asc"),
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
