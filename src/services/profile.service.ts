import {
  FirebaseCollections,
  FirebaseSubCollectionDocs,
  FirebaseSubCollections,
} from "@/models/firebase_collections.model";
import {
  IUser,
  IUserPrivatePhone,
  IUserPrivateSocialMediaAccounts,
} from "@/models/user.model";
import {
  DocumentSnapshot,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { BaseService } from "./base.service";

class ProfileService extends BaseService {
  constructor() {
    super(FirebaseCollections.Profiles);
  }

  updateProfile(userUid: string, data: Partial<IUser>) {
    const docRef = doc(this.collectionRef, userUid).withConverter<IUser>(
      this.converter()
    );

    try {
      return updateDoc(docRef, data);
    } catch (error) {
      throw new Error(
        "Could not update profile with uid: " + userUid + ". Error: " + error
      );
    }
  }

  updateSocialMediaAccounts(
    userUid: string,
    data: Partial<IUserPrivateSocialMediaAccounts>
  ) {
    const collectionRef = this.privateCollectionReference(userUid);
    const docRef = doc(
      collectionRef,
      FirebaseSubCollectionDocs.SocialMediaToProfilePrivateSub
    ).withConverter<IUser>(this.converter());

    try {
      return updateDoc(docRef, data);
    } catch (error) {
      throw new Error(
        "Could not update profile with uid: " + userUid + ". Error: " + error
      );
    }
  }

  fetchPhoneNumber(userUid: string) {
    try {
      const collectionRef = this.privateCollectionReference(userUid);
      const docRef = doc(
        collectionRef,
        FirebaseSubCollectionDocs.PhoneToProfilePrivateSub
      ).withConverter<IUserPrivatePhone>(this.converter());

      return getDoc(docRef);
    } catch (error) {
      throw new Error("Could not access phone number, it is indeed private?");
    }
  }

  fetchSocialMediaAccounts(userUid: string) {
    try {
      const collectionRef = this.privateCollectionReference(userUid);
      const docRef = doc(
        collectionRef,
        FirebaseSubCollectionDocs.SocialMediaToProfilePrivateSub
      ).withConverter<IUserPrivateSocialMediaAccounts>(this.converter());

      return getDoc(docRef);
    } catch (error) {
      throw new Error("Could not access social media, is it there");
    }
  }

  fetchProfile(userUid: string): Promise<DocumentSnapshot<IUser>> {
    const docRef = doc(this.collectionRef, userUid).withConverter<IUser>(
      this.converter()
    );

    try {
      return getDoc(docRef);
    } catch (error) {
      throw new Error(
        "Could not fetch profile with uid: " + userUid + ". Error: " + error
      );
    }
  }

  private privateCollectionReference(userUid: string) {
    return collection(
      this.db,
      FirebaseCollections.Profiles,
      userUid,
      FirebaseSubCollections.PrivateSubToProfile
    );
  }
}

export const profileService = new ProfileService();
