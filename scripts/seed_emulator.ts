import { IUser } from "@/models/user.model";
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
  getFirestore,
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
  const notesCollection = collection(db, "notes");
  Array(5)
    .fill("")
    .forEach(async () => {
      await addDoc(notesCollection, {
        title: faker.lorem.words(5),
        content: faker.lorem.words(10),
        expire_at: faker.date.soon(),
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

const profilesSeeder = () => {
  const profilesCollection = collection(db, "profiles").withConverter(
    converter<IUser>()
  );

  Array(5)
    .fill("")
    .forEach(async () => {
      await addDoc(profilesCollection, {
        bio: faker.person.bio(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        profileImageRef: faker.image.avatar(),
      });
    });

  console.log("Profiles seeded");
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
