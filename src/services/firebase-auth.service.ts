import {
  FirebaseCollections,
  FirebaseSubCollectionDocs,
  FirebaseSubCollections,
} from "@/models/firebase_collections.model";
import {
  IRegisterUserForm,
  IUser,
  IUserPrivatePhone,
  IUserPrivateSocialMediaAccounts,
} from "@/models/user.model";
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Firestore, addDoc, collection, doc, setDoc } from "firebase/firestore";
import { converter, db } from "./firebase.service";

export class FirebaseAuthService {
  private auth: Auth;
  private firestore: Firestore;

  constructor(auth: Auth, firestore: Firestore) {
    this.auth = auth;
    this.firestore = firestore;
  }

  async createUser(data: IRegisterUserForm) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      if (user) {
        await this.createProfile(user.user.uid, data);
        await this.createProfileSubCollections(user.user.uid);
        await this.sendVerificationEmail(user.user);
      }
    } catch (error) {
      throw error;
    }
  }

  async sendVerificationEmail(user: User) {
    await sendEmailVerification(user);
  }

  private async createProfileSubCollections(uid: string) {
    const socialRef = collection(
      db,
      FirebaseCollections.Profiles,
      uid,
      FirebaseSubCollections.PrivateSubToProfile,
      FirebaseSubCollectionDocs.SocialMediaToProfilePrivateSub
    ).withConverter<IUserPrivateSocialMediaAccounts>(converter());

    const phoneRef = collection(
      db,
      FirebaseCollections.Profiles,
      uid,
      FirebaseSubCollections.PrivateSubToProfile,
      FirebaseSubCollectionDocs.PhoneToProfilePrivateSub
    ).withConverter<IUserPrivatePhone>(converter());

    addDoc(socialRef, {});
    addDoc(phoneRef, { value: "" });
  }

  private async createProfile(uid: string, data: IUser) {
    try {
      const docRef = doc(
        this.firestore,
        FirebaseCollections.Profiles,
        uid
      ).withConverter<IUser>(converter<IUser>());

      await setDoc(docRef, {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: "",
        profileImageRef: "",
        showPhoneNumber: false,
      });
    } catch (error) {
      throw error;
    }
  }
}
