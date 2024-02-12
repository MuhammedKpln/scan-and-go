import { CloudFunctions } from "@/models/cloud-functions";
import { IRegisterUserForm } from "@/models/user.model";
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, cloudFunctions } from "./firebase.service";

export class FirebaseAuthService {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
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
    const returnUrl = import.meta.env.PROD
      ? import.meta.env.VITE_FIREBASE_AUTH_RETURN_URL
      : "http://localhost:8100";

    await sendEmailVerification(user, {
      url: returnUrl,
    });
  }
}

export const fbAuthService = new FirebaseAuthService(auth);
