import { FirebaseCollections } from "@/models/firebase_collections.model";
import { doc, getDoc } from "firebase/firestore";
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
}

export const tagService = new TagService();
