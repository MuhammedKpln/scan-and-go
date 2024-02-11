import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { DEFAULT_DEPLOY_REGION } from "./helpers/constants";
import { converter } from "./helpers/converter";
import {
  FirebaseCollections,
  FirebaseSubCollectionDocs,
  FirebaseSubCollections,
  IUser,
  IUserPrivatePhone,
  IUserPrivateSocialMediaAccounts,
} from "./helpers/interfaces";

type UserData = Pick<IUser, "firstName" | "lastName">;

export default onCall(
  {
    region: DEFAULT_DEPLOY_REGION,
    cors: true,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "only authenticated users can post"
      );
    }

    const data = request.data as UserData;

    await admin
      .firestore()
      .collection(FirebaseCollections.Profiles)
      .doc(request.auth!.uid)
      .withConverter<IUser>(converter())
      .set({
        bio: "",
        firstName: data.firstName,
        lastName: data.lastName,
        profileImageRef: "",
        sendMessageAllowed: true,
        showPhoneNumber: false,
      });

    const parentDoc = admin
      .firestore()
      .collection(FirebaseCollections.Profiles)
      .doc(request.auth!.uid)
      .collection(FirebaseSubCollections.PrivateSubToProfile);

    const userPhonePrivateDoc = parentDoc
      .doc(FirebaseSubCollectionDocs.PhoneToProfilePrivateSub)
      .withConverter<IUserPrivatePhone>(converter());

    const userSocialPrivateDoc = parentDoc
      .doc(FirebaseSubCollectionDocs.PhoneToProfilePrivateSub)
      .withConverter<IUserPrivateSocialMediaAccounts>(converter());

    const batch = admin.firestore().batch();

    userPhonePrivateDoc.set({
      value: "",
    });

    userSocialPrivateDoc.set({
      twitter: "",
    });

    await batch.commit();
  }
);
