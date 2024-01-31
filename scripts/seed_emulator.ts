import { INote } from "@/models/note.model";
import {
  IUser,
  IUserPrivatePhone,
  IUserPrivateSocialMediaAccounts,
} from "@/models/user.model";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import { initializeApp } from "firebase/app";
import {
  UserCredential,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import {
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  connectFirestoreEmulator,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  appId: process.env.VITE_FIREBASE_APP_ID,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
});

const auth = getAuth();
const db = getFirestore();

connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, "localhost", 8080);

let user: UserCredential;

export const converter = <T>() => ({
  toFirestore: (data: PartialWithFieldValue<T>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot): T => {
    console.log(snap);

    return snap.data() as T;
  },
});

const notesSeeder = () => {
  const notesCollection = collection(db, "notes").withConverter(
    converter<INote>()
  );
  Array(5)
    .fill("")
    .forEach(async () => {
      await addDoc(notesCollection, {
        content: faker.lorem.words(5),
        expire_at: faker.date.soon(),
        created_at: new Date(),
        userUid: user.user.uid,
      });
    });

  console.log("Notes seeded");
};

const tagsSeeder = () => {
  const tagsCollection = collection(db, "tags").withConverter(
    converter<ITag>()
  );

  Array(5)
    .fill("")
    .forEach(async () => {
      await addDoc(tagsCollection, {
        isAvailable: true,
        tagName: faker.company.name(),
        tagNote: faker.lorem.words(5),
        userUid: user.user.uid,
      });
    });
  console.log("Tags seeded");
};

const profilesSeeder = async () => {
  const parentDocRef = doc(db, "profiles", user.user.uid);
  const profilesCollection = parentDocRef.withConverter(converter<IUser>());
  const subCollectionRef = collection(parentDocRef, "private");
  const phoneDocRef = doc(subCollectionRef, "phone").withConverter(
    converter<IUserPrivatePhone>()
  );
  const socialMediaAccountsDocRef = doc(
    subCollectionRef,
    "socialMediaAccounts"
  ).withConverter(converter<IUserPrivateSocialMediaAccounts>());

  await setDoc(phoneDocRef, { value: faker.phone.number() });
  await setDoc(socialMediaAccountsDocRef, {
    twitter: faker.internet.userName(),
  });

  await setDoc(profilesCollection, {
    bio: faker.person.bio(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    profileImageRef: faker.image.avatar(),
    showPhoneNumber: false,
  });

  console.log("Profile seeded");
};

// Function to seed Firestore
const seedFirestore = async (): Promise<void> => {
  user = await createUserWithEmailAndPassword(
    auth,
    "admin@admin.com",
    "admin123"
  );

  notesSeeder();
  tagsSeeder();
  profilesSeeder();
};

// Invoke the seeding function
seedFirestore();
