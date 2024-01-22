import {
  browserLocalPersistence,
  browserSessionPersistence,
  connectAuthEmulator,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
} from "firebase/firestore";
import { PropsWithChildren } from "react";
import {
  AuthProvider,
  FirestoreProvider,
  useInitAuth,
  useInitFirestore,
} from "reactfire";

export default function Providers(props: PropsWithChildren) {
  const { status: authLoading, data: auth } = useInitAuth(async (authApp) => {
    const auth = initializeAuth(authApp, {
      persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence,
      ],
    });

    if (process.env.NODE_ENV !== "PRODUCTION") {
      connectAuthEmulator(auth, "http://localhost:9099");
    }
    return auth;
  });

  const { status: firestoreLoading, data: firestoreInstance } =
    useInitFirestore(async (firebaseApp) => {
      const db = initializeFirestore(firebaseApp, {
        localCache: {
          kind: "persistent",
        },
      });

      if (process.env.NODE_ENV !== "PRODUCTION") {
        connectFirestoreEmulator(db, "localhost", 8080);
      }

      return db;
    });

  if (authLoading === "loading" && firestoreLoading === "loading") {
    return null;
  }

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestoreInstance}>
        {props.children}
      </FirestoreProvider>
    </AuthProvider>
  );
}
