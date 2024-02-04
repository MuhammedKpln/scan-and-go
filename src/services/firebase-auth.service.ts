import {
  FirebaseCollections,
  FirebaseSubCollectionDocs,
  FirebaseSubCollections,
} from "@/models/firebase_collections.model";
import { IRegisterUserForm, IUser } from "@/models/user.model";
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Firestore, collection, doc, setDoc } from "firebase/firestore";
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
      throw new Error(error as string);
    }
  }

  async sendVerificationEmail(user: User) {
    await sendEmailVerification(user);
  }

  private async createProfileSubCollections(uid: string) {
    const parentDocRef = doc(db, FirebaseCollections.Profiles, uid);
    const subCollectionRef = collection(
      parentDocRef,
      FirebaseSubCollections.PrivateSubToProfile
    );
    const phoneDoc = doc(
      subCollectionRef,
      FirebaseSubCollectionDocs.PhoneToProfilePrivateSub
    );
    const socialMediaAccounts = doc(
      subCollectionRef,
      FirebaseSubCollectionDocs.SocialMediaToProfilePrivateSub
    );

    return Promise.all([
      setDoc(phoneDoc, {
        value: null,
      }),
      setDoc(socialMediaAccounts, {
        value: null,
      }),
    ]);
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
        sendMessageAllowed: false,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
