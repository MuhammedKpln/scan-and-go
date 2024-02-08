import { IFcmToken } from "@/models/fcm-token.model";
import { FirebaseCollections } from "@/models/firebase_collections.model";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { BaseService } from "./base.service";

class FcmService extends BaseService {
  constructor() {
    super(FirebaseCollections.FcmTokens);
  }

  registerNewToken(userUid: string, token: string) {
    const docRef = doc(
      this.db,
      FirebaseCollections.FcmTokens,
      userUid
    ).withConverter<IFcmToken>(this.converter());

    try {
      setDoc(docRef, { timestamp: Timestamp.fromDate(new Date()), token });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

export const fcmService = new FcmService();
