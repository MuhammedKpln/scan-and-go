import { CloudFunctions } from "@/models/cloud-functions";
import { IRegisterUserForm } from "@/models/user.model";
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, cloudFunctions, db } from "./firebase.service";

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

      const createUserProfile = httpsCallable(
        cloudFunctions,
        CloudFunctions.CreateUserProfile
      );

      if (user) {
        await createUserProfile({
          firstName: data.firstName,
          lastName: data.lastName,
        });
        await this.sendVerificationEmail(user.user);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async sendVerificationEmail(user: User) {
    await sendEmailVerification(user, {
      url: "http://localhost:8100",
    });
  }
}

export const fbAuthService = new FirebaseAuthService(auth, db);
