import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import {
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(config);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
export const auth = initializeAuth(app, {
  persistence: [browserLocalPersistence, indexedDBLocalPersistence],
});

if (!import.meta.env.PROD) {
  connectAuthEmulator(auth, "http://192.168.1.166:9099", {
    disableWarnings: true,
  });
  connectFirestoreEmulator(db, "192.168.1.166", 8080);
}

export const converter = <T>() => ({
  toFirestore: (data: PartialWithFieldValue<T>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot): T => {
    console.log(snap);

    return snap.data() as T;
  },
});
