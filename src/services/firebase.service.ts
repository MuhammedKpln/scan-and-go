import { initializeApp } from "firebase/app";
import {
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  QuerySnapshot
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmH5y9SuxaRCt9H4uIcQy3MdbbepSyv5Q",
  authDomain: "scango-7ccc8.firebaseapp.com",
  projectId: "scango-7ccc8",
  storageBucket: "scango-7ccc8.appspot.com",
  messagingSenderId: "494333650521",
  appId: "1:494333650521:web:e055a1d1046ffdee17b348",
};

const firebaseApp = initializeApp(firebaseConfig);

const converter = <T>() => ({
  toFirestore: (data: PartialWithFieldValue<T>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot): T => {
    console.log(snap)

    return snap.data() as T
  },
});

const listConverter = <T>() => ({
  toFirestore: (data: PartialWithFieldValue<T>) => data,
  fromFirestore: (snap: QuerySnapshot) => {
    console.log(snap)
    const s = snap.docs.map((e) => e.data() as T )

    return {
      ...snap,
      docs: s
    }
  },

})



export { converter, firebaseApp, firebaseConfig, listConverter };

