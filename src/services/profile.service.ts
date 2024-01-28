import { FirebaseCollections } from "@/models/firebase_collections.model";
import { IUser } from "@/models/user.model";
import { doc, getDoc } from "firebase/firestore";
import { BaseService } from "./base.service";

class ProfileService extends BaseService {
  constructor() {
    super(FirebaseCollections.Profiles);
  }

  fetchProfile(userUid: string) {
    const docRef = doc(this.collectionRef, userUid).withConverter(
      this.converter<IUser>()
    );

    try {
      return getDoc(docRef);
    } catch (error) {
      throw new Error(
        "Could not fetch profile with uid: " + userUid + ". Error: " + error
      );
    }
  }
}

export const profileService = new ProfileService();
