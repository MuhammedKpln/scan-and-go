import {
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
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
    return auth;
  });

  const { status: firestoreLoading, data: firestoreInstance } =
    useInitFirestore(async (firebaseApp) => {
      const db = initializeFirestore(firebaseApp, {
        localCache: {
          kind: "persistent",
        },
      });
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
