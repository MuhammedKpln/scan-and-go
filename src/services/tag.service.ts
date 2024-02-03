import { FirebaseCollections } from "@/models/firebase_collections.model";
import {
  PartialWithFieldValue,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { BaseService } from "./base.service";

class TagService extends BaseService {
  constructor() {
    super(FirebaseCollections.Tags);
  }

  async fetchTag(tagUid: string) {
    const docRef = doc(this.collectionRef, tagUid).withConverter<ITag>(
      this.converter()
    );

    return getDoc(docRef);
  }

  async fetchTags(userUid: string): Promise<ITagWithId[]> {
    try {
      const queryRef = query(
        this.collectionRef,
        where("userUid", "==", userUid)
      ).withConverter<ITag>(this.converter());

      const docs = await getDocs(queryRef);

      return docs.docs.map((e) => ({
        [e.id]: e.data(),
      }));
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async addNewTag(userUid: string, data: PartialWithFieldValue<ITag>) {
    try {
      const collectionRef = collection(
        this.db,
        FirebaseCollections.Tags
      ).withConverter<ITag>(this.converter());

      return addDoc(collectionRef, data);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updateTag(tagUid: string, data: PartialWithFieldValue<ITag>) {
    try {
      const docRef = doc(
        this.db,
        FirebaseCollections.Tags,
        tagUid
      ).withConverter<ITag>(this.converter());

      return updateDoc(docRef, data);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

export const tagService = new TagService();
