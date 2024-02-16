import { FirebaseCollections } from "@/models/firebase_collections.model";
import { INote } from "@/models/note.model";
import {
  PartialWithFieldValue,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { BaseService } from "./base.service";

class NoteService extends BaseService {
  fetchLatestNote(userUid: string) {
    const queryRef = query(
      this.collectionRef,
      where("userUid", "==", userUid),
      where("expire_at", ">", new Date(Date.now() + 10000)),
      orderBy("expire_at", "asc"),
      limit(1)
    ).withConverter<INote>(this.converter());

    try {
      return getDocs(queryRef);
    } catch (error) {
      throw new Error("Error while fetch latest notes");
    }
  }

  fetchLatestNotes(userUid: string) {
    const queryRef = query(
      this.collectionRef,
      where("userUid", "==", userUid),
      where("expire_at", ">", new Date(Date.now() + 10000)),
      orderBy("expire_at", "asc")
    ).withConverter<INote>(this.converter());

    try {
      return getDocs(queryRef);
    } catch (error) {
      throw new Error("Error while fetch latest notes");
    }
  }

  addNewNote(data: PartialWithFieldValue<INote>) {
    try {
      const collectionRef = collection(
        this.db,
        FirebaseCollections.Notes
      ).withConverter<INote>(this.converter());

      return addDoc(collectionRef, data);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  deleteNote(noteUid: string) {
    try {
      const docRef = doc(this.db, FirebaseCollections.Notes, noteUid);

      return deleteDoc(docRef);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  updateNote(noteUid: string, data: PartialWithFieldValue<INote>) {
    try {
      const docRef = doc(
        this.db,
        FirebaseCollections.Notes,
        noteUid
      ).withConverter<INote>(this.converter());

      return updateDoc(docRef, data);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

export const noteService = new NoteService();
