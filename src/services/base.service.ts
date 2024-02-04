import { FirebaseCollections } from "@/models/firebase_collections.model";
import {
  CollectionReference,
  Firestore,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  collection,
} from "firebase/firestore";
import { db } from "./firebase.service";

export interface IGeneralOptions {
  fromCache?: boolean;
}

export class BaseService {
  protected db: Firestore;
  protected collectionRef: CollectionReference;

  constructor(collectionReference: FirebaseCollections) {
    this.db = db;
    this.collectionRef = collection(this.db, collectionReference);
  }

  protected converter<T>() {
    return {
      toFirestore: (data: PartialWithFieldValue<T>) => data,
      fromFirestore: (snap: QueryDocumentSnapshot): T => snap.data() as T,
    };
  }
}
